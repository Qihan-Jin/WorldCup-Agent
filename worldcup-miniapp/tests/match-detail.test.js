var assert = require("assert");
var detail = require("../utils/match-detail.js");

var future = detail.buildMatchDetail({
  id: 1,
  homeTeam: "England",
  awayTeam: "Croatia",
  homeScore: null,
  awayScore: null,
  status: "SCHEDULED",
  stage: "GROUP_STAGE",
  group: "D",
  kickoff: "06/18 04:00",
  utcDate: "2026-06-17T20:00:00Z",
  venue: "休斯顿 · 美国",
});

assert.strictEqual(future.stageLabel, "小组赛 D组");
assert.strictEqual(future.scoreDisplay, "vs");
assert.strictEqual(future.statusLabel, "未开始");
assert.strictEqual(future.hasScore, false);

var finished = detail.buildMatchDetail({
  id: 2,
  homeTeam: "Brazil",
  awayTeam: "France",
  homeScore: 2,
  awayScore: 1,
  status: "FINISHED",
  stage: "FINAL",
  group: null,
  kickoff: "07/19 08:00",
  utcDate: "2026-07-19T00:00:00Z",
  venue: "大都会人寿体育场 · 美国",
});

assert.strictEqual(finished.stageLabel, "决赛");
assert.strictEqual(finished.scoreDisplay, "2 - 1");
assert.strictEqual(finished.statusLabel, "已结束");
assert.strictEqual(finished.hasScore, true);
assert.strictEqual(finished.homeWinner, true);
assert.strictEqual(finished.awayWinner, false);

var teamCards = detail.buildTeamCards(future, "England", [
  { nameEn: "England", nameZh: "英格兰", flagUrl: "eng.png", group: "D" },
  { nameEn: "Croatia", nameZh: "克罗地亚", flagUrl: "hr.png", group: "L" },
]);

assert.strictEqual(teamCards.home.name, "England");
assert.strictEqual(teamCards.home.flagUrl, "eng.png");
assert.strictEqual(teamCards.home.group, "D");
assert.strictEqual(teamCards.home.isFavorite, true);
assert.strictEqual(teamCards.away.isFavorite, false);
