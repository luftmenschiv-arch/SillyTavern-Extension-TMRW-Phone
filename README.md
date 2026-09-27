# TMRW Phone — Public Beta

โทรศัพท์ของตัวละครใน SillyTavern · **0.1.0-beta.3 — ยังไม่ใช่ stable**

Repo นี้แจกเฉพาะ snapshot สำหรับผู้เล่น แยกจาก repo พัฒนา ไม่ได้เผยแพร่ทุกการแก้ระหว่างทำงาน

**ถ้าใช้ Android และต้องการระบบเสียง ให้ทำหัวข้อ “ติดตั้งบน Termux พร้อมระบบเสียง” อย่างเดียวก่อน ไม่ต้องลง Extension ผ่านปุ่มของ ST ล่วงหน้า** ตัวติดตั้งจะลงให้ครบเอง ส่วนหัวข้อถัดไปเป็นอีกทางเลือกสำหรับลง Extension อย่างเดียว

## ติดตั้ง Extension

1. สำรองข้อมูล SillyTavern ก่อนทดลอง beta ใช้ได้กับเครื่องที่มี SillyTavern อยู่แล้ว (ชุดตรวจล่าสุดใช้ 1.18.0)
2. เปิด **Extensions → Install extension** แล้ววางลิงก์นี้:

   ```text
   https://github.com/luftmenschiv-arch/SillyTavern-Extension-TMRW-Phone
   ```

3. ติดตั้งเสร็จ รีเฟรชหลังคำตอบที่กำลังสร้างจบ เปิดแชทตัวละคร แล้วเปิด TMRW Phone
4. ตั้ง API สำหรับสร้างคำตอบใน SillyTavern ตามปกติ ตัว Extension ไม่แถม API key หรือบริการโมเดลฟรี

**ถ้ามี TMRW Phone รุ่นพัฒนา/รุ่นเก่าอยู่แล้ว ห้ามเปิดสองชุดพร้อมกัน** ให้สำรองก่อนและใช้การควบคุม Extension ของ ST เพื่อปิดชุดเดิม ไม่ล้าง site data / IndexedDB เพื่อแก้ปัญหาการติดตั้ง การย้ายชุดเดิมบนเครื่องส่วนตัวไม่ใช่ขั้นตอนที่ผ่านการทดสอบใน release นี้

## ติดตั้งบน Termux พร้อมระบบเสียง

สำหรับ **Android arm64 ที่มี ST ใน Termux อยู่แล้ว** เตรียมพื้นที่ว่างอย่างน้อย **4 GiB** และใช้ Wi-Fi แพ็กดาวน์โหลดประมาณ 780 MB ไม่ต้องลงโมเดลทีละไฟล์

วางคำสั่งนี้ใน Termux ครั้งเดียว:

```bash
curl -fL --proto '=https' https://github.com/luftmenschiv-arch/SillyTavern-Extension-TMRW-Phone/releases/download/v0.1.0-beta.3/install.sh -o "$TMPDIR/tmrw-install.sh" && bash "$TMPDIR/tmrw-install.sh"
```

ตัวติดตั้งจะลง Extension รุ่นที่ตรึงไว้ ระบบเสียง โมเดล ตัวถอดเสียง และพรีเซ็ทให้ครบ ตรวจพื้นที่และตรวจไฟล์ก่อนใช้ ถ้าเน็ตหลุด รันคำสั่งเดิมซ้ำเพื่อใช้ส่วนที่โหลดครบแล้ว **ไม่ลดเวอร์ชัน Python ของ Termux ไม่ลง ST ทับ ไม่แก้ API และไม่เปิดอัปเดตอัตโนมัติ**

ถ้า ST ไม่อยู่ที่ `~/SillyTavern` ให้เติม `--st=/พาธจริง/SillyTavern` ท้ายคำสั่ง `bash` เปิด ST ตามปกติหลังติดตั้ง และรีเฟรชเมื่อคำตอบที่กำลังสร้างจบแล้ว

ครั้งต่อไปที่เปิด Termux พิมพ์:

```bash
tmrw-start
```

จะเปิดระบบเสียง แล้วเปิด ST ถ้าพอร์ตปกติยังไม่มีเซิร์ฟเวอร์อยู่ ถ้าต้องการเฉพาะเสียง ใช้ `tmrw-start --voice-only`; หยุดเฉพาะเสียงใช้ `tmrw-start --stop-voice` ถ้า ST ใช้พอร์ตอื่น ให้กำหนด `TMRW_ST_URL` ก่อนเรียก หรือเปิด ST เองแล้วใช้ `--voice-only`

**ผู้ที่ติดตั้งผ่านปุ่ม Install extension ของ ST อยู่แล้ว หรือใช้ Phone/Voice รุ่นเก่า:** ตัวติดตั้งจะไม่ฝืนลงซ้อน/ทับรุ่นที่ต่างกัน ให้ใช้ขั้นตอนย้ายรุ่นที่ผ่านการตรวจแทน อย่าลบแชท ล้าง IndexedDB หรือลบโฟลเดอร์เดิมเพื่อข้ามคำเตือน หากตรงกับ public snapshot ที่ตรึงไว้และไม่มีไฟล์แก้ไข ตัวติดตั้งรันซ้ำได้

ยังต้องตั้งผู้ให้บริการ/โมเดล/API ใน ST เอง ระบบเสียง local ไม่ได้แก้ 503 ของผู้ให้บริการ เปิด Termux ค้างไว้ระหว่างใช้งาน; Android อาจหยุดงานเบื้องหลังตามนโยบายของเครื่อง

