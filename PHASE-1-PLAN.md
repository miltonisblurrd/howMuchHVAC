# Phase 1 Plan ? Website (Updated)

**Status:** Andy accepted ? reviews received ? ready to build  
**Launch model:** Build in phases, ship together later  
**Photos:** Pending from Andy (slots ready during build)

---

## What you have locked in

- Proposal accepted ($1,500 family price)
- Marketing site shell already exists
- Supabase project created (needs wiring)
- Resend / Twilio / invoices: prepare scaffolding now; keys/accounts coming
- Full Google review dump received (below)
- Photos/videos coming from Andy

---

## Reviews inventory (from your paste)

All are 5-star unless noted. Truncated Google snippets marked **NEEDS FULL TEXT**.

### Featured / conversion-priority (use sitewide)

1. **Jess Noriega** ? 4 mini-splits, clean install, great communication  
2. **Dario Gutierrez** ? heatwave; other companies wanted $25k+; Andy gave affordable options **(NEEDS FULL TEXT)**  
3. **Eric Kirst** ? full HVAC install in one day, professional, great price  
4. **Felipe Cortes** ? condenser + TXV; great install + pricing **(NEEDS FULL TEXT)**  
5. **Vge (Frank)** ? whole system, one day, all-inclusive quote **(NEEDS FULL TEXT)**  
6. **Kim de Montmorency** ? new AC/heat; honest, thorough process **(NEEDS FULL TEXT)**  
7. **Ted Wert** ? AC, furnace, ductwork; found multiple issues **(NEEDS FULL TEXT)**  
8. **Alex shah** ? bakery + home; last-minute call, prepared techs **(NEEDS FULL TEXT)**  
9. **German Vizcarra** ? new home; explains everything before work  
10. **Christina Guerrero** ? preschool director; multi-year trust  
11. **Marlet Andaya** ? single homeowner; honest, fair, cooler immediately  
12. **Adam Aleman** ? same-day OC heat rescue; honest, extra mile **(NEEDS FULL TEXT)**  
13. **No Name / Christopher-style diagnostic story** ? diagnostic only, no pressure **(NEEDS FULL TEXT)**  
14. **fernando mancilla** ? 109°+ emergency troubleshooting **(NEEDS FULL TEXT)**  
15. **Maddie Nitzen** ? diagnosed + fixed fast, great price, only HVAC she?ll use  
16. **Alexa Vega** ? mini-split for trailer; Andy + Marcos install  
17. **Meisam Saeedalzakerin** ? long-term; best price, on time  
18. **Rob Wert** ? knowledgeable, stayed until done right  

### Supporting reviews (reviews page + rotations)

- Estela Hernandez ? professional, fast, efficient  
- Gretchen Anderson ? helpful; repaired roof in downpour  
- Hvac Papi / Louie ? Saturday response, kept promise **(NEEDS FULL TEXT)**  
- Peter Min ? 10/10 for any HVAC issue  
- sylvia neal ? quick, efficient, competitive (**4-star** ? keep, shows honesty)  
- Scarlet W ? people-driven, reliable, detail oriented  
- K G ? great company, nice workers  
- Maribel Pineda ? professional, attentive  
- don ramstead ? full duct removal/install, great price  
- KC ? great service  
- KP SOLAR STREAM / Ken ? positive attributes (thin text)  
- Laura Robledo ? positive attributes (thin text)

### Review implementation plan

- Rewrite `src/lib/reviews.ts` with full structured set (name, quote, rating, relative age, tags like `install` / `repair` / `emergency` / `commercial`)
- Rebuild `/reviews` as a real conversion page (filter by job type, featured strip, Google CTA)
- Inject featured reviews into: home, services, cities, about, booking, ads, thank-you
- Prefer **full-text** reviews for hero/featured; truncated ones go on reviews page until expanded
- Keep owner responses off the marketing site (noise); optional later in admin

**Ask Andy / you:** click ?More? on truncated reviews and paste full text when easy. Not a blocker ? we ship with what we have.

---

## Phase 1 scope (build now)

### A. Infra prep (no blocker on missing keys)
- Supabase client + env template (`.env.example`)
- `leads` table SQL ready to run in Supabase
- Resend email templates prepared (notify Andy + confirm customer)
- Twilio SMS stub prepared (env + helper; live when account ready)
- Invoice/payments adapter stub (wire after Andy says QuickBooks/Stripe/etc.)

### B. Forms + thank-you (conversion critical)
- Quote / booking / contact forms submit to Supabase + Resend
- New `/thank-you` page that:
  - Confirms the request
  - Explains they?ll get an email to create/access the **client portal**
  - Educates on portal value (job status, tech visit tracking, messages, documents, future payments)
  - Gives call CTA + reviews proof while they wait

### C. Copy overhaul (every existing page)
Tone: care + confidence + family-owned. Not sparse. SEO + AEO/LLM clear.
- Home, About, Services (+ each service), Areas, Booking, Contact
- Financing, Maintenance, Warranty, Second Opinion, Partners, Projects, Team
- Privacy + Terms updated for real lead capture + portal path

### D. City expansion (LA / OC / SD majors)
Long-form unique pages per major city:
- Local intro + why How Much?
- Climate / housing pain points
- Services offered
- Process + expectations
- Reviews
- FAQs
- Quote form CTA
- Links to nearby cities + services

Target: comprehensive major-city set across Los Angeles County, Orange County, San Diego County (not just the current ~12).

### E. Reviews system
- Data model + page + sitewide modules (above)

### F. Photo-ready structure
- Content slots / image fields ready so Andy?s assets drop in without rewrites

---

## Out of Phase 1 (later phases, same launch)
- Full real client portal auth/jobs/docs/pay UX (Phase 3)
- Full real admin + live AI (Phase 4)
- Ads page conversion polish / pixels (Phase 2)
- Live Twilio/SMS + invoice vendor until accounts/choices arrive  
  *(scaffolding happens in Phase 1)*

---

## Build order

1. Reviews data + `/reviews` + shared review components  
2. Supabase / Resend / Twilio scaffolding + env example  
3. Form submit ? lead save ? emails ? `/thank-you`  
4. City expansion (long-form)  
5. Full copy optimization pass  
6. Legal pages  
7. SEO/AEO metadata + internal linking polish  

---

## What I need from you while building

| Item | Needed to? | Blocker? |
|---|---|---|
| Reviews (have them) | Social proof | Done |
| Truncated ?More? full texts | Stronger featured quotes | Nice-to-have |
| Supabase URL + anon + service role | Live lead storage | Needed before real submits |
| Andy from-email for Resend | Customer/owner emails | Can stub first |
| Twilio account later | SMS | Stub only in Phase 1 |
| Invoice tool Andy uses | Payments later | Stub only in Phase 1 |
| Photos/videos | Final visual polish | Not a copy blocker |

---

## Definition of done (Phase 1)

- [ ] All reviews in system + strong reviews page  
- [ ] Featured reviews on key conversion surfaces  
- [ ] Forms save leads + send email when env configured  
- [ ] Thank-you page sells client portal onboarding  
- [ ] Major LA/OC/SD city pages live and long-form  
- [ ] All current pages copy-optimized for people + SEO/AEO  
- [ ] Privacy/Terms updated  
- [ ] Supabase/Resend/Twilio scaffolding documented  
- [ ] Ready for Andy photos without restructuring pages  
