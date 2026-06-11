var assert = require("assert");
var api = require("../utils/api.js");

var match = api.formatMatch({
  id: 1,
  homeTeam: { name: "England" },
  awayTeam: { name: "Croatia" },
  score: { fullTime: { home: null, away: null } },
  status: "SCHEDULED",
  stage: "GROUP_STAGE",
  group: "GROUP_D",
  utcDate: "2026-06-17T20:00:00Z",
}, 0);

assert.strictEqual(match.kickoff, "06/18 04:00");
assert.strictEqual(match.beijingDate, "2026-06-18");
assert.strictEqual(api.getBeijingDateKey("2026-07-18T23:30:00Z"), "2026-07-19");

var localized = api.formatMatch({
  id: 2,
  homeTeam: { name: "Canada" },
  awayTeam: { name: "Bosnia-Herzegovina" },
  score: { fullTime: { home: null, away: null } },
  status: "SCHEDULED",
  stage: "GROUP_STAGE",
  group: "GROUP_B",
  utcDate: "2026-06-12T19:00:00Z",
}, 1);

assert.strictEqual(localized.homeTeam, "加拿大");
assert.strictEqual(localized.awayTeam, "波黑");
assert.strictEqual(localized.homeTeamEn, "Canada");
assert.strictEqual(localized.awayTeamEn, "Bosnia-Herzegovina");
assert.strictEqual(localized.awayTeamFlagUrl.indexOf("/ba.png") > -1, true);
assert.strictEqual(localized.awayTeamGroup, "B");
assert.strictEqual(localized.localTime, "当地时间 06/12 14:00");

var favoriteMatch = api.markFavoriteMatch(localized, "Canada");
assert.strictEqual(favoriteMatch.hasFavorite, true);
assert.strictEqual(favoriteMatch.homeFavorite, true);
assert.strictEqual(favoriteMatch.awayFavorite, false);
