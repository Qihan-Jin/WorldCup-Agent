var api = require("../../utils/api.js");
var detail = require("../../utils/match-detail.js");
var teams = require("../../data/teams.js");
var reminderUtil = require("../../utils/reminders.js");
var squadUtil = require("../../utils/squads.js");
var i18n = require("../../utils/i18n.js");
var tabbar = require("../../utils/tabbar.js");

Page({
  data: {
    id: "",
    match: null,
    lang: "zh",
    t: i18n.getText("zh"),
    loading: true,
    error: "",
    countdown: "",
    reminders: [],
    matchReminders: [],
    activeTab: "overview",
    tabs: [
      { key: "overview" },
      { key: "lineup" },
    ],
    teamCards: null,
    matchSquads: null,
    teamFlagUrl: "",
  },

  onLoad: function (options) {
    var lang = wx.getStorageSync("lang") || "zh";
    tabbar.applyNavigationTitle("detail", lang);
    this.setData({ id: options.id || "", lang: lang, t: i18n.getText(lang) });
    this.loadReminders();
    this.loadMatch();
  },

  onUnload: function () {
    if (this._timer) clearInterval(this._timer);
  },

  _timer: null,

  loadMatch: function () {
    var that = this;
    api.getMatches(function (err, matches) {
      if (err) {
        that.setData({ loading: false, error: that.data.t.loadDetailError });
        return;
      }

      var target = null;
      for (var i = 0; i < matches.length; i++) {
        if (String(matches[i].id) === String(that.data.id)) {
          target = api.formatMatch(matches[i], i);
          break;
        }
      }

      if (!target) {
        that.setData({ loading: false, error: that.data.t.matchNotFound });
        return;
      }

      var match = detail.buildMatchDetail(target);
      var favoriteTeam = wx.getStorageSync("favoriteTeam") || "";
      var teamCards = detail.buildTeamCards(match, favoriteTeam, teams.allTeams);
      var matchSquads = squadUtil.buildMatchSquads(match, teamCards);
      var flagUrl = teamCards.home.isFavorite ? teamCards.home.flagUrl : "";
      if (!flagUrl && teamCards.away.isFavorite) flagUrl = teamCards.away.flagUrl;
      if (!flagUrl) flagUrl = teamCards.home.flagUrl || teamCards.away.flagUrl;

      that.setData({
        match: match,
        teamCards: teamCards,
        matchSquads: matchSquads,
        teamFlagUrl: flagUrl,
        loading: false,
        error: "",
      });
      that.startCountdown();
    });
  },

  startCountdown: function () {
    var that = this;
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(function () {
      var match = that.data.match;
      if (!match || match.status === "FINISHED") {
        that.setData({ countdown: "" });
        return;
      }
      var diff = new Date(match.utcDate).getTime() - Date.now();
      that.setData({ countdown: i18n.formatCountdown(diff, that.data.lang) });
    }, 1000);
  },

  loadReminders: function () {
    var raw = wx.getStorageSync("reminders") || "[]";
    var reminders = JSON.parse(raw);
    this.setData({
      reminders: reminders,
      matchReminders: this.filterMatchReminders(reminders),
    });
  },

  filterMatchReminders: function (reminders) {
    var id = this.data.match ? this.data.match.id : this.data.id;
    return reminders.filter(function (r) { return String(r.matchId) === String(id); });
  },

  switchTab: function (e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key });
  },

  setReminder: function () {
    var match = this.data.match;
    if (!match) return;
    var that = this;
    var lang = this.data.lang;
    wx.showActionSheet({
      itemList: i18n.getReminderOptions(lang),
      success: function (res) {
        var mins = res.tapIndex === 0 ? 15 : res.tapIndex === 1 ? 30 : 60;
        var item = {
          id: match.id + "-" + mins,
          matchId: match.id,
          teamA: match.homeTeam,
          teamB: match.awayTeam,
          kickoffUtc: match.utcDate,
          minutesBefore: mins,
          label: i18n.formatReminderLabel(mins, lang),
        };
        reminderUtil.requestReminderSubscription(function (_, sub) {
          var reminders = reminderUtil.saveReminder(that.data.reminders, item, sub);
          wx.setStorageSync("reminders", JSON.stringify(reminders));
          that.setData({
            reminders: reminders,
            matchReminders: that.filterMatchReminders(reminders),
          });
          wx.showToast({
            title: that.data.t.savedReminderToast,
            icon: "success",
          });
        });
      },
    });
  },

  deleteReminder: function (e) {
    var id = e.currentTarget.dataset.id;
    var reminders = this.data.reminders.filter(function (r) { return r.id !== id; });
    wx.setStorageSync("reminders", JSON.stringify(reminders));
    this.setData({
      reminders: reminders,
      matchReminders: this.filterMatchReminders(reminders),
    });
  },

  goSchedule: function () {
    wx.switchTab({ url: "/pages/schedule/schedule" });
  },

  onShareAppMessage: function () {
    var match = this.data.match;
    if (!match) {
      return {
        title: this.data.t.shareDetailFallback,
        path: "/pages/home/home",
      };
    }
    return {
      title: this.data.lang === "en"
        ? match.homeTeamEn + " vs " + match.awayTeamEn + ", Beijing time " + match.kickoff
        : match.homeTeam + " vs " + match.awayTeam + "，北京时间 " + match.kickoff,
      path: "/pages/match-detail/match-detail?id=" + match.id,
    };
  },
});
