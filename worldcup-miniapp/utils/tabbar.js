var labels = {
  zh: ["首页", "赛程", "积分", "淘汰赛"],
  en: ["Home", "Schedule", "Standings", "Knockout"],
};

var titles = {
  home: { zh: "首页", en: "Home" },
  schedule: { zh: "全部赛程", en: "Schedule" },
  standings: { zh: "小组积分", en: "Standings" },
  knockout: { zh: "淘汰赛", en: "Knockout" },
  detail: { zh: "比赛详情", en: "Match Detail" },
};

function getTabBarLabels(lang) {
  return labels[lang] || labels.zh;
}

function applyLocalizedTabBar(lang) {
  if (typeof wx === "undefined" || !wx.setTabBarItem) return;
  var current = getTabBarLabels(lang);
  for (var i = 0; i < current.length; i++) {
    wx.setTabBarItem({ index: i, text: current[i] });
  }
}

function applyNavigationTitle(pageKey, lang) {
  if (typeof wx === "undefined" || !wx.setNavigationBarTitle) return;
  var title = titles[pageKey] && (titles[pageKey][lang] || titles[pageKey].zh);
  if (title) wx.setNavigationBarTitle({ title: title });
}

module.exports = {
  getTabBarLabels: getTabBarLabels,
  applyLocalizedTabBar: applyLocalizedTabBar,
  applyNavigationTitle: applyNavigationTitle,
};
