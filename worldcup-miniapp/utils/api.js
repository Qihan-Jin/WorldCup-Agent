var apiConfig = require("./api-config.js");

var API_BASE = apiConfig.apiBase || "https://api.football-data.org/v4";
var API_KEY = apiConfig.footballDataApiKey || "";
var CACHE_KEY_MATCHES = "wc_matches";
var CACHE_KEY_STANDINGS = "wc_standings";
var CACHE_TTL = 5 * 60 * 1000;

var venues = require("../data/venues.js");
var teams = require("../data/teams.js");

function getCached(key) {
  try {
    var raw = wx.getStorageSync(key);
    if (!raw) return null;
    var cached = JSON.parse(raw);
    if (Date.now() - cached.time > CACHE_TTL) return null;
    return cached.data;
  } catch (_) {
    return null;
  }
}

function setCache(key, data) {
  wx.setStorageSync(key, JSON.stringify({ data: data, time: Date.now() }));
}

function fetchApi(path, cb) {
  if (!API_KEY) {
    cb(new Error("football-data.org API key is not configured"));
    return;
  }
  wx.request({
    url: API_BASE + "/" + path,
    method: "GET",
    header: { "X-Auth-Token": API_KEY },
    success: function (res) {
      if (res.statusCode === 200) cb(null, res.data);
      else cb(new Error("API " + res.statusCode));
    },
    fail: function (err) {
      cb(new Error(err.errMsg || "Network error"));
    },
  });
}

function getMatches(cb) {
  var cached = getCached(CACHE_KEY_MATCHES);
  if (cached) { cb(null, cached); return; }
  fetchApi("competitions/WC/matches", function (err, data) {
    if (err) { cb(err); return; }
    var matches = data.matches || [];
    setCache(CACHE_KEY_MATCHES, matches);
    cb(null, matches);
  });
}

function getStandings(cb) {
  var cached = getCached(CACHE_KEY_STANDINGS);
  if (cached) { cb(null, cached); return; }
  fetchApi("competitions/WC/standings", function (err, data) {
    if (err) { cb(err); return; }
    var groups = [];
    var standings = data.standings || [];
    for (var i = 0; i < standings.length; i++) {
      var s = standings[i];
      if (s.group) {
        groups.push({
          group: s.group.replace("GROUP_", ""),
          table: localizeStandingTable(s.table || []),
        });
      }
    }
    setCache(CACHE_KEY_STANDINGS, groups);
    cb(null, groups);
  });
}

function localizeStandingTable(table) {
  var rows = [];
  for (var i = 0; i < table.length; i++) {
    var row = table[i];
    var info = row.team ? findTeamInfo(row.team.name || row.team.shortName) : null;
    var newRow = {};
    for (var key in row) newRow[key] = row[key];
    newRow.team = {};
    for (var teamKey in row.team) newRow.team[teamKey] = row.team[teamKey];
    if (info) {
      newRow.team.nameEn = info.nameEn;
      newRow.team.name = info.nameZh;
      newRow.team.shortName = info.nameZh;
      newRow.team.crest = info.flagUrl || newRow.team.crest;
    }
    rows.push(newRow);
  }
  return rows;
}

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function getBeijingDate(utcDate) {
  return new Date(new Date(utcDate).getTime() + 8 * 60 * 60 * 1000);
}

function getBeijingDateKey(utcDate) {
  var d = getBeijingDate(utcDate);
  return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
}

function getTodayBeijingDateKey() {
  return getBeijingDateKey(new Date().toISOString());
}

function formatBeijingMonthDay(utcDate) {
  var d = getBeijingDate(utcDate);
  return (d.getUTCMonth() + 1) + "月" + d.getUTCDate() + "日";
}

function formatMatchTime(utcDate) {
  var d = getBeijingDate(utcDate);
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  return pad(d.getUTCMonth() + 1) + "/" + pad(d.getUTCDate()) + " " +
         pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes());
}

function getVenueOffsetHours(venue) {
  if (!venue) return -5;
  if (venue.indexOf("温哥华") !== -1 || venue.indexOf("西雅图") !== -1 ||
      venue.indexOf("洛杉矶") !== -1 || venue.indexOf("旧金山") !== -1) return -7;
  if (venue.indexOf("多伦多") !== -1 || venue.indexOf("波士顿") !== -1 ||
      venue.indexOf("费城") !== -1 || venue.indexOf("大都会") !== -1 ||
      venue.indexOf("迈阿密") !== -1 || venue.indexOf("亚特兰大") !== -1) return -4;
  if (venue.indexOf("达拉斯") !== -1 || venue.indexOf("休斯顿") !== -1 ||
      venue.indexOf("堪萨斯城") !== -1 || venue.indexOf("墨西哥城") !== -1 ||
      venue.indexOf("瓜达拉哈拉") !== -1 || venue.indexOf("蒙特雷") !== -1) return -5;
  return -5;
}

function formatOffsetTime(utcDate, offsetHours) {
  var d = new Date(new Date(utcDate).getTime() + offsetHours * 60 * 60 * 1000);
  return pad(d.getUTCMonth() + 1) + "/" + pad(d.getUTCDate()) + " " +
         pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes());
}

function formatLocalTime(utcDate, venue) {
  return "当地时间 " + formatOffsetTime(utcDate, getVenueOffsetHours(venue));
}