## เสียง: ขอบเขตของ beta นี้

- พรีเซ็ทชื่อเดิม ชาย 12 + หญิง 12 พร้อม WAV ตัวอย่าง 48 ไฟล์
- เลือกอังกฤษแล้วฟังอังกฤษ เลือกญี่ปุ่นแล้วฟังญี่ปุ่น ทุกเสียงใช้ประโยคเดียวกันในภาษานั้น กดฟังไฟล์ที่เตรียมไว้ ไม่ต้องสร้างเสียงใหม่
- ติดตั้ง Extension อย่างเดียวฟังตัวอย่างได้ แต่การโทรด้วยเสียง/โคลนเสียงต้องลงแพ็กด้วยคำสั่ง Termux ด้านบนด้วย
- Runtime/voice pack เวอร์ชัน `1.0.0-beta.1` แยกจาก Extension; ไม่ต้องใช้ companion-only ของ beta.2 เพื่อติดตั้งรุ่นนี้
- ปุ่มติดตั้งเสียงใน UI แนะนำวิธี Termux ไม่พาไป repo private; ไม่ใช้ตัวติดตั้งแพ็กเก่าที่เป็นคนละรูปแบบ
- มีเอกสาร third-party และซอร์ส Python-SoXR/libsoxr ที่จำเป็นมากับแพ็ก ดู `NOTICE.md` ในแพ็ก ไม่เปลี่ยนชื่อเสียงที่ผู้เล่นเลือก และไม่ปรับ pitch เพิ่มจากเสียงโคลน
- คุณภาพ/การออกเสียงของบางเสียงยังต้องเก็บงาน ไม่รับรองว่าทุกเสียงออกเสียงทุกภาษาได้สมบูรณ์

ดาวน์โหลดรุ่นที่ตรึงไว้: [Releases](https://github.com/luftmenschiv-arch/SillyTavern-Extension-TMRW-Phone/releases)

## TMRW—KeyFlow (ไม่บังคับ)

ใช้ [KeyFlow 1.5.1 หรือใหม่กว่า](https://github.com/luftmenschiv-arch/SillyTavern-Extension-TMRW-KeyFlow) ได้ ผลทดสอบแบบจำลองครอบคลุมการส่งคำขอโทรผ่าน ST, retry และ model fallback โดยไม่สร้างคำตอบซ้ำ เปิด Model fallback และตั้งรายการโมเดลสำรองใน KeyFlow หากต้องการฟังก์ชันนี้

การทดสอบนี้ **ไม่ใช่การรับรอง live API หรือทุกมือถือ** ถ้าผู้ให้บริการตอบ 503 ทุกโมเดล ยังโทรไม่สำเร็จได้ รายละเอียดอยู่ใน [สถานะการทดสอบ](QUALITY.md)

## อัปเดตและข้อมูลผู้เล่น

ตอนนี้ `auto_update: false` — **อัปเดตอัตโนมัติยังไม่เสร็จ** อย่าเข้าใจว่าเปิดใช้แล้ว
ระหว่างนี้ใช้การอัปเดต Extension ผ่าน ST หลังสำรองและรอให้งานจบ รุ่นเสียง/โมเดลจะมีวงจรอัปเดตแยกกันในขั้นถัดไป

Repo นี้ไม่มีแชท ประวัติโทร ไฟล์บันทึกเสียงผู้เล่น คีย์ API หรือเสียงที่ผู้เล่นโคลนส่วนตัว ไม่ต้องคัดลอก/อัปโหลดข้อมูลเหล่านี้มาเพื่ออัปเดต อย่าล้างข้อมูลเบราว์เซอร์ เพราะข้อมูล Phone บางส่วนอยู่ใน IndexedDB ของ origin เดิม

## งานถัดไป (ยังไม่เสร็จ)

- [x] ขั้น 4: ตัวติดตั้ง Termux + แพ็ก runtime/model ตรวจพื้นที่/ไฟล์/ดาวน์โหลดต่อและลงซ้ำได้ (ผ่านการทดสอบแยกบน Android หนึ่งเครื่อง)
- [ ] ขั้น 5: อัปเดตอัตโนมัติ แยกเวอร์ชัน Extension/เสียง และทดสอบไม่ทับข้อมูลผู้เล่น
- [ ] ทดสอบบน Termux/Android ที่เพิ่งติดตั้งใหม่จริงและ coexistence กับ KeyFlow แบบ live — การทดสอบโฟลเดอร์แยกบนเครื่องเดิมไม่เท่ากับทดสอบทุกเครื่อง
- [ ] เก็บการออกเสียงของบางพรีเซ็ท

แจ้งบั๊กพร้อมเวอร์ชัน ST/Extension และขั้นตอนทำซ้ำได้ที่ Issues **อย่าแนบ API key, settings ทั้งไฟล์ หรือแชทส่วนตัว**

## For maintainers

This is a curated distribution snapshot, not the development repository. The extension entry files are at the repository root so ST can install the URL directly. Development history, test fixtures, device captures, and personal data are not copied here.

Run `node scripts/verify-release.mjs` with Node.js 22+ to verify the exact tracked payload, hashes, import closure, 48 WAVs, renamed-folder preview resolution, and passive module import. `release.json` lists the component boundary and checksums. Voice companion assets are attached to the prerelease, not duplicated in Git history. Only promote a reviewed, tested snapshot to `main`; beta does not mean stable.
