var APP_VERSION = "0.2.0";

App({
  onLaunch: function () {
    var lang = wx.getStorageSync("lang");
    var team = wx.getStorageSync("favoriteTeam");
    var followedTeams = wx.getStorageSync("followedTeams") || [];
    if (lang) this.globalData.lang = lang;
    if (team) this.globalData.favoriteTeam = team;
    if (followedTeams.length) this.globalData.followedTeams = followedTeams;
  },

  globalData: {
    lang: "zh",
    favoriteTeam: "",
    followedTeams: [],
    version: APP_VERSION,
  },
});
