# Termux installer source

The files here are auditable source, not a command to paste into Termux directly.
`install.sh` deliberately refuses to run with unfilled release pins. Use the
release-specific installer link in the repository's main README instead.

The release bootstrap pins the installer archive and install-index SHA-256.
The index pins the extension Git commit, runtime version, archive checksum and
every download part. Payload verification checks every extracted file before
activation. User profiles and existing ST data are not replaced.

`tmrw-start` is generated locally at installation time. Its voice services use
private Python and loopback ports. It refuses an occupied port and only stops
processes whose command line matches its own runtime/manager.

This is repeat installation, not automatic updating. Do not bypass the legacy or
dirty checkout guards with deletion/reset commands; migration is a separate flow.
