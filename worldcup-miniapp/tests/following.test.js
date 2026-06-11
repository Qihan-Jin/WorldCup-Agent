var assert = require("assert");
var following = require("../utils/following.js");
var reminderUtil = require("../utils/reminders.js");

assert.deepStrictEqual(following.toggleTeam([], "England"), ["England"]);
assert.deepStrictEqual(following.toggleTeam(["England"], "Brazil"), ["England", "Brazil"]);
assert.deepStrictEqual(following.toggleTeam(["England", "Brazil"], "England"), ["Brazil"]);
assert.strictEqual(following.primaryTeam(["Brazil", "France"]), "Brazil");

var reminderList = following.upsertReminder([], {
  id: "1-15",
  matchId: 1,
  minutesBefore: 15,
  subscribed: true,
});
assert.strictEqual(reminderList.length, 1);
assert.strictEqual(reminderList[0].subscribed, true);

var replaced = following.upsertReminder(reminderList, {
  id: "1-15",
  matchId: 1,
  minutesBefore: 15,
  subscribed: false,
});
assert.strictEqual(replaced.length, 1);
assert.strictEqual(replaced[0].subscribed, false);

var saved = reminderUtil.saveReminder([], { id: "2-30", matchId: 2 }, {
  subscribed: true,
  templateId: "tpl",
});
assert.strictEqual(saved[0].pushStatus, "subscribed");
assert.strictEqual(saved[0].templateId, "tpl");

var local = reminderUtil.saveReminder([], { id: "3-30", matchId: 3 }, {
  subscribed: false,
});
assert.strictEqual(local[0].pushStatus, "local");
