/* ============================================================
   CleaningWorks — English strings, keyed by page.

   Danish lives in the HTML and is captured on load by js/site.js.
   Only English lives here. To edit Danish, edit the HTML.

   Keys may contain inline HTML (<b>, <br>, <span class='serif'>) —
   that is intentional; site.js writes them with innerHTML. Use
   SINGLE quotes for attributes inside these values.

   Every data-i18n key on a page must exist in that page's object,
   and no key in the object may be unused on that page. site.js
   checks both on localhost and logs the result to the console.

   Shared groups below exist so a string used on two pages has one
   source of truth, while each page still composes exactly the set
   it uses — which is what keeps the "no unused key" half true.

   NOTE: anything the calculator prints (prices, m², days/week) is
   formatted in js/calculator.js against document.documentElement.lang,
   not translated here.
   ============================================================ */

/* ---------- shared groups ---------- */

const CALC = {
  "calc.kick":"Calculate in 30 seconds",
  "calc.h":"All three levels, one click",
  "calc.l1":"Type of site",
  "calc.t1":"Office","calc.t2":"Production","calc.t3":"Clinic",
  "calc.l2":"Area",
  "calc.l3":"Frequency",
  "calc.fmin":"1 day/week","calc.fmax":"7 days/week",
  "calc.btn":"Get a binding quote",
  "calc.fine":"The final price is set after a 20-minute walkthrough on site.",
  "calc.ph":"Pricing model — placeholder"
};

const LVL_NAMES = {
  "lvl.th1":"Basic","lvl.th2":"Standard","lvl.th3":"Total"
};

const LVL_TABLE = {
  "lvl.badge":"Recommended",
  "lvl.th0":"Included",
  "lvl.r1":"Frequency",
  "lvl.r1a":"1–2 days/week","lvl.r1b":"3–5 days/week","lvl.r1c":"5 days + weekend standby",
  "lvl.r2":"Quality measurement",
  "lvl.r2a":"Twice a year","lvl.r2b":"Monthly, report to you","lvl.r2c":"Monthly + quarterly review",
  "lvl.r3":"Named operations manager",
  "lvl.r3c":"+ direct mobile number","lvl.r3c2":"✓ + direct mobile",
  "lvl.r4":"Consumables included",
  "lvl.r5":"Fixing a missed task",
  "lvl.r5a":"Next visit","lvl.r5b":"Within 24 hours","lvl.r5c":"Same day",
  "lvl.r6":"Price per month",
  "lvl.permd":"/mo."
};

const FORM = {
  "f.name":"Name","f.company":"Company","f.mail":"Work email","f.phone":"Phone",
  "f.type":"Site type",
  "f.t1":"Office","f.t2":"Production / warehouse","f.t3":"Retail","f.t4":"Clinic",
  "f.m2":"Area (m²)","f.msg":"Briefly about the job","f.submit":"Send enquiry",
  "f.fine":"We use these details only to contact you about this enquiry."
};

const NAME_PHONE = { "f.name":"Name", "f.phone":"Phone" };

const FACTS = {
  "fact.1":"staff turnover against around 40% across the industry",
  "fact.2":"permanent staff on the 3F collective agreement",
  "fact.3":"of what we use is Nordic Swan labelled",
  "fact.4":"founded — same owner ever since"
};

const PH_FIG = {
  "ph.figures":"Figures — placeholder",
  "ph.figures.note":"None of the figures below have been verified. They must be replaced with real numbers before this page is visible outside the company."
};

const PH_CERTS = {
  "ph.certs":"Certifications — placeholder",
  "ph.certs.note":"Keep only the marks the company actually holds. This is a legal question, not a design one."
};

const CERT_BADGES = {
  "ans.b4":"Nordic Swan","ans.b5":"3F collective agreement"
};

const CTA_KICK  = { "cta.kick":"Contact" };
const CTA_CALL  = { "cta.b1":"Call +45 31 40 86 21" };
const BAND_STOCK = { "band.stock":"Stock photo — to be replaced" };

