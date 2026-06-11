var api = require("../../utils/api.js");
var i18n = require("../../utils/i18n.js");

Page({
  data: {
    groups: [],
    lang: "zh",
    t: i18n.getText("zh"),
    activeGroup: "A",
    favoriteGroup: "",
    activeTable: [],
    loading: true,
    error: "",
  },

  onLoad: function () {
    var lang = wx.getStorageSync("lang") || "zh";
    this.setData({ lang: lang, t: i18n.getText(lang) });
    this.loadStandings();
  },

  loadStandings: function () {
    var that = this;
    api.getStandings(function (err, groups) {
      if (err) {
        that.setData({ loading: false, error: "积分榜加载失败，请稍后重试" });
        return;
      }
      groups.sort(function (a, b) { return a.group.localeCompare(b.group); });
      var favoriteTeam = wx.getStorageSync("favoriteTeam") || "";
      var favoriteGroup = that.getFavoriteGroup(favoriteTeam);
      groups = that.markFavoriteGroups(groups, favoriteTeam, favoriteGroup);
      var activeIndex = that.findFavoriteGroupIndex(groups, favoriteTeam, favoriteGroup);
      if (activeIndex < 0) activeIndex = 0;
      that.setData({
        groups: groups,
        favoriteGroup: favoriteGroup,
        activeGroup: groups[activeIndex] ? groups[activeIndex].group : "A",
        activeTable: groups[activeIndex] ? that.markFavoriteRows(groups[activeIndex].table, favoriteTeam) : [],
        loading: false,
        error: "",
      });
    });
  },

  getFavoriteGroup: function (favoriteTeam) {
    var team = api.findTeamInfo(favoriteTeam);
    return team ? team.group : "";
  },

  markFavoriteGroups: function (groups, favoriteTeam, favoriteGroup) {
    for (var i = 0; i < groups.length; i++) {
      groups[i].hasFavorite = !!favoriteGroup && groups[i].group === favoriteGroup;
      var table = groups[i].table || [];
      for (var j = 0; j < table.length; j++) {
        if (api.isFavoriteTeamName(table[j].team.name, favoriteTeam)) {
          groups[i].hasFavorite = true;
          break;
        }
      }
    }
    return groups;
  },

  findFavoriteGroupIndex: function (groups, favoriteTeam, favoriteGroup) {
    for (var i = 0; i < groups.length; i++) {
      if (favoriteGroup && groups[i].group === favoriteGroup) return i;
      var table = groups[i].table || [];
      for (var j = 0; j < table.length; j++) {
        if (api.isFavoriteTeamName(table[j].team.name, favoriteTeam)) return i;
      }
    }
    return -1;
  },

  markFavoriteRows: function (table, favoriteTeam) {
    var favoriteInfo = api.findTeamInfo(favoriteTeam);
    for (var i = 0; i < table.length; i++) {
      var name = table[i].team.name || table[i].team.shortName || table[i].team.tla || "";
      table[i].isFavorite =
        api.isFavoriteTeamName(name, favoriteTeam) ||
        !!(favoriteInfo && (
          name === favoriteInfo.nameZh ||
          name === favoriteInfo.nameEn ||
          table[i].team.shortName === favoriteInfo.nameZh ||
          table[i].team.shortName === favoriteInfo.nameEn
        ));
    }
    return table;
  },

  switchGroup: function (e) {
    var group = e.currentTarget.dataset.group;
    var table = [];
    for (var i = 0; i < this.data.groups.length; i++) {
      if (this.data.groups[i].group === group) {
        table = this.markFavoriteRows(this.data.groups[i].table, wx.getStorageSync("favoriteTeam") || "");
        break;
      }
    }
    this.setData({ activeGroup: group, activeTable: table });
  },
});
