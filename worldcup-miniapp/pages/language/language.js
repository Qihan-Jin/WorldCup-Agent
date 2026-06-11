var i18n = require("../../utils/i18n.js");

Page({
  data: {
    t: i18n.getText("zh"),
  },

  selectChinese: function () {
    var app = getApp();
    app.globalData.lang = "zh";
    wx.setStorageSync("lang", "zh");
    wx.redirectTo({ url: "/pages/team-select/team-select" });
  },

  selectEnglish: function () {
    var app = getApp();
    app.globalData.lang = "en";
    wx.setStorageSync("lang", "en");
    wx.redirectTo({ url: "/pages/team-select/team-select" });
  },
});
