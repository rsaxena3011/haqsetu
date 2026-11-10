/* HaqSetu — scheme dataset + eligibility engine.
   Pure logic: no DOM, no network. Works in the browser (window.HAQ)
   and in Node (module.exports) so the engine can be tested headlessly.
   Scheme facts are conservative summaries of public government scheme
   guidelines. Final eligibility is always confirmed on official portals. */

"use strict";

var DOCS = {
  aadhaar:   { en: "Aadhaar card", hi: "आधार कार्ड" },
  ration:    { en: "Ration card (BPL / Antyodaya)", hi: "राशन कार्ड (बीपीएल / अंत्योदय)" },
  bank:      { en: "Bank account details / passbook", hi: "बैंक खाते की जानकारी / पासबुक" },
  land:      { en: "Land records (khata / khatauni)", hi: "ज़मीन के काग़ज़ (खतौनी)" },
  birth:     { en: "Girl's birth certificate", hi: "बेटी का जन्म प्रमाण पत्र" },
  pan:       { en: "PAN card", hi: "पैन कार्ड" },
  income:    { en: "Income certificate", hi: "आय प्रमाण पत्र" },
  marksheet: { en: "Last exam marksheet", hi: "पिछली परीक्षा का अंकपत्र" },
  death:     { en: "Husband's death certificate", hi: "पति का मृत्यु प्रमाण पत्र" },
  disability:{ en: "Disability certificate (UDID if available)", hi: "दिव्यांगता प्रमाण पत्र" },
  photo:     { en: "Passport-size photo", hi: "पासपोर्ट आकार की फ़ोटो" },
  mobile:    { en: "Mobile number linked to Aadhaar", hi: "आधार से जुड़ा मोबाइल नंबर" },
  mcp:       { en: "Mother & Child Protection (MCP) card", hi: "माँ-बच्चा सुरक्षा (MCP) कार्ड" },
  caste:     { en: "Caste certificate (for SC / ST)", hi: "जाति प्रमाण पत्र (SC / ST के लिए)" },
  bizproof:  { en: "Business proof / shop address proof", hi: "व्यापार का प्रमाण / दुकान के पते का प्रमाण" },
  bizplan:   { en: "Simple business plan", hi: "सरल व्यापार योजना" }
};

function W(en, hi) { return { en: en, hi: hi }; }

