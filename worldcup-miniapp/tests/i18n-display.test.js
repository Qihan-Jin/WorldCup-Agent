var assert = require("assert");
var api = require("../utils/api.js");
var i18n = require("../utils/i18n.js");
var tabbar = require("../utils/tabbar.js");

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text || "");
}

var enTabs = tabbar.getTabBarLabels("en");
assert.deepStrictEqual(enTabs, ["Home", "Schedule", "Standings", "Knockout"]);
assert.strictEqual(enTabs.some(hasChinese), false);
assert.strictEqual(hasChinese(i18n.formatCountdown(90061000, "en")), false);
assert.strictEqual(hasChinese(i18n.getReminderOptions("en").join(" ")), false);
assert.strictEqual(hasChinese(i18n.formatReminderLabel(60, "en")), false);

assert.strictEqual(api.formatBeijingMonthDay("2026-06-17T20:00:00Z", "en"), "Jun 18");
assert.strictEqual(api.formatBeijingMonthDay("2026-06-17T20:00:00Z", "zh"), "6月18日");

var match = api.formatMatch({
  id: 1,
  homeTeam: { name: "England" },
  awayTeam: { name: "Croatia" },
  score: { fullTime: { home: null, away: null } },
  status: "SCHEDULED",
  stage: "GROUP_STAGE",
  group: "GROUP_D",
  utcDate: "2026-06-17T20:00:00Z",
}, 8);

assert.strictEqual(hasChinese(match.venueEn), false);
assert.strictEqual(hasChinese(match.localTimeEn), false);
assert.strictEqual(match.localTimeEn.indexOf("Local time ") === 0, true);
