var assert = require("assert");
var fs = require("fs");
var path = require("path");
var i18n = require("../utils/i18n.js");

var appJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../app.json"), "utf8"));

assert.strictEqual(appJson.tabBar.list[0].text, "Home");
assert.strictEqual(appJson.tabBar.list[1].text, "Schedule");
assert.strictEqual(appJson.tabBar.list[2].text, "Standings");
assert.strictEqual(appJson.tabBar.list[3].text, "Knockout");

var zh = i18n.getText("zh");
var en = i18n.getText("en");
var matchDetailJs = fs.readFileSync(path.join(__dirname, "../pages/match-detail/match-detail.js"), "utf8");
var matchDetailWxml = fs.readFileSync(path.join(__dirname, "../pages/match-detail/match-detail.wxml"), "utf8");

assert.strictEqual(zh.appName, "2026 世界杯");
assert.strictEqual(zh.chooseTeam, "选择你的主队");
assert.strictEqual(zh.loading, "加载中…");
assert.strictEqual(zh.subscribedReminder, "提醒已保存");
assert.strictEqual(en.searchPlaceholder, "Search teams…");
assert.strictEqual(en.subscribedReminder, "Reminder saved");
assert.strictEqual(Object.prototype.hasOwnProperty.call(zh, "statsPending"), false);
assert.strictEqual(Object.prototype.hasOwnProperty.call(en, "statsPending"), false);
assert.strictEqual(matchDetailJs.indexOf('{ key: "stats" }'), -1);
assert.strictEqual(matchDetailWxml.indexOf("statsPending"), -1);