/* ---------- pages ---------- */

window.I18N = {

  /* header, footer and skip link — identical on all seven pages */
  common: {
    "skip":"Skip to content",

    "nav.services":"Services","nav.levels":"Service levels","nav.about":"About us",
    "nav.jobs":"Careers","nav.contact":"Contact","nav.cta":"Get a price",

    "foot.tag":"Commercial cleaning with fixed teams, a fixed price and measured quality. <span class='ph'>Since 2011.</span>",
    "foot.h1":"Services",
    "foot.s1":"Daily cleaning","foot.s2":"Deep cleaning","foot.s3":"Window cleaning","foot.s4":"Post-construction",
    "foot.h2":"Company",
    "foot.c1":"About us","foot.c2":"Careers","foot.c3":"Service levels","foot.c4":"Contact",
    "foot.h3":"Contact",
    "foot.addr":"Copenhagen, Denmark",
    "foot.legal":"Privacy and cookie policies still missing"
  },

  /* ---------------- index.html ---------------- */
  index: Object.assign({}, CALC, LVL_NAMES, LVL_TABLE, FORM, FACTS,
                           PH_FIG, PH_CERTS, CERT_BADGES, CTA_KICK, CTA_CALL, BAND_STOCK, {

    "sub.services":"Services","sub.levels":"Levels","sub.control":"Quality control",
    "sub.how":"Getting started","sub.resp":"Responsibility","sub.faq":"FAQ",

    "hero.kick":"<span class='ph dark'>340</span> commercial sites under contract today",
    "hero.h1":"Cleaning that holds up<br><span class='serif'>— and that we can prove</span>",
    "hero.lead":"A fixed team, a fixed price and a quality report every month. Calculate your price for all three service levels in 30 seconds — without talking to a salesperson first.",
    "hero.cta1":"Calculate a price","hero.cta2":"See how we measure",

    "hf.1":"<b><span class='ph dark'>24 h</span></b> response time on quotes",
    "hf.2":"<b>30 days</b> notice — no lock-in",
    "hf.3":"<b><span class='ph dark'>96%</span></b> of clients renegotiate",
    "hf.4":"<b><span class='ph dark'>INSTA 800</span></b> measured every month",

    "band.txt":"The kit and the method are the same every day — including when nobody is watching",
    "band.tag":"Fig. 01",

    "svc.kick":"Services",
    "svc.h2":"Four services. <span class='serif'>One fixed crew.</span>",
    "svc.p":"We assemble the agreement from the parts you need — and write down exactly what gets done when. No “as required”.",
    "svc.1.h":"Daily cleaning",
    "svc.1.t1":"Office","svc.1.t2":"Canteen","svc.1.t3":"Washrooms",
    "svc.1.p":"The fixed team that comes every day and knows your building inside out. A room-by-room plan, so everyone knows exactly what was agreed.",
    "svc.2.h":"Deep cleaning &amp; specialist jobs",
    "svc.2.t1":"Floor treatment","svc.2.t2":"Height access",
    "svc.2.p":"Periodic jobs planned a year ahead and scheduled outside your opening hours. You get the dates in the calendar when the contract starts.",
    "svc.3.h":"Window cleaning",
    "svc.3.t1":"Façade","svc.3.t2":"Pure-water technique",
    "svc.3.p":"Inside and out on a fixed rotation. Pure-water technique up to 20 metres, a certified lift operator for the rest.",
    "svc.4.h":"Post-construction &amp; move-out",
    "svc.4.t1":"Handover","svc.4.t2":"Urgent",
    "svc.4.p":"Final cleaning before handover or move-in, staffed to your deadline. We show up with the headcount the date requires.",
    "svc.more":"See all four services in detail →",

    "lvl.kick":"Service levels",
    "lvl.h2":"Choose a level, <span class='serif'>not guessed hours</span>",
    "lvl.p":"Most quotes in this industry sell hours. We sell a result, measured to INSTA 800 — and the prices below are the ones you just calculated above.",

    "kon.kick":"Quality control",
    "kon.h2":"You don't have to <span class='serif'>take our word for it</span>",
    "kon.p":"Every month we measure quality to INSTA 800 — the Nordic standard that turns cleaning into a number instead of a feeling. The report is in your client portal the next day.",
    "proof.1":"of clients renegotiate the contract at expiry",
    "proof.2":"average INSTA 800 score across 340 sites",
    "proof.3":"commercial sites under contract today",
    "dash.1":"<b>Sampling per room type</b>Offices, washrooms, canteen and stairwells are measured separately.",
    "dash.2":"<b>Deviations with photos</b>You see exactly what didn't meet the agreement.",
    "dash.3":"<b>Fixed within 24 hours</b>At no extra charge. It's part of the agreement.",
    "panel.title":"Quality report · August",
    "panel.ph":"Example",
    "panel.s1":"INSTA score","panel.s2":"measuring points","panel.s3":"deviations",
    "panel.b1":"Offices","panel.b2":"Meeting rooms","panel.b3":"Washrooms","panel.b4":"Canteen","panel.b5":"Stairwells",
    "panel.note":"Stairwells were rectified on 14 Aug and re-measured at 90.",

    "how.kick":"Getting started",
    "how.h2":"From call to operation <span class='serif'>in 14 days</span>",
    "how.p":"Including when you're switching supplier. We handle the notice and run an overlap for the first week.",
    "how.1.h":"Calculate","how.1.p":"Get prices for all three levels right here. No email address required.",
    "how.2.h":"Walkthrough","how.2.p":"20 minutes on site where we measure up and listen to what's annoying you today.",
    "how.3.h":"Plan &amp; price","how.3.p":"You get a room-by-room plan and a fixed monthly price within 24 hours.",
    "how.4.h":"Onboarding","how.4.p":"A fixed team and a named operations manager, trained at your address before day one.",

    "case.photo":"Photo<br>portrait<br>client",
    "case.tag":"Case",
    "case.ph":"Fictional — to be replaced",
    "case.q":"We went from weekly complaints to cleaning never coming up at the management meeting again. That's the best review I can give.",
    "case.role":"Facility Manager, Nordhavn Office House · 11,400 m², client since 2022",

    "ans.kick":"Responsibility &amp; about us",
    "ans.h2":"Decent conditions <span class='serif'>aren't marketing</span>",
    "ans.p":"They're operating economics. People who stay deliver better cleaning than people who just started.",
    "ans.cta":"See open positions",
    "ans.c1a":"Every employee is permanently hired under the 3F collective agreement. We don't use temp agencies for regular operations, and we don't undercut by trimming hours on paper.",
    "ans.c1b":"Training happens at your address, not in a classroom, and we pay for language and workplace-safety courses during working hours. It costs us <span class='ph'>around 4% of payroll</span> a year. In return we have <span class='ph'>11% turnover instead of 40%</span>.",
    "ans.c2a":"On the environmental side we hold a Nordic Swan licence and ISO 14001 certification. In practice that means dosing systems instead of sprays, microfibre instead of chemicals, and <span class='ph'>82% of what we use</span> today is Swan-labelled.",
    "ans.c2b":"We report your consumption and chemical share in the annual overview, so the figures can go straight into your own ESG reporting.",

    "faq.kick":"FAQ",
    "faq.h2":"What you usually <span class='serif'>ask about</span>",
    "faq.1.q":"What does commercial cleaning cost?",
    "faq.1.a":"It depends on area, frequency and service level. A 1,000 m² office with daily cleaning at the Standard level <span class='ph'>typically lands between DKK 9,000 and 14,000 a month</span>. Use the calculator above for an estimate across all three levels — you get a fixed monthly price after the walkthrough.",
    "faq.2.q":"Are we tied into a long contract?",
    "faq.2.a":"No. 30 days' notice to the end of a month, no lock-in period. The quality should keep you — not the contract.",
    "faq.3.q":"Can you take over from our current supplier?",
    "faq.3.a":"Yes, we do it <span class='ph'>around 40 times a year</span>. We handle the notice, take on staff transfer under the applicable rules where relevant, and run an overlap for the first week.",
    "faq.4.q":"Who comes into our premises?",
    "faq.4.a":"Only the fixed team at your address. Everyone is named, carries photo ID and is background-checked where relevant. Access is logged, and you get a list of who has it.",
    "faq.5.q":"What do you do about the environment and chemicals?",
    "faq.5.a":"We hold a Nordic Swan licence and ISO 14001 certification. In practice: dosing systems instead of sprays, microfibre instead of chemicals, and an annual overview of your consumption you can put straight into your ESG reporting.",

    "cta.h2":"Book a <span class='serif'>20-minute walkthrough</span>",
    "cta.p":"We walk the building, measure up and send a plan with a fixed monthly price. No obligation, and we won't call again if you say no thanks.",
    "cta.l1":"Quote within 24 hours of the visit",
    "cta.l2":"A room-by-room plan, not a package list",
    "cta.l3":"We handle the notice with your current supplier",
    "cta.l4":"Start-up typically 14 days after signing",
    "cta.b2":"Calculate a price again"
  }),

  /* ---------------- ydelser.html ---------------- */
  ydelser: Object.assign({}, CTA_KICK, BAND_STOCK, {

    "yd.kick":"Services",
    "yd.h1":"Four services. <span class='serif'>One fixed crew.</span>",
    "yd.lead":"We assemble the agreement from the parts you need. All of it is written down as a room-by-room cleaning plan — what gets done, how often and by whom. No “as required”.",

    "yd.card":"Good to know",
    "yd.card.link":"Compare the levels →",

    "yd.1.h":"Daily cleaning",
    "yd.1.p1":"The fixed team that comes every day and knows your building inside out. The same faces, the same order, the same standard — including over the holidays, where we cover with people who are already trained on the site.",
    "yd.1.p2":"The contract contains a room-by-room cleaning plan, so both your receptionist and our operations manager can look up what was agreed for a given room on a given weekday.",
    "yd.1.s1":"<b>Offices and meeting rooms</b> — desks, contact surfaces, floors and waste",
    "yd.1.s2":"<b>Washrooms</b> — disinfection and restocking of consumables",
    "yd.1.s3":"<b>Canteen and kitchenette</b> — surfaces, the washing-up area and fridge fronts",
    "yd.1.s4":"<b>Stairs, corridors and reception</b> — the areas guests see first",
    "yd.1.c1":"<b>Frequency</b> — 1–7 days a week, evening or morning",
    "yd.1.c2":"<b>Named operations manager</b> — from Standard level and up",
    "yd.1.c3":"<b>Quality measurement</b> — monthly to INSTA 800 from Standard",
    "yd.1.c4":"<b>Consumables</b> — can be built into the monthly price",

    "yd.2.h":"Deep cleaning &amp; specialist jobs",
    "yd.2.p1":"The periodic jobs that don't belong in the daily routine, but that decide how the building looks after two years. We plan them a year ahead and schedule them outside your opening hours.",
    "yd.2.p2":"You get the dates in the calendar when the contract starts, so a floor treatment never lands on top of a client day or an audit.",
    "yd.2.s1":"<b>Floor treatment</b> — stripping, polish and scrubbing to suit the surface",
    "yd.2.s2":"<b>Height access</b> — fittings, ventilation grilles, beams and pipework",
    "yd.2.s3":"<b>Carpets and furniture</b> — deep cleaning as needed, typically once or twice a year",
    "yd.2.s4":"<b>After contractors</b> — when a refit has left dust through the whole building",
    "yd.2.c1":"<b>Planning</b> — annual schedule agreed at contract start",
    "yd.2.c2":"<b>Timing</b> — evenings, weekends or closing days",
    "yd.2.c3":"<b>Price</b> — a fixed price per job, not hourly billing",
    "yd.2.c4":"<b>Available separately</b> — also without a standing agreement",

    "yd.3.h":"Window cleaning",
    "yd.3.p1":"Inside and out on a fixed rotation, so you don't have to remember to order it. Pure-water technique up to 20 metres — deionised water and a telescopic pole, no soap and no streaks.",
    "yd.3.p2":"Where the pole doesn't reach, we turn up with a certified lift operator and the necessary cordoning. Façade glazing and glass roofs are agreed as a rotation of their own.",
    "yd.3.s1":"<b>Office windows</b> — typically 4–12 times a year",
    "yd.3.s2":"<b>Shopfronts</b> — up to weekly where customers see them",
    "yd.3.s3":"<b>Glazing and entrance lobbies</b> — internally, alongside the daily cleaning",
    "yd.3.s4":"<b>Frames and sills</b> — included in the price, not a surcharge",
    "yd.3.c1":"<b>Technique</b> — pure water up to 20 m, lift above that",
    "yd.3.c2":"<b>Notice</b> — you hear from us the week before each visit",
    "yd.3.c3":"<b>Weather</b> — frost and high-wind days are moved at no extra charge",
    "yd.3.c4":"<b>Access</b> — agreed once, not visit by visit",

    "yd.4.h":"Post-construction &amp; move-out",
    "yd.4.p1":"Final cleaning before handover or move-in, staffed to your deadline. We show up with the headcount the date requires — not the headcount that suits our rota.",
    "yd.4.p2":"Construction dust settles into everything and comes back twice if it is done too early. So we split the job into a rough clean and a fine clean close to handover.",
    "yd.4.s1":"<b>Rough clean</b> — once the trades are out, before the furniture comes in",
    "yd.4.s2":"<b>Fine clean</b> — the days before handover or move-in",
    "yd.4.s3":"<b>Move-out cleaning</b> — to the standard in the lease",
    "yd.4.s4":"<b>Urgent</b> — water damage, vandalism or a deadline that has moved",
    "yd.4.c1":"<b>Staffing</b> — scaled to the date, not the other way round",
    "yd.4.c2":"<b>Quote</b> — a fixed price after a walkthrough on site",
    "yd.4.c3":"<b>Handover</b> — we'll attend the handover inspection with you if you want",
    "yd.4.c4":"<b>No standing agreement needed</b> — one-off jobs are welcome",

    "yd.band":"The same kit and the same method across all four services",
    "yd.bandtag":"Fig. 02",

    "yd.cta.h":"Not sure <span class='serif'>what you need?</span>",
    "yd.cta.p":"Then we start with the walkthrough. 20 minutes on site, and you get a plan that contains only what the building actually needs.",
    "yd.cta.b1":"Book a walkthrough",
    "yd.cta.b2":"Calculate a price first"
  }),

  /* ---------------- niveauer.html ---------------- */
  niveauer: Object.assign({}, CALC, LVL_NAMES, LVL_TABLE, CTA_KICK, CTA_CALL, {

    "niv.kick":"Service levels",
    "niv.h1":"Choose a level, <span class='serif'>not guessed hours</span>",
    "niv.lead":"Most quotes in this industry sell hours. We sell a result, measured to INSTA 800. Calculate the price for all three levels below — the table further down updates with what you pick.",

    "niv.c1.kick":"Price calculation",
    "niv.c1.h2":"Three figures, <span class='serif'>not one</span>",
    "niv.c1.p":"We show all three levels at once, because the difference between them is the interesting part — not the middle number. The calculator recommends a level based on your frequency, but you are free to choose.",
    "niv.c1.s1":"<b>Site type</b> changes the price, because a production hall and a clinic don't need the same thing",
    "niv.c1.s2":"<b>Area</b> is the cleaned area, not the total floor area",
    "niv.c1.s3":"<b>Frequency</b> is the number of days a week the team is on site",

    "niv.c2.kick":"Comparison",
    "niv.c2.h2":"What is included <span class='serif'>and when</span>",
    "niv.c2.p":"The prices in the table are the ones you just calculated above. Click a column to pin a level — otherwise the recommendation follows the frequency.",

    "niv.c3.kick":"What the levels mean",
    "niv.c3.h2":"The difference is in <span class='serif'>the control, not the mop</span>",
    "niv.c3.p":"The cleaning doesn't get worse on Basic. What changes as you go up is how closely we follow up, how fast a fault is fixed, and how much documentation you get in your hand.",
    "niv.b.h":"Basic",
    "niv.b.p":"For sites where 1–2 days a week is enough: smaller offices, warehouses and low-traffic premises. Measured twice a year, faults fixed at the next visit.",
    "niv.s.h":"Standard",
    "niv.s.p":"What most clients choose. A named operations manager, consumables in the monthly price, monthly quality measurement with a report, and faults fixed within 24 hours.",
    "niv.t.h":"Total",
    "niv.t.p":"For buildings where cleaning is part of the customer experience. Weekend standby, a direct mobile number to the operations manager, a quarterly review and same-day rectification.",

    "niv.cta.h":"The price becomes <span class='serif'>binding after the visit</span>",
    "niv.cta.p":"The calculator gives an estimate. After 20 minutes on site you get a fixed monthly price and a room-by-room cleaning plan — within 24 hours.",
    "niv.cta.b1":"Book a walkthrough"
  }),

  /* ---------------- om-os.html ---------------- */
  "om-os": Object.assign({}, FACTS, PH_FIG, PH_CERTS, CERT_BADGES, CTA_KICK, {

    "om.kick":"About us",
    "om.h1":"Decent conditions <span class='serif'>aren't marketing</span>",
    "om.lead":"They're operating economics. People who stay deliver better cleaning than people who just started — and that is the whole reason we spend money on employment terms instead of on salespeople.",

    "om.p.h2":"We hire permanently <span class='serif'>and we keep people</span>",
    "om.p.p":"Cleaning is an industry with high turnover. Every time someone is replaced, the training starts over at your address — and you are the first to notice.",
    "om.p.cta":"See open positions",

    "om.c1.kick":"Employment terms",
    "om.c1.h2":"What “permanent” <span class='serif'>actually means here</span>",
    "om.c1.p":"It is easy to write on a website. Here is what sits behind the word with us.",
    "om.c1.a1":"Every employee is permanently hired under the 3F collective agreement. We don't use temp agencies for regular operations, and we don't undercut by trimming hours on paper.",
    "om.c1.a2":"A quote that is 20% cheaper than everyone else's is rarely a smarter method. It is usually fewer hours than the job needs, and you find that out three months into the contract.",
    "om.c1.a3":"Training happens at your address, not in a classroom. We pay for language and workplace-safety courses during working hours, and it costs us <span class='ph'>around 4% of payroll</span> a year.",
    "om.c1.s1":"<b>A fixed team per site</b> — the same people, not a pool",
    "om.c1.s2":"<b>A named operations manager</b> — from Standard level and up",
    "om.c1.s3":"<b>Photo ID and access logging</b> — you get a list of who has access",
    "om.c1.s4":"<b>Background checks</b> — where the job calls for it",
    "om.c1.s5":"<b>Holiday cover</b> — by people who already know the building",

    "om.c2.kick":"Environment",
    "om.c2.h2":"Less chemistry, <span class='serif'>measured and reported</span>",
    "om.c2.p":"The environmental side of a cleaning contract mostly comes down to two things: how much chemistry gets used, and whether anyone is counting.",
    "om.c2.a1":"On the environmental side we hold a Nordic Swan licence and ISO 14001 certification. In practice that means dosing systems instead of sprays, microfibre instead of chemicals, and <span class='ph'>82% of what we use</span> today is Swan-labelled.",
    "om.c2.a2":"We report your consumption and chemical share in the annual overview, so the figures can go straight into your own ESG reporting. It is the same overview we use ourselves to see where consumption is rising.",
    "om.c2.s1":"<b>Dosing systems</b> — concentrate mixed on site, no pre-filled bottles",
    "om.c2.s2":"<b>Microfibre</b> — water and mechanics instead of chemicals on most surfaces",
    "om.c2.s3":"<b>Annual overview</b> — consumption and chemical share per site",
    "om.c2.s4":"<b>Waste sorting</b> — to the scheme your municipality runs",

    "om.c3.kick":"History",
    "om.c3.h2":"Briefly <span class='serif'>about the company</span>",
    "ph.history":"History — placeholder",
    "ph.history.note":"The years and milestones below are invented. Replace them with the company's real history, or delete the section.",
    "om.t1":"Founded with two employees and one office building. Same owner today.",
    "om.t2":"First ISO 9001 certification. Quality measurement to INSTA 800 becomes standard on all contracts above a certain size.",
    "om.t3":"Nordic Swan licence. Dosing systems are rolled out across every site and pre-filled bottles are phased out.",
    "om.t4":"The client portal goes live, so the quality report is ready the day after the measurement.",
    "om.t5":"Operating <span class='ph'>340 commercial sites</span> with fixed teams and named operations managers.",

    "om.cta.h":"Want to see it <span class='serif'>in practice?</span>",
    "om.cta.p":"Ask for a walkthrough. We bring the operations manager, so you meet the person who will actually run your site.",
    "om.cta.b1":"Book a walkthrough",
    "om.cta.b2":"See open positions"
  }),

  /* ---------------- job.html ---------------- */
  job: Object.assign({}, NAME_PHONE, CTA_CALL, {

    "job.kick":"Careers",
    "job.h1":"A fixed crew, a fixed site, <span class='serif'>a permanent job</span>",
    "job.lead":"We hire permanently on the 3F collective agreement, train during working hours and put people on the same sites every day. That is why <span class='ph dark'>11%</span> of the crew change jobs in a year instead of <span class='ph dark'>40%</span>.",

    "job.c1.kick":"Terms",
    "job.c1.h2":"What you <span class='serif'>can count on</span>",
    "job.c1.p":"Not fruit baskets and Friday drinks. The things that actually decide whether a cleaning job is bearable for more than a year.",
    "job.1.h":"A permanent contract",
    "job.1.p":"Permanent employment on the 3F collective agreement from day one. Not a temp posting, not hours on demand.",
    "job.2.h":"The same site",
    "job.2.p":"You are not driving between five buildings. You know the building, and the building knows you.",
    "job.3.h":"Training on the clock",
    "job.3.p":"Language and workplace-safety courses are paid for and sit inside working hours — not in the evening.",
    "job.4.h":"A manager you can reach",
    "job.4.p":"Your operations manager has a phone number you can call and an address you can turn up at.",

    "job.c2.kick":"Open positions",
    "job.c2.h2":"What we're <span class='serif'>looking for right now</span>",
    "ph.jobs":"Positions — placeholder",
    "ph.jobs.note":"The positions below are invented examples so the page can be reviewed. Replace them with real listings, or hide the section and leave only the speculative application.",
    "job.j1.h":"Cleaning operative — day shift",
    "job.j1.p":"A fixed office site, 30 hours a week, Monday to Friday during the day.",
    "job.j1.t1":"Copenhagen","job.j1.t2":"30 hrs/week","job.j1.t3":"Permanent",
    "job.j2.h":"Cleaning operative — evening shift",
    "job.j2.p":"Daily cleaning across two neighbouring buildings, 25 hours a week after closing.",
    "job.j2.t1":"Greater Copenhagen","job.j2.t2":"25 hrs/week","job.j2.t3":"Permanent",
    "job.j3.h":"Operations manager",
    "job.j3.p":"Responsibility for a portfolio of sites, quality measurement and the day-to-day contact with clients.",
    "job.j3.t1":"Copenhagen","job.j3.t2":"Full time","job.j3.t3":"Driving licence required",
    "job.apply":"Apply",

    "job.c3.kick":"Application",
    "job.c3.h2":"Send an application <span class='serif'>— speculative is fine</span>",
    "job.c3.p":"We hire on a rolling basis, including when there is no listing here. Write briefly what you have done before, and what time of day you can work.",
    "job.c3.l1":"You don't need cleaning experience",
    "job.c3.l2":"We reply to every application",
    "job.c3.l3":"Training happens on site, paid",
    "job.c3.l4":"Write in whichever language you are strongest in",

    "job.f.mail":"Email",
    "job.f.role":"Position",
    "job.f.r1":"Cleaning operative — day shift",
    "job.f.r2":"Cleaning operative — evening shift",
    "job.f.r3":"Operations manager",
    "job.f.r4":"Speculative application",
    "job.f.time":"Available",
    "job.f.tm1":"Daytime","job.f.tm2":"Evening","job.f.tm3":"Early morning","job.f.tm4":"Weekend",
    "job.f.msg":"Briefly about you",
    "job.f.submit":"Send application",
    "job.f.fine":"We use these details only to process your application. Don't attach a CV here — we'll ask for it if we take things further."
  }),

  /* ---------------- kontakt.html ---------------- */
  kontakt: Object.assign({}, FORM, LVL_NAMES, {

    "kon2.kick":"Contact",
    "kon2.h1":"Book a <span class='serif'>20-minute walkthrough</span>",
    "kon2.lead":"We walk the building, measure up and send a plan with a fixed monthly price. No obligation, and we won't call again if you say no thanks.",

    "kon2.c1.kick":"How to reach us",
    "kon2.c1.h2":"Call, write <span class='serif'>or use the form</span>",
    "kon2.d.tel":"Phone","kon2.d.mail":"Email","kon2.d.addr":"Address",
    "kon2.d.addr.v":"Copenhagen, Denmark",
    "kon2.d.hours":"Opening hours",
    "kon2.d.hours.v":"Monday–Friday 07.00–16.00. Urgent calls from existing clients round the clock.",
    "kon2.d.cvr":"Company reg. no.",
    "kon2.map":"Map — added once the address is final",

    "kon2.c2.kick":"Enquiry",
    "kon2.c2.h2":"Tell us briefly <span class='serif'>about the job</span>",
    "kon2.f.svc":"Service",
    "kon2.f.sv1":"Daily cleaning",
    "kon2.f.sv2":"Deep cleaning &amp; specialist",
    "kon2.f.sv3":"Window cleaning",
    "kon2.f.sv4":"Post-construction &amp; move-out",
    "kon2.f.sv5":"Not sure yet",
    "kon2.f.lvl":"Service level",
    "kon2.f.lv0":"Not sure yet",

    "kon2.c3.kick":"What happens next",
    "kon2.c3.h2":"From enquiry <span class='serif'>to a fixed price</span>",
    "kon2.s1.h":"We call",
    "kon2.s1.p":"Within one working day, to agree a time that suits you. Not a sales call.",
    "kon2.s2.h":"Walkthrough",
    "kon2.s2.p":"20 minutes on site where we measure up and listen to what's annoying you today.",
    "kon2.s3.h":"Plan &amp; price",
    "kon2.s3.p":"You get a room-by-room plan and a fixed monthly price within 24 hours."
  }),

  /* ---------------- tak.html ---------------- */
  tak: {
    "tak.h1":"Thanks — <span class='serif'>we've got it</span>",
    "tak.p":"We'll come back to you within one working day to arrange a walkthrough. If it's urgent, the phone is the fastest route: <a href='tel:+4531408621'>+45 31 40 86 21</a>.",
    "tak.b1":"Back to the homepage",
    "tak.b2":"See the services"
  }
};