function normalizeTeamName(name) {
  return (name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
}

var teamAliases = {
  bosniaherzegovina: "bosniaandherzegovina",
  bosniaandherzegovina: "bosniaandherzegovina",
  unitedstates: "usa",
  unitedstatesofamerica: "usa",
  usmnt: "usa",
  iran: "iriran",
  korea: "korearepublic",
  southkorea: "korearepublic",
  ivorycoast: "cotedivoire",
  czechrepublic: "czechia",
  turkey: "turkiye",
};

var stageNamesZh = {
  GROUP_STAGE: "小组赛",
  LAST_32: "32强",
  LAST_16: "16强",
  QUARTER_FINALS: "1/4决赛",
  SEMI_FINALS: "半决赛",
  THIRD_PLACE: "季军赛",
  FINAL: "决赛",
};

var stageNamesEn = {
  GROUP_STAGE: "Group Stage",
  LAST_32: "Round of 32",
  LAST_16: "Round of 16",
  QUARTER_FINALS: "Quarter-finals",
  SEMI_FINALS: "Semi-finals",
  THIRD_PLACE: "Third Place",
  FINAL: "Final",
};

function findTeamInfo(name) {
  var key = normalizeTeamName(name);
  var aliasKey = teamAliases[key] || key;
  for (var i = 0; i < teams.allTeams.length; i++) {
    var team = teams.allTeams[i];
    var enKey = normalizeTeamName(team.nameEn);
    var zhKey = normalizeTeamName(team.nameZh);
    if (enKey === aliasKey || zhKey === aliasKey) return team;
  }
  return null;
}

function getApiTeamName(team) {
  return (team && (team.name || team.shortName)) || "TBD";
}

function formatTeam(team) {
  var name = getApiTeamName(team);
  var info = findTeamInfo(name);
  return {
    name: info ? info.nameZh : name,
    nameEn: name,
    flagUrl: info ? info.flagUrl : "",
    group: info ? info.group : "",
  };
}

function formatMatch(m, index) {
  var home = formatTeam(m.homeTeam);
  var away = formatTeam(m.awayTeam);
  var venue = venues.getVenue(index);
  return {
    id: m.id,
    homeTeam: home.name,
    awayTeam: away.name,
    homeTeamEn: home.nameEn,
    awayTeamEn: away.nameEn,
    homeTeamFlagUrl: home.flagUrl,
    awayTeamFlagUrl: away.flagUrl,
    homeTeamGroup: home.group,
    awayTeamGroup: away.group,
    homeScore: m.score && m.score.fullTime ? m.score.fullTime.home : null,
    awayScore: m.score && m.score.fullTime ? m.score.fullTime.away : null,
    status: m.status,
    stage: m.stage,
    stageLabelZh: stageNamesZh[m.stage] || m.stage,
    stageLabelEn: stageNamesEn[m.stage] || m.stage,
    group: m.group ? m.group.replace("GROUP_", "") : null,
    kickoff: formatMatchTime(m.utcDate),
    beijingDate: getBeijingDateKey(m.utcDate),
    localTime: formatLocalTime(m.utcDate, venue),
    utcDate: m.utcDate,
    venue: venue,
  };
}

function isFavoriteTeamName(matchName, favorite) {
  if (!favorite) return false;
  if (matchName === favorite) return true;
  var favoriteInfo = findTeamInfo(favorite);
  var matchInfo = findTeamInfo(matchName);
  if (favoriteInfo && matchInfo) return favoriteInfo.nameEn === matchInfo.nameEn;

  var fav = normalizeTeamName(favorite);
  var match = normalizeTeamName(matchName);
  if (!fav || !match) return false;
  return (teamAliases[fav] || fav) === (teamAliases[match] || match);
}

function markFavoriteMatch(match, favorite) {
  var teams = Array.isArray(favorite) ? favorite : [favorite];
  var homeFavorite = false;
  var awayFavorite = false;
  for (var i = 0; i < teams.length; i++) {
    homeFavorite = homeFavorite || isFavoriteTeamName(match.homeTeam, teams[i]) || isFavoriteTeamName(match.homeTeamEn, teams[i]);
    awayFavorite = awayFavorite || isFavoriteTeamName(match.awayTeam, teams[i]) || isFavoriteTeamName(match.awayTeamEn, teams[i]);
  }
  match.homeFavorite = homeFavorite;
  match.awayFavorite = awayFavorite;
  match.hasFavorite = homeFavorite || awayFavorite;
  return match;
}

function matchTeamName(m, team) {
  var t = normalizeTeamName(team);
  var aliasT = teamAliases[t] || t;
  var h = normalizeTeamName((m.homeTeam && m.homeTeam.name) || "");
  var hs = normalizeTeamName((m.homeTeam && m.homeTeam.shortName) || "");
  var a = normalizeTeamName((m.awayTeam && m.awayTeam.name) || "");
  var as = normalizeTeamName((m.awayTeam && m.awayTeam.shortName) || "");
  return h === aliasT || hs === aliasT || a === aliasT || as === aliasT;
}

module.exports = {
  getMatches: getMatches,
  getStandings: getStandings,
  formatMatch: formatMatch,
  formatMatchTime: formatMatchTime,
  formatLocalTime: formatLocalTime,
  findTeamInfo: findTeamInfo,
  isFavoriteTeamName: isFavoriteTeamName,
  markFavoriteMatch: markFavoriteMatch,
  getBeijingDateKey: getBeijingDateKey,
  getTodayBeijingDateKey: getTodayBeijingDateKey,
  formatBeijingMonthDay: formatBeijingMonthDay,
  matchTeamName: matchTeamName,
};
