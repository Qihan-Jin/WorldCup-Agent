var assert = require("assert");
var fs = require("fs");
var path = require("path");
var i18n = require("../utils/i18n.js");

var appJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../app.json"), "utf8"));

assert.strictEqual(appJson.tabBar.list[0].text, "首页");
assert.strictEqual(appJson.tabBar.list[1].text, "赛程");
assert.strictEqual(appJson.tabBar.list[2].text, "积分");
assert.strictEqual(appJson.tabBar.list[3].text, "淘汰赛");

var zh = i18n.getText("zh");
var en = i18n.getText("en");

assert.strictEqual(zh.appName, "2026 世界杯");
assert.strictEqual(zh.chooseTeam, "选择你的主队");
assert.strictEqual(zh.loading, "加载中…");
assert.strictEqual(en.searchPlaceholder, "Search teams…");
