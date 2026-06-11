var api = require("../../utils/api.js");
var i18n = require("../../utils/i18n.js");

Page({
  data: {
    rounds: [],
    lang: "zh",
    t: i18n.getText("zh"),
    loading: true,
    error: "",
  },

  onLoad: function () {
    var lang = wx.getStorageSync("lang") || "zh";
    this.setData({ lang: lang, t: i18n.getText(lang) });
    this.loadBracket();
  },

  loadBracket: function () {
    var that = this;
    api.getMatches(function (err, matches) {
      if (err) {
        that.setData({ loading: false, error: "淘汰赛数据加载失败，请稍后重试" });
        return;
      }

      var stageMap = {
        LAST_32: "32强",
        LAST_16: "16强",
        QUARTER_FINALS: "1/4决赛",
        SEMI_FINALS: "半决赛",
        FINAL: "决赛",
        THIRD_PLACE: "季军赛",
      };
      var stageMapEn = {
        LAST_32: "Round of 32",
        LAST_16: "Round of 16",
        QUARTER_FINALS: "Quarter-finals",
        SEMI_FINALS: "Semi-finals",
        FINAL: "Final",
        THIRD_PLACE: "Third Place",
      };
      var stageOrder = ["LAST_32", "LAST_16", "QUARTER_FINALS", "SEMI_FINALS", "FINAL", "THIRD_PLACE"];

      var byStage = {};
      var favoriteTeam = wx.getStorageSync("followedTeams") || [wx.getStorageSync("favoriteTeam") || ""];
      for (var i = 0; i < matches.length; i++) {
        var m = matches[i];
        if (stageOrder.indexOf(m.stage) !== -1) {
          var s = m.stage;
          if (!byStage[s]) byStage[s] = [];
          byStage[s].push(that.decorateMatch(api.markFavoriteMatch(api.formatMatch(m, i), favoriteTeam)));
        }
      }

      var rounds = [];
      for (var j = 0; j < stageOrder.length; j++) {
        var stage = stageOrder[j];
        if (byStage[stage]) {
          rounds.push({
            name: stageMap[stage],
            nameEn: stageMapEn[stage],
            stage: stage,
            isFinal: stage === "FINAL",
            isThirdPlace: stage === "THIRD_PLACE",
            matches: byStage[stage],
          });
        }
      }

      that.setData({ rounds: rounds, loading: false, error: "" });
    });
  },

  decorateMatch: function (match) {
    var homeScore = match.homeScore;
    var awayScore = match.awayScore;
    var finished = match.status === "FINISHED";
    var hasWinner = finished && homeScore !== null && awayScore !== null && homeScore !== awayScore;

    match.homeDisplay = match.homeTeam === "TBD" ? "待定" : match.homeTeam;
    match.awayDisplay = match.awayTeam === "TBD" ? "待定" : match.awayTeam;
    match.homeDisplayEn = match.homeTeamEn === "TBD" ? "TBD" : match.homeTeamEn;
    match.awayDisplayEn = match.awayTeamEn === "TBD" ? "TBD" : match.awayTeamEn;
    match.homeWinner = hasWinner && homeScore > awayScore;
    match.awayWinner = hasWinner && awayScore > homeScore;
    match.scoreDisplay = finished ? (homeScore + " - " + awayScore) : "vs";
    match.statusLabel = finished ? "已结束" : (match.status === "IN_PLAY" ? "进行中" : "北京时间 " + match.kickoff);
    match.statusLabelEn = finished ? "FT" : (match.status === "IN_PLAY" ? "Live" : "Beijing time " + match.kickoff);
    return match;
  },

  goMatchDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: "/pages/match-detail/match-detail?id=" + id });
  },

  onShareAppMessage: function () {
    return {
      title: "2026 世界杯淘汰赛晋级图",
      path: "/pages/knockout/knockout",
    };
  },
});
