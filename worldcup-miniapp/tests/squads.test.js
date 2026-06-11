var assert = require("assert");
var squads = require("../utils/squads.js");

var grouped = squads.groupPlayers([
  { name: "A", position: "GK" },
  { name: "B", position: "FW" },
  { name: "C", position: "FW" },
]);

assert.strictEqual(grouped[0].label, "门将");
assert.strictEqual(grouped[0].players.length, 1);
assert.strictEqual(grouped[3].label, "前锋");
assert.strictEqual(grouped[3].players.length, 2);

var empty = squads.buildSquad("England", "英格兰", "flag.png");
assert.strictEqual(empty.teamName, "英格兰");
assert.strictEqual(empty.flagUrl, "flag.png");
assert.strictEqual(empty.hasData, false);
