var i18n = require("../../utils/i18n.js");
var teams = require("../../data/teams.js");

function markSelected(list, selectedTeam) {
  return list.map(function (team) {
    var item = {};
    for (var key in team) item[key] = team[key];
    item.selected = team.nameEn === selectedTeam;
    return item;
  });
}

Page({
  data: {
    lang: "zh",
    t: i18n.getText("zh"),
    searchText: "",
    selectedTeam: "",
    filteredTeams: markSelected(teams.allTeams, ""),
  },

  onLoad: function () {
    var app = getApp();
    var lang = app.globalData.lang || "zh";
    this.setData({
      lang: lang,
      t: i18n.getText(lang),
      selectedTeam: "",
      filteredTeams: markSelected(teams.allTeams, ""),
    });
  },

  onSearch: function (e) {
    var searchText = e.detail.value.toLowerCase();
    var filteredTeams;
    if (searchText) {
      filteredTeams = teams.allTeams.filter(function (team) {
        return (
          team.nameEn.toLowerCase().indexOf(searchText) !== -1 ||
          team.nameZh.indexOf(searchText) !== -1
        );
      });
    } else {
      filteredTeams = teams.allTeams;
    }
    this.setData({
      searchText: searchText,
      filteredTeams: markSelected(filteredTeams, this.data.selectedTeam),
    });
  },

  selectTeam: function (e) {
    var team = e.currentTarget.dataset.team;
    this.setData({
      selectedTeam: team,
      filteredTeams: markSelected(this.data.filteredTeams, team),
    });
  },

  confirmTeam: function () {
    var selectedTeam = this.data.selectedTeam;
    if (!selectedTeam) return;
    var selectedTeams = [selectedTeam];

    var app = getApp();
    app.globalData.favoriteTeam = selectedTeam;
    app.globalData.followedTeams = selectedTeams;
    wx.setStorageSync("favoriteTeam", selectedTeam);
    wx.setStorageSync("followedTeams", selectedTeams);

    var lang = this.data.lang;
    wx.showToast({
      title: lang === "zh" ? "已选择" : "Selected",
      icon: "success",
      duration: 1000,
    });

    var that = this;
    setTimeout(function () {
      wx.reLaunch({ url: "/pages/home/home" });
    }, 800);
  },
});
