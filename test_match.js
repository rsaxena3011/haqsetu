/* HaqSetu engine fixtures — run: node test_match.js
   Each fixture is a realistic profile; assertions check that the right
   schemes fire and the wrong ones stay silent. */
"use strict";
var HAQ = require("./schemes.js");

function P(over) {
  var base = { age: 30, gender: "male", occupation: "other", income: "10to30",
               category: "general",
               flags: { bpl: false, widow: false, pregnant: false, girlChild: false,
                        farmland: false, disability: false, business: false,
                        schoolKids: false, noBank: false } };
  over = over || {};
  for (var k in over) {
    if (k === "flags") { for (var f in over.flags) base.flags[f] = over.flags[f]; }
    else base[k] = over[k];
  }
  return base;
}

var failures = 0, checks = 0;
function ids(profile) { return HAQ.matchSchemes(profile).map(function (m) { return m.scheme.id; }); }
function expect(label, profile, mustHave, mustNotHave) {
  var got = ids(profile);
  (mustHave || []).forEach(function (id) {
    checks++;
    if (got.indexOf(id) === -1) { failures++; console.log("FAIL " + label + ": expected " + id + " in [" + got.join(",") + "]"); }
  });
  (mustNotHave || []).forEach(function (id) {
    checks++;
    if (got.indexOf(id) !== -1) { failures++; console.log("FAIL " + label + ": did NOT expect " + id + " in [" + got.join(",") + "]"); }
  });
  console.log("ok   " + label + " -> " + got.length + " matches [" + got.join(", ") + "]");
}

/* 1. Farmer, 68, owns land, BPL family */
expect("farmer68", P({ age: 68, occupation: "farmer", flags: { farmland: true, bpl: true } }),
  ["pmkisan", "pmjay", "ignoaps", "pmsby"], ["vaya", "apy", "pmjjby", "ssy"]);

/* 2. Farmer, 72 — crosses into the 70+ health cover */
expect("farmer72", P({ age: 72, occupation: "farmer", flags: { farmland: true } }),
  ["pmkisan", "vaya"], ["pmjay", "pmsby"]);

/* 3. Young mother, first pregnancy, daughter not yet born */
expect("mother24", P({ age: 24, gender: "female", occupation: "homemaker", flags: { pregnant: true, bpl: true } }),
  ["pmmvy", "pmjay", "apy"], ["ssy", "pmkisan"]);

/* 4. Widow, 45, BPL, unorganised work */
expect("widow45", P({ age: 45, gender: "female", occupation: "unorganised", flags: { widow: true, bpl: true } }),
  ["ignwps", "eshram", "pmjay"], ["ignoaps", "standup"]);

/* 5. Artisan, 35, wants to grow the trade */
expect("artisan35", P({ age: 35, occupation: "artisan", flags: { business: true } }),
  ["vishwakarma", "mudra", "eshram", "apy"], ["pmkisan", "standup"]);

/* 6. Woman entrepreneur, SC category, new business */
expect("standup32", P({ age: 32, gender: "female", occupation: "selfemployed", category: "sc", flags: { business: true } }),
  ["standup", "mudra"], ["pmkisan", "ignwps"]);

/* 7. Student, 19 */
expect("student19", P({ age: 19, occupation: "student", flags: { schoolKids: false } }),
  ["nsp", "apy", "pmsby", "pmjjby"], ["eshram", "pmkisan"]);

/* 8. Parent of school-going children (not a student himself) */
expect("parent40", P({ age: 40, occupation: "salaried", flags: { schoolKids: true, girlChild: true } }),
  ["nsp", "ssy"], ["eshram"]);

/* 9. No bank account yet */
expect("nobank28", P({ age: 28, occupation: "unorganised", flags: { noBank: true } }),
  ["jandhan", "eshram"], ["pmkisan"]);

/* 10. Severe disability, BPL, 30 */
expect("disability30", P({ age: 30, occupation: "unemployed", flags: { disability: true, bpl: true } }),
  ["igdps", "pmjay"], ["ignoaps", "ignwps"]);

/* 11. Salaried, higher income, no flags — only the two universal insurance schemes */
expect("salaried45", P({ age: 45, occupation: "salaried", income: "gt60" }),
  ["pmsby", "pmjjby"], ["pmkisan", "pmjay", "mudra", "apy", "ssy", "eshram", "ignoaps"]);

/* 12. Documents checklist aggregates and de-duplicates */
var m = HAQ.matchSchemes(P({ age: 68, occupation: "farmer", flags: { farmland: true, bpl: true } }));
var docs = HAQ.documentsFor(m);
checks++;
if (docs.indexOf("aadhaar") === -1 || docs.indexOf("land") === -1 || docs.indexOf("ration") === -1) {
  failures++; console.log("FAIL docs: expected aadhaar/land/ration in [" + docs.join(",") + "]");
}
checks++;
if (new Set(docs).size !== docs.length) { failures++; console.log("FAIL docs: duplicates in [" + docs.join(",") + "]"); }
console.log("ok   docs checklist -> [" + docs.join(", ") + "]");

console.log("---");
console.log(checks + " checks, " + failures + " failures");
process.exit(failures ? 1 : 0);