var SCHEMES = [
  {
    id: "pmkisan", name: "PM-KISAN", nameHi: "पीएम-किसान",
    tag: { en: "Farmers", hi: "किसान" },
    summary: W("Yearly cash support for landholding farmer families.",
               "ज़मीन वाले किसान परिवारों के लिए हर साल नकद सहायता।"),
    benefit: W("Rs 6,000 every year, paid in three instalments straight into the bank account.",
               "हर साल 6,000 रुपये, तीन किस्तों में सीधे बैंक खाते में।"),
    docs: ["aadhaar", "land", "bank"],
    apply: W("Apply on the official portal or at your nearest Common Service Centre (CSC).",
             "आधिकारिक पोर्टल पर या अपने नज़दीकी जन सेवा केंद्र (CSC) पर आवेदन करें।"),
    portal: "pmkisan.gov.in",
    test: function (p) {
      if (p.occupation === "farmer" && p.flags.farmland) {
        return [W("You work as a farmer", "आप किसान हैं"),
                W("You own farmland", "आपके पास खेती की ज़मीन है")];
      }
      return null;
    }
  },
  {
    id: "pmjay", name: "Ayushman Bharat PM-JAY", nameHi: "आयुष्मान भारत PM-JAY",
    tag: { en: "Health", hi: "स्वास्थ्य" },
    summary: W("Free hospital treatment cover for poor families identified in the SECC list.",
               "SECC सूची में शामिल ग़रीब परिवारों के लिए मुफ़्त अस्पताल इलाज का कवर।"),
    benefit: W("Cashless treatment up to Rs 5 lakh per family per year at listed hospitals.",
               "सूचीबद्ध अस्पतालों में हर परिवार के लिए हर साल 5 लाख रुपये तक का मुफ़्त (कैशलेस) इलाज।"),
    docs: ["aadhaar", "ration"],
    apply: W("Check your family on the official portal, the Ayushman app, or at a CSC / listed hospital help desk.",
             "आधिकारिक पोर्टल, आयुष्मान ऐप, या CSC / सूचीबद्ध अस्पताल के हेल्प डेस्क पर अपने परिवार की जाँच करें।"),
    portal: "pmjay.gov.in",
    test: function (p) {
      if (p.flags.bpl) {
        return [W("Your family holds a BPL / Antyodaya ration card", "आपके परिवार के पास बीपीएल / अंत्योदय राशन कार्ड है")];
      }
      return null;
    }
  },
  {
    id: "vaya", name: "Ayushman Cover for Age 70+", nameHi: "70+ आयु के लिए आयुष्मान कवर",
    tag: { en: "Health · Seniors", hi: "स्वास्थ्य · बुज़ुर्ग" },
    summary: W("PM-JAY health cover extended to every senior citizen aged 70 or above, at any income.",
               "70 वर्ष या उससे अधिक आयु के हर बुज़ुर्ग के लिए PM-JAY स्वास्थ्य कवर, किसी भी आय पर।"),
    benefit: W("Cashless treatment up to Rs 5 lakh per year at listed hospitals.",
               "सूचीबद्ध अस्पतालों में हर साल 5 लाख रुपये तक का मुफ़्त (कैशलेस) इलाज।"),
    docs: ["aadhaar"],
    apply: W("Enrol on the official PM-JAY portal or at a CSC with just an Aadhaar card.",
             "सिर्फ़ आधार कार्ड के साथ आधिकारिक PM-JAY पोर्टल या CSC पर नामांकन करें।"),
    portal: "pmjay.gov.in",
    test: function (p) {
      if (p.age >= 70) {
        return [W("You are aged 70 or above", "आपकी आयु 70 वर्ष या उससे अधिक है")];
      }
      return null;
    }
  },
  {
    id: "ssy", name: "Sukanya Samriddhi Yojana", nameHi: "सुकन्या समृद्धि योजना",
    tag: { en: "Girl child", hi: "बेटी" },
    summary: W("A government savings account in a young daughter's name, opened by a parent or guardian.",
               "छोटी बेटी के नाम पर सरकारी बचत खाता, जो माता-पिता या अभिभावक खोलते हैं।"),
    benefit: W("Save Rs 250 to Rs 1.5 lakh a year at a government-set interest rate; the money grows for her future.",
               "सरकार द्वारा तय ब्याज दर पर हर साल 250 रुपये से 1.5 लाख रुपये तक बचत करें; पैसा उसके भविष्य के लिए बढ़ता है।"),
    docs: ["birth", "aadhaar", "pan"],
    apply: W("Open the account at any post office or authorised bank branch.",
             "किसी भी डाकघर या अधिकृत बैंक शाखा में खाता खोलें।"),
    portal: "",
    test: function (p) {
      if (p.flags.girlChild) {
        return [W("You have a daughter below the age of 10", "आपकी बेटी की आयु 10 वर्ष से कम है")];
      }
      return null;
    }
  },
  {
    id: "pmayg", name: "PM Awas Yojana — Gramin", nameHi: "पीएम आवास योजना — ग्रामीण",
    tag: { en: "Housing", hi: "आवास" },
    summary: W("Help for poor rural households to build a pucca house.",
               "ग़रीब ग्रामीण परिवारों को पक्का घर बनाने के लिए सहायता।"),
    benefit: W("Financial assistance to build a pucca house in your village, paid in instalments into your account.",
               "आपके गाँव में पक्का घर बनाने के लिए आर्थिक सहायता, किस्तों में आपके खाते में।"),
    docs: ["aadhaar", "ration", "bank"],
    apply: W("Register through your Gram Panchayat, the official portal, or a CSC.",
             "अपनी ग्राम पंचायत, आधिकारिक पोर्टल या CSC के माध्यम से पंजीकरण करें।"),
    portal: "pmayg.nic.in",
    test: function (p) {
      if (p.flags.bpl && p.occupation !== "salaried") {
        return [W("Your family holds a BPL / Antyodaya ration card", "आपके परिवार के पास बीपीएल / अंत्योदय राशन कार्ड है"),
                W("You are a rural / non-salaried household", "आप ग्रामीण / ग़ैर-वेतनभोगी परिवार हैं")];
      }
      return null;
    }
  },
  {
    id: "nsp", name: "National Scholarship Portal", nameHi: "राष्ट्रीय छात्रवृत्ति पोर्टल",
    tag: { en: "Education", hi: "शिक्षा" },
    summary: W("One portal for government scholarships for school and college students.",
               "स्कूल और कॉलेज के छात्रों के लिए सरकारी छात्रवृत्तियों का एक ही पोर्टल।"),
    benefit: W("Scholarship money towards fees and study costs, paid into the student's bank account.",
               "फ़ीस और पढ़ाई के ख़र्च के लिए छात्रवृत्ति की राशि, छात्र के बैंक खाते में।"),
    docs: ["aadhaar", "marksheet", "income", "bank"],
    apply: W("Apply online on the National Scholarship Portal when applications open for the session.",
             "सत्र के लिए आवेदन खुलने पर राष्ट्रीय छात्रवृत्ति पोर्टल पर ऑनलाइन आवेदन करें।"),
    portal: "scholarships.gov.in",
    test: function (p) {
      if (p.occupation === "student" || p.flags.schoolKids) {
        return [W("You are a student, or your children are in school", "आप छात्र हैं, या आपके बच्चे स्कूल में हैं")];
      }
      return null;
    }
  },
  {
    id: "jandhan", name: "PM Jan Dhan Yojana", nameHi: "पीएम जन धन योजना",
    tag: { en: "Banking", hi: "बैंकिंग" },
    summary: W("A first bank account with no minimum balance, for anyone who has never had one.",
               "जिसके पास कभी खाता नहीं रहा, उसके लिए बिना न्यूनतम राशि वाला पहला बैंक खाता।"),
    benefit: W("Zero-balance account with a RuPay debit card and built-in accident insurance.",
               "रुपे डेबिट कार्ड और अंतर्निहित दुर्घटना बीमा के साथ शून्य-शेष खाता।"),
    docs: ["aadhaar", "photo"],
    apply: W("Open at any bank branch or Bank Mitra / CSC point near you.",
             "अपने नज़दीक किसी भी बैंक शाखा या बैंक मित्र / CSC केंद्र पर खोलें।"),
    portal: "pmjdy.gov.in",
    test: function (p) {
      if (p.flags.noBank) {
        return [W("You do not have a bank account yet", "आपके पास अभी बैंक खाता नहीं है")];
      }
      return null;
    }
  },
  {
    id: "apy", name: "Atal Pension Yojana", nameHi: "अटल पेंशन योजना",
    tag: { en: "Pension", hi: "पेंशन" },
    summary: W("A guaranteed monthly pension after 60, built from small savings between 18 and 40.",
               "18 से 40 वर्ष की आयु के बीच छोटी बचत से बनी, 60 के बाद गारंटीड मासिक पेंशन।"),
    benefit: W("A fixed pension of Rs 1,000 to Rs 5,000 every month for life after you turn 60. (Not open to income-tax payers.)",
               "60 वर्ष के बाद जीवन भर हर महीने 1,000 से 5,000 रुपये की निश्चित पेंशन। (आयकर दाताओं के लिए नहीं।)"),
    docs: ["aadhaar", "bank", "mobile"],
    apply: W("Join through the bank where you hold your savings account.",
             "जिस बैंक में आपका बचत खाता है, वहाँ से जुड़ें।"),
    portal: "",
    test: function (p) {
      if (p.age >= 18 && p.age <= 40) {
        return [W("You are between 18 and 40 years old", "आपकी आयु 18 से 40 वर्ष के बीच है")];
      }
      return null;
    }
  },
  {
    id: "mudra", name: "PM Mudra Yojana", nameHi: "पीएम मुद्रा योजना",
    tag: { en: "Business loan", hi: "व्यापार ऋण" },
    summary: W("Loans for small shops, trades and service businesses — no security or guarantee needed.",
               "छोटी दुकानों, व्यापार और सेवा व्यवसायों के लिए ऋण — बिना किसी ज़मानत या गारंटी के।"),
    benefit: W("Business loans up to Rs 10 lakh (Shishu, Kishore and Tarun categories).",
               "10 लाख रुपये तक के व्यापार ऋण (शिशु, किशोर और तरुण श्रेणियाँ)।"),
    docs: ["aadhaar", "pan", "bizproof", "bank"],
    apply: W("Apply at any bank, NBFC or micro-finance institution, or start on the Udyamimitra portal.",
             "किसी भी बैंक, NBFC या सूक्ष्म-वित्त संस्था में आवेदन करें, या उद्यममित्र पोर्टल से शुरुआत करें।"),
    portal: "udyamimitra.in",
    test: function (p) {
      if (p.flags.business) {
        return [W("You want to start or grow a small business", "आप छोटा व्यापार शुरू करना या बढ़ाना चाहते हैं")];
      }
      return null;
    }
  },
  {
    id: "eshram", name: "e-Shram Card", nameHi: "ई-श्रम कार्ड",
    tag: { en: "Workers", hi: "श्रमिक" },
    summary: W("A national registration card for unorganised workers — labourers, helpers, vendors, artisans and more.",
               "असंगठित श्रमिकों के लिए राष्ट्रीय पंजीकरण कार्ड — मज़दूर, सहायक, रेहड़ी वाले, कारीगर और अन्य।"),
    benefit: W("A Universal Account Number card with accident insurance of Rs 2 lakh, and the key to future worker schemes.",
               "2 लाख रुपये के दुर्घटना बीमा के साथ यूनिवर्सल खाता संख्या कार्ड, और भविष्य की श्रमिक योजनाओं की कुंजी।"),
    docs: ["aadhaar", "bank", "mobile"],
    apply: W("Register free on the e-Shram portal or at any CSC.",
             "ई-श्रम पोर्टल या किसी भी CSC पर मुफ़्त पंजीकरण करें।"),
    portal: "eshram.gov.in",
    test: function (p) {
      if ((p.occupation === "unorganised" || p.occupation === "artisan") && p.age >= 16 && p.age <= 59) {
        return [W("You work in the unorganised sector", "आप असंगठित क्षेत्र में काम करते हैं"),
                W("You are between 16 and 59 years old", "आपकी आयु 16 से 59 वर्ष के बीच है")];
      }
      return null;
    }
  },
  {
    id: "vishwakarma", name: "PM Vishwakarma", nameHi: "पीएम विश्वकर्मा",
    tag: { en: "Artisans", hi: "कारीगर" },
    summary: W("Support for traditional artisans and craftspersons in 18 listed trades — carpenter, potter, tailor, blacksmith, barber and more.",
               "18 सूचीबद्ध पारंपरिक व्यवसायों के कारीगरों के लिए सहायता — बढ़ई, कुम्हार, दर्ज़ी, लोहार, नाई और अन्य।"),
    benefit: W("Skills training with a stipend, a toolkit grant, and low-interest loans to grow the trade.",
               "वृत्ति (स्टाइपेंड) के साथ कौशल प्रशिक्षण, औज़ार-किट अनुदान, और व्यापार बढ़ाने के लिए कम ब्याज वाले ऋण।"),
    docs: ["aadhaar", "ration", "bank", "mobile"],
    apply: W("Enrol on the official portal or at a CSC; verification is done locally for your trade.",
             "आधिकारिक पोर्टल या CSC पर नामांकन करें; आपके व्यापार के लिए स्थानीय सत्यापन होता है।"),
    portal: "pmvishwakarma.gov.in",
    test: function (p) {
      if (p.occupation === "artisan" && p.age >= 18) {
        return [W("You are a traditional artisan / craftsperson", "आप पारंपरिक कारीगर / शिल्पकार हैं")];
      }
      return null;
    }
  },
  {
    id: "pmsby", name: "PM Suraksha Bima Yojana", nameHi: "पीएम सुरक्षा बीमा योजना",
    tag: { en: "Insurance", hi: "बीमा" },
    summary: W("Accident insurance that almost anyone with a bank account can afford.",
               "दुर्घटना बीमा जो बैंक खाते वाला लगभग हर व्यक्ति ले सकता है।"),
    benefit: W("Rs 2 lakh to your family on accidental death (Rs 1 lakh for partial disability), for a premium of about Rs 20 a year.",
               "दुर्घटनावश मृत्यु पर आपके परिवार को 2 लाख रुपये (आंशिक दिव्यांगता पर 1 लाख रुपये), साल में लगभग 20 रुपये के प्रीमियम पर।"),
    docs: ["aadhaar", "bank"],
    apply: W("Activate it at your bank branch or through your bank's app / net-banking.",
             "अपनी बैंक शाखा में या बैंक के ऐप / नेट-बैंकिंग से इसे चालू करें।"),
    portal: "",
    test: function (p) {
      if (p.age >= 18 && p.age <= 70) {
        return [W("You are between 18 and 70 years old", "आपकी आयु 18 से 70 वर्ष के बीच है")];
      }
      return null;
    }
  },
  {
    id: "pmjjby", name: "PM Jeevan Jyoti Bima Yojana", nameHi: "पीएम जीवन ज्योति बीमा योजना",
    tag: { en: "Insurance", hi: "बीमा" },
    summary: W("Simple life insurance for the family's security, renewed every year.",
               "परिवार की सुरक्षा के लिए सरल जीवन बीमा, हर साल नवीनीकृत।"),
    benefit: W("Rs 2 lakh to your family if you die for any reason, for a premium of about Rs 436 a year.",
               "किसी भी कारण से मृत्यु होने पर आपके परिवार को 2 लाख रुपये, साल में लगभग 436 रुपये के प्रीमियम पर।"),
    docs: ["aadhaar", "bank"],
    apply: W("Activate it at your bank branch or through your bank's app / net-banking.",
             "अपनी बैंक शाखा में या बैंक के ऐप / नेट-बैंकिंग से इसे चालू करें।"),
    portal: "",
    test: function (p) {
      if (p.age >= 18 && p.age <= 50) {
        return [W("You are between 18 and 50 years old", "आपकी आयु 18 से 50 वर्ष के बीच है")];
      }
      return null;
    }
  },
  {
    id: "pmmvy", name: "PM Matru Vandana Yojana", nameHi: "पीएम मातृ वंदना योजना",
    tag: { en: "Mothers", hi: "माताएँ" },
    summary: W("Cash support for a woman's first pregnancy, so she can rest and eat well.",
               "महिला की पहली गर्भावस्था के लिए नकद सहायता, ताकि वह आराम कर सके और अच्छा खा सके।"),
    benefit: W("Rs 5,000 in instalments for the first pregnancy, paid into your bank or post-office account.",
               "पहली गर्भावस्था के लिए किस्तों में 5,000 रुपये, आपके बैंक या डाकघर खाते में।"),
    docs: ["aadhaar", "mcp", "bank"],
    apply: W("Register at your Anganwadi centre or through a CSC.",
             "अपने आँगनवाड़ी केंद्र या CSC के माध्यम से पंजीकरण करें।"),
    portal: "",
    test: function (p) {
      if (p.gender === "female" && p.flags.pregnant) {
        return [W("You are expecting your first child", "आप अपने पहले बच्चे की माँ बनने वाली हैं")];
      }
      return null;
    }
  },
  {
    id: "standup", name: "Stand-Up India", nameHi: "स्टैंड-अप इंडिया",
    tag: { en: "Business loan", hi: "व्यापार ऋण" },
    summary: W("Large bank loans for SC / ST and women entrepreneurs starting a new business.",
               "नया व्यापार शुरू करने वाले SC / ST और महिला उद्यमियों के लिए बड़े बैंक ऋण।"),
    benefit: W("Bank loans from Rs 10 lakh to Rs 1 crore for a new (greenfield) business.",
               "नए (ग्रीनफ़ील्ड) व्यापार के लिए 10 लाख से 1 करोड़ रुपये तक के बैंक ऋण।"),
    docs: ["aadhaar", "pan", "caste", "bizplan"],
    apply: W("Apply through the Stand-Up Mitra portal or any bank branch.",
             "स्टैंड-अप मित्र पोर्टल या किसी भी बैंक शाखा के माध्यम से आवेदन करें।"),
    portal: "standupmitra.in",
    test: function (p) {
      if (p.flags.business && (p.category === "sc" || p.category === "st" || p.gender === "female")) {
        return [W("You want to start a new business", "आप नया व्यापार शुरू करना चाहते हैं"),
                W("You are an SC / ST applicant or a woman entrepreneur", "आप SC / ST आवेदक हैं या महिला उद्यमी हैं")];
      }
      return null;
    }
  },
  {
    id: "ignwps", name: "Widow Pension (NSAP)", nameHi: "विधवा पेंशन (NSAP)",
    tag: { en: "Pension", hi: "पेंशन" },
    summary: W("A monthly pension for widows from below-poverty-line families.",
               "ग़रीबी रेखा से नीचे के परिवारों की विधवाओं के लिए मासिक पेंशन।"),
    benefit: W("A monthly widow pension paid by the government (central share plus your state's top-up).",
               "सरकार द्वारा दी जाने वाली मासिक विधवा पेंशन (केंद्र का हिस्सा और आपके राज्य का अतिरिक्त हिस्सा)।"),
    docs: ["aadhaar", "death", "ration", "bank"],
    apply: W("Apply at a CSC, your district social welfare office, or through the NSAP portal.",
             "CSC, अपने ज़िला समाज कल्याण कार्यालय, या NSAP पोर्टल के माध्यम से आवेदन करें।"),
    portal: "nsap.nic.in",
    test: function (p) {
      if (p.flags.widow && p.flags.bpl && p.age >= 40) {
        return [W("You are a widow", "आप विधवा हैं"),
                W("Your family holds a BPL ration card", "आपके परिवार के पास बीपीएल राशन कार्ड है"),
                W("You are aged 40 or above", "आपकी आयु 40 वर्ष या उससे अधिक है")];
      }
      return null;
    }
  },
  {
    id: "ignoaps", name: "Old Age Pension (NSAP)", nameHi: "वृद्धावस्था पेंशन (NSAP)",
    tag: { en: "Pension · Seniors", hi: "पेंशन · बुज़ुर्ग" },
    summary: W("A monthly pension for senior citizens from below-poverty-line families.",
               "ग़रीबी रेखा से नीचे के परिवारों के बुज़ुर्गों के लिए मासिक पेंशन।"),
    benefit: W("A monthly old-age pension (central share plus your state's top-up), paid into your account.",
               "मासिक वृद्धावस्था पेंशन (केंद्र का हिस्सा और राज्य का अतिरिक्त), आपके खाते में।"),
    docs: ["aadhaar", "ration", "bank"],
    apply: W("Apply at a CSC, your district social welfare office, or through the NSAP portal.",
             "CSC, अपने ज़िला समाज कल्याण कार्यालय, या NSAP पोर्टल के माध्यम से आवेदन करें।"),
    portal: "nsap.nic.in",
    test: function (p) {
      if (p.age >= 60 && p.flags.bpl) {
        return [W("You are aged 60 or above", "आपकी आयु 60 वर्ष या उससे अधिक है"),
                W("Your family holds a BPL ration card", "आपके परिवार के पास बीपीएल राशन कार्ड है")];
      }
      return null;
    }
  },
  {
    id: "igdps", name: "Disability Pension (NSAP)", nameHi: "दिव्यांगता पेंशन (NSAP)",
    tag: { en: "Pension", hi: "पेंशन" },
    summary: W("A monthly pension for people with severe disability from below-poverty-line families.",
               "ग़रीबी रेखा से नीचे के परिवारों के गंभीर दिव्यांग व्यक्तियों के लिए मासिक पेंशन।"),
    benefit: W("A monthly disability pension (central share plus your state's top-up).",
               "मासिक दिव्यांगता पेंशन (केंद्र का हिस्सा और राज्य का अतिरिक्त हिस्सा)।"),
    docs: ["disability", "aadhaar", "ration", "bank"],
    apply: W("Apply at a CSC, your district social welfare office, or through the NSAP portal.",
             "CSC, अपने ज़िला समाज कल्याण कार्यालय, या NSAP पोर्टल के माध्यम से आवेदन करें।"),
    portal: "nsap.nic.in",
    test: function (p) {
      if (p.flags.disability && p.flags.bpl && p.age >= 18) {
        return [W("You live with a severe disability", "आप गंभीर दिव्यांगता के साथ जी रहे हैं"),
                W("Your family holds a BPL ration card", "आपके परिवार के पास बीपीएल राशन कार्ड है")];
      }
      return null;
    }
  }
];

function matchSchemes(profile) {
  var out = [];
  for (var i = 0; i < SCHEMES.length; i++) {
    var why = SCHEMES[i].test(profile);
    if (why && why.length) {
      out.push({ scheme: SCHEMES[i], why: why });
    }
  }
  return out;
}

function documentsFor(matches) {
  var seen = {}, list = [];
  for (var i = 0; i < matches.length; i++) {
    var docs = matches[i].scheme.docs;
    for (var j = 0; j < docs.length; j++) {
      if (!seen[docs[j]]) { seen[docs[j]] = true; list.push(docs[j]); }
    }
  }
  return list;
}

var HAQ = { DOCS: DOCS, SCHEMES: SCHEMES, matchSchemes: matchSchemes, documentsFor: documentsFor };
if (typeof window !== "undefined") { window.HAQ = HAQ; }
if (typeof module !== "undefined" && module.exports) { module.exports = HAQ; }
