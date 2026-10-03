import { normalizeMainRpSource } from '../platform/sillytavern/message-events.mjs';
import { createHandoffProposal, HANDOFF_ACTION_KIND, HANDOFF_PROPOSAL_STATUS } from './proposal.mjs';

const BLOCKED_INTENT = /\b(?:thought\s+about|considered|wanted\s+to|plan(?:ned)?\s+to|will|would|going\s+to|did\s+not|didn't|never)\b/i;
const REPORTED = /\b(?:told\s+me|said\s+that|heard\s+that)\b/i;
const ACTIONS = new Set(Object.values(HANDOFF_ACTION_KIND));

function exactlyOneBinding(source, label) {
  const rows = source.mentionBindings[label] || [];
  return rows.length === 1 ? rows[0] : null;
}

function explicitCandidate(action) {
  const completed = action?.completed === true && !['future', 'hypothetical', 'negated', 'cancelled'].includes(action?.modality);
  return { actionKey: String(action?.actionKey || '').trim(), actionKind: String(action?.kind || '').trim(), status: completed ? HANDOFF_PROPOSAL_STATUS.READY : HANDOFF_PROPOSAL_STATUS.IGNORED, candidate: structuredClone(action), reason: completed ? null : 'Explicit action is not a completed canonical occurrence.' };
}

// ── C1 fix (2026-10-02): AI-generated text is untrusted ─────────────────────
// Proposals derived from free-form roleplay text must NEVER auto-commit.
// Only text the human player typed themselves (role === 'user') may reach
// READY. Anything the model wrote (role === 'assistant') is capped at
// NEEDS_CONFIRMATION: it is still recorded so the player can review and
// confirm it in the phone UI, but HandoffCommitCoordinator will not silently
// commit it as a canonical DM_SEND / CALL_INITIATE event.
// This closes the "AI text → regex → canonical tool call" path: a character
// card, a swiped/edited message, or an ordinary RP line that happens to read
// `I text Renard: "..."` can no longer send a real DM or start a real call
// without the player confirming it first.
// NOTE: the explicitPhoneActions path (message.extra.tmrwPhoneActions) is NOT
// covered by this cap yet — that is open item M5 (provenance check).
const TRUSTED_TEXT_ROLE = 'user';
function capUntrustedTextStatus(status, source) {
  if (status !== HANDOFF_PROPOSAL_STATUS.READY) return { status, downgraded: false, reason: null };
  if (source?.role === TRUSTED_TEXT_ROLE) return { status, downgraded: false, reason: null };
  return {
    status: HANDOFF_PROPOSAL_STATUS.NEEDS_CONFIRMATION,
    downgraded: true,
    reason: 'Text was not typed by the player (untrusted role). AI-derived phone actions never auto-commit; awaiting user confirmation.',
  };
}
function textCandidates(source) {
  const trimmed = source.text.trim();
  if (!trimmed || BLOCKED_INTENT.test(trimmed) || REPORTED.test(trimmed)) return [];
  // C1: enforce the trust boundary in one place, on every returned candidate.
  const done = rows => rows.map(candidate => {
    const capped = capUntrustedTextStatus(candidate.status, source);
    return capped.downgraded ? { ...candidate, status: capped.status, reason: capped.reason } : candidate;
  });
  let match = trimmed.match(/^I\s+(?:text|message|dm)\s+([A-Za-z0-9_{}-]+)\s*:\s*["“]?([\s\S]+?)["”]?\s*$/i);
  if (match) { const target = exactlyOneBinding(source, match[1]); const actor = source.actorBinding; return done([{ actionKey: `deterministic-dm:${match[1].toLowerCase()}`, actionKind: HANDOFF_ACTION_KIND.DM_SEND, status: target && actor ? HANDOFF_PROPOSAL_STATUS.READY : HANDOFF_PROPOSAL_STATUS.NEEDS_CONFIRMATION, candidate: { sender: actor, recipient: target, text: match[2].trim() }, reason: target && actor ? null : 'Sender or recipient canonical identity is unresolved/ambiguous.' }]); }
  match = trimmed.match(/^([A-Za-z0-9_{}-]+)\s+(?:texts|messages|dms)\s+(?:me|you|([A-Za-z0-9_{}-]+))\s*:\s*["“]?([\s\S]+?)["”]?\s*$/i);
  if (match) { const sender = exactlyOneBinding(source, match[1]); const recipient = match[2] ? exactlyOneBinding(source, match[2]) : source.actorBinding; return done([{ actionKey: `deterministic-reverse-dm:${match[1].toLowerCase()}`, actionKind: HANDOFF_ACTION_KIND.DM_SEND, status: sender && recipient ? HANDOFF_PROPOSAL_STATUS.READY : HANDOFF_PROPOSAL_STATUS.NEEDS_CONFIRMATION, candidate: { sender, recipient, text: match[3].trim() }, reason: sender && recipient ? null : 'Reverse action identities are unresolved/ambiguous.' }]); }
  match = trimmed.match(/^I\s+call\s+([A-Za-z0-9_{}-]+)\s*[.!]?$/i);
  if (match) { const called = exactlyOneBinding(source, match[1]); const caller = source.actorBinding; return done([{ actionKey: `deterministic-call:${match[1].toLowerCase()}`, actionKind: HANDOFF_ACTION_KIND.CALL_INITIATE, status: caller && called ? HANDOFF_PROPOSAL_STATUS.READY : HANDOFF_PROPOSAL_STATUS.NEEDS_CONFIRMATION, candidate: { caller, called }, reason: caller && called ? null : 'Caller or called canonical identity is unresolved/ambiguous.' }]); }
  return [];
}

export async function extractDeterministicHandoffProposals({ scope, source: inputSource }) {
  const source = normalizeMainRpSource(inputSource);
  if (source.origin === 'tmrw-phone-context' || source.mode !== 'normal') return Object.freeze([]);
  const candidates = source.explicitPhoneActions.length ? source.explicitPhoneActions.map(explicitCandidate) : textCandidates(source);
  const proposals = [];
  for (const candidate of candidates) {
    if (!candidate.actionKey || !ACTIONS.has(candidate.actionKind)) continue;
    proposals.push(await createHandoffProposal({ scope, source, ...candidate }));
  }
  return Object.freeze(proposals);
}
