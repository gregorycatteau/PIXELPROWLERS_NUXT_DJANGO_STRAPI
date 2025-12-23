import fs from "node:fs";
import path from "node:path";

function extractTemplate(vueSource) {
  const m = vueSource.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
  return m ? m[1] : "";
}

function fail(msg) {
  console.error(`❌ questionwrapper:guard — FAIL: ${msg}`);
  process.exit(1);
}

const target = path.resolve(process.cwd(), "app/components/journey/JourneyQuestionBlock.vue");
if (!fs.existsSync(target)) {
  fail(`Missing file: ${target}`);
}

const src = fs.readFileSync(target, "utf8");
const tpl = extractTemplate(src);

if (!tpl.includes("<PPQuestionCard")) {
  fail("JourneyQuestionBlock must render <PPQuestionCard> (DS enforced).");
}

const forbidden = [
  "pp-journey-question",
  "JourneyQuestion",
  "JourneyQuestionBlock",
];

for (const needle of forbidden) {
  if (tpl.includes(needle)) {
    fail(`Legacy question wrapper pattern found in template: \"${needle}\"`);
  }
}

console.log("✅ questionwrapper:guard — OK (JourneyQuestionBlock uses PPQuestionCard, no legacy wrappers)." );
