var api = require("../../utils/api.js");
var reminderUtil = require("../../utils/reminders.js");
var i18n = require("../../utils/i18n.js");

Page({
  data: {
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    lang: "zh",
    t: i18n.getText("zh"),
    calYear: 2026,
    calMonth: 6,
    calDays: [],
    selectedDate: "",
    selectedMatches: [],
    matchDates: {},
    loading: true,
    error: "",
  },

  onLoad: function () {
    var lang = wx.getStorageSync("lang") || "zh";
    var dateStr = api.getTodayBeijingDateKey();
    this.setData({
      lang: lang,
      t: i18n.getText(lang),
      weekdays: lang === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["日", "一", "二", "三", "四", "五", "六"],
      selectedDate: dateStr,
    });
    this.loadMatches();
  },

  loadMatches: function () {
    var that = this;
    api.getMatches(function (err, matches) {
      if (err) {
        that.setData({ loading: false, error: "赛程加载失败，请稍后重试" });
        return;
      }
      var matchDates = {};
      var favoriteTeam = wx.getStorageSync("followedTeams") || [wx.getStorageSync("favoriteTeam") || ""];
      for (var i = 0; i < matches.length; i++) {
        var m = api.markFavoriteMatch(api.formatMatch(matches[i], i), favoriteTeam);
        var date = m.beijingDate;
        if (!matchDates[date]) matchDates[date] = [];
        matchDates[date].push(m);
      }

      that.setData({ matchDates: matchDates, loading: false, error: "" });
      that.buildCalendar(2026, 6);
      that.updateMatches();
    });
  },

  buildCalendar: function (year, month) {
    var today = api.getTodayBeijingDateKey();
    var days = [];
    var firstDay = new Date(year, month - 1, 1).getDay();
    var daysInMonth = new Date(year, month, 0).getDate();

    // Previous month padding
    for (var i = 0; i < firstDay; i++) {
      days.push({ day: "", date: "", inMonth: false, hasMatch: false, isToday: false });
    }

    // Current month
    for (var d = 1; d <= daysInMonth; d++) {
      var date = year + "-" + (month < 10 ? "0" + month : month) + "-" + (d < 10 ? "0" + d : "" + d);
      days.push({
        day: d,
        date: date,
        inMonth: true,
        hasMatch: !!this.data.matchDates[date],
        isToday: date === today,
      });
    }

    this.setData({ calYear: year, calMonth: month, calDays: days });
  },

  prevMonth: function () {
    var m = this.data.calMonth - 1;
    var y = this.data.calYear;
    if (m < 6) { m = 7; y = 2026; }
    this.buildCalendar(y, m);
  },

  nextMonth: function () {
    var m = this.data.calMonth + 1;
    var y = this.data.calYear;
    if (m > 7) { m = 6; y = 2026; }
    this.buildCalendar(y, m);
  },

  selectDate: function (e) {
    var date = e.currentTarget.dataset.date;
    if (!date) return;
    this.setData({ selectedDate: date });
    this.updateMatches();
  },

  updateMatches: function () {
    var date = this.data.selectedDate;
    var ms = this.data.matchDates[date] || [];
    ms.sort(function (a, b) { return a.utcDate.localeCompare(b.utcDate); });
    this.setData({ selectedMatches: ms });
  },

  goMatchDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: "/pages/match-detail/match-detail?id=" + id });
  },

  setReminder: function (e) {
    var m = e.currentTarget.dataset.match;
    wx.showActionSheet({
      itemList: ["提前15分钟", "提前30分钟", "提前1小时"],
      success: function (res) {
        var mins = res.tapIndex === 0 ? 15 : res.tapIndex === 1 ? 30 : 60;
        var item = {
          id: m.id + "-" + mins, matchId: m.id,
          teamA: m.homeTeam, teamB: m.awayTeam,
          kickoffUtc: m.utcDate, minutesBefore: mins,
          label: "提前" + mins + "分钟",
        };
        reminderUtil.requestReminderSubscription(function (_, sub) {
          var raw = wx.getStorageSync("reminders") || "[]";
          var reminders = reminderUtil.saveReminder(JSON.parse(raw), item, sub);
          wx.setStorageSync("reminders", JSON.stringify(reminders));
          wx.showToast({
            title: sub && sub.subscribed ? "已订阅提醒" : "已保存本地提醒",
            icon: "success",
          });
        });
      },
    });
  },

  onShareAppMessage: function () {
    return {
      title: "2026 世界杯赛程｜" + this.data.selectedDate,
      path: "/pages/schedule/schedule",
    };
  },
});
