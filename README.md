# HaqSetu — every government benefit you are owed, in your language

**Live app:** https://rsaxena3011.github.io/haqsetu/

India runs hundreds of welfare schemes — pensions, scholarships, health cover, farmer support, business loans. But the information sits scattered across dozens of English-first portals and PDFs, so lakhs of entitled people never claim what is already theirs.

HaqSetu ("haq" = one's rightful entitlement, "setu" = bridge) fixes the discovery problem:

1. **Tell us about yourself** — age, work, income, family situation. A few taps.
2. **See your matches** — a deterministic eligibility engine checks your profile against 18 curated central government schemes (PM-KISAN, Ayushman Bharat PM-JAY, Sukanya Samriddhi, PM Awas, Atal Pension, Mudra, e-Shram, Vishwakarma, NSAP pensions, scholarships and more). Every match shows **why you qualify** — the exact rules that fired — plus the benefit in plain words.
3. **Carry one checklist** — all documents needed across all your matches, de-duplicated into one printable list, with where to apply for each scheme.

### Access features
- **English + full Hindi** rendering of everything, one tap.
- **Read-aloud** of your benefits (browser speech synthesis) for low-literacy users.
- **Runs fully offline.** No account, no server, no tracking — your answers never leave the device. This matters for the audience.
- Large type, high contrast, phone-first layout.

### How it is built
- `index.html` — the whole app (UI + bilingual strings), zero dependencies, zero network calls.
- `schemes.js` — the scheme dataset and the eligibility engine as pure functions. The same file runs in the browser and in Node.
- `test_match.js` — automated fixtures: 12 realistic profiles, 59 assertions on which schemes must fire and which must stay silent.

Run the tests:

```bash
node test_match.js
# 59 checks, 0 failures
```

Run the app: open `index.html` in any browser, or use the live link above.

### Honesty note
Scheme summaries are conservative plain-language versions of public government scheme guidelines. Final eligibility is always confirmed by the government on the official portal or at the office — every result card says so, and names the official portal where one exists.

### Built for
Ctrl+V Hackathon (Devpost, 2026) — theme: use technology to improve access to something important. Built solo by Ratnesh Saxena during the hackathon window.
