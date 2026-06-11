var api = require("../../utils/api.js");
var reminderUtil = require("../../utils/reminders.js");
var i18n = require("../../utils/i18n.js");

Page({
  data: {
    teamName: "",
    lang: "zh",
    t: i18n.getText("zh"),
    followedTeams: [],
    teamFlagUrl: "",
    nextMatch: null,
    countdown: "",
    myMatches: [],
    todayMatches: [],
    reminders: [],
    loading: true,
    error: "",
    todayDate: "",
  },

  onShow: function () {
    var team = wx.getStorageSync("favoriteTeam") || "";
    var lang = wx.getStorageSync("lang") || "zh";
    var followedTeams = wx.getStorageSync("followedTeams") || (team ? [team] : []);
    var teamInfo = api.findTeamInfo(team);
    var flagUrl = teamInfo ? teamInfo.flagUrl : "";
    var todayDate = api.formatBeijingMonthDay(new Date().toISOString());
    this.setData({
      teamName: team,
      lang: lang,
      t: i18n.getText(lang),
      followedTeams: followedTeams,
      teamFlagUrl: flagUrl,
      loading: true,
      todayDate: todayDate,
    });
    this.loadReminders();
    this.loadData();
  },

  onHide: function () {
    if (this._timer) clearInterval(this._timer);
  },

  _timer: null,

  loadData: function () {
    var that = this;
    var team = this.data.teamName;
    var followedTeams = this.data.followedTeams && this.data.followedTeams.length ? this.data.followedTeams : (team ? [team] : []);
    var today = api.getTodayBeijingDateKey();

    api.getMatches(function (err, matches) {
      if (err) {
        that.setData({ loading: false, error: "比赛数据加载失败，请稍后重试" });
        return;
      }

      // Today's matches
      var todayMatches = [];
      // My team's matches
      var myMatches = [];
      var nextMatch = null;

      for (var i = 0; i < matches.length; i++) {
        var m = api.markFavoriteMatch(api.formatMatch(matches[i], i), followedTeams);

        // Today
        if (m.beijingDate === today) {
          todayMatches.push(m);
        }

        // My team
        if (m.hasFavorite) {
          myMatches.push(m);
        }
      }

      // Sort my matches by date, find next non-finished
      myMatches.sort(function (a, b) { return a.utcDate.localeCompare(b.utcDate); });
      for (var j = 0; j < myMatches.length; j++) {
        if (myMatches[j].status !== "FINISHED") {
          nextMatch = myMatches[j];
          break;
        }
      }

      that.setData({
        myMatches: myMatches,
        todayMatches: todayMatches,
        nextMatch: nextMatch,
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
      var next = that.data.nextMatch;
      if (!next) {
        that.setData({ countdown: "" });
        return;
      }
      var diff = new Date(next.utcDate).getTime() - Date.now();
      if (diff <= 0) {
        that.setData({ countdown: "即将开始！" });
        return;
      }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      that.setData({ countdown: days + "天 " + hours + "小时 " + mins + "分钟" });
    }, 30000);
    this._timer;
  },

  // ── Reminders ──────────

  loadReminders: function () {
    var raw = wx.getStorageSync("reminders") || "[]";
    this.setData({ reminders: JSON.parse(raw) });
  },

  setReminder: function (e) {
    var m = e.currentTarget.dataset.match;
    var that = this;
    wx.showActionSheet({
      itemList: ["提前15分钟", "提前30分钟", "提前1小时"],
      success: function (res) {
        var mins = res.tapIndex === 0 ? 15 : res.tapIndex === 1 ? 30 : 60;
        var item = {
          id: m.id + "-" + mins,
          matchId: m.id,
          teamA: m.homeTeam,
          teamB: m.awayTeam,
          kickoffUtc: m.utcDate,
          minutesBefore: mins,
          label: "提前" + mins + "分钟",
        };
        reminderUtil.requestReminderSubscription(function (_, sub) {
          var reminders = reminderUtil.saveReminder(that.data.reminders, item, sub);
          wx.setStorageSync("reminders", JSON.stringify(reminders));
          that.setData({ reminders: reminders });
          wx.showToast({
            title: "已保存提醒",
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
    this.setData({ reminders: reminders });
  },

  changeTeam: function () {
    wx.reLaunch({ url: "/pages/team-select/team-select" });
  },

  goMatchDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: "/pages/match-detail/match-detail?id=" + id });
  },

  goSchedule: function () { wx.switchTab({ url: "/pages/schedule/schedule" }); },
  goStandings: function () { wx.switchTab({ url: "/pages/standings/standings" }); },
  goKnockout: function () { wx.switchTab({ url: "/pages/knockout/knockout" }); },

  onShareAppMessage: function () {
    return {
      title: "2026 世界杯赛程与提醒",
      path: "/pages/home/home",
    };
  },
});
