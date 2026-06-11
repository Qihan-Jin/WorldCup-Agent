var localSquads = require("../data/squads.js");

var positionNames = {
  GK: "门将",
  DF: "后卫",
  MF: "中场",
  FW: "前锋",
};

function groupPlayers(players) {
  var groups = [
    { key: "GK", label: "门将", players: [] },
    { key: "DF", label: "后卫", players: [] },
    { key: "MF", label: "中场", players: [] },
    { key: "FW", label: "前锋", players: [] },
  ];
  var groupMap = {};
  for (var i = 0; i < groups.length; i++) groupMap[groups[i].key] = groups[i];

  for (var j = 0; j < (players || []).length; j++) {
    var player = players[j];
    var key = player.position || "MF";
    if (!groupMap[key]) {
      groupMap[key] = { key: key, label: positionNames[key] || key, players: [] };
      groups.push(groupMap[key]);
    }
    groupMap[key].players.push(player);
  }
  return groups;
}

function buildSquad(teamNameEn, displayName, flagUrl) {
  var players = localSquads[teamNameEn] || [];
  return {
    teamName: displayName,
    flagUrl: flagUrl || "",
    hasData: players.length > 0,
    groups: groupPlayers(players),
  };
}

function buildMatchSquads(match, teamCards) {
  return {
    home: buildSquad(match.homeTeamEn, match.homeTeam, teamCards.home.flagUrl),
    away: buildSquad(match.awayTeamEn, match.awayTeam, teamCards.away.flagUrl),
  };
}

module.exports = {
  groupPlayers: groupPlayers,
  buildSquad: buildSquad,
  buildMatchSquads: buildMatchSquads,
};
