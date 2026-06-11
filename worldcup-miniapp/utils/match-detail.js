var stageNames = {
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

function getStageLabel(match) {
  var stage = stageNames[match.stage] || match.stage || "";
  if (match.stage === "GROUP_STAGE" && match.group) {
    return stage + " " + match.group + "组";
  }
  return stage;
}
function getStageLabelEn(match) {
  var stage = stageNamesEn[match.stage] || match.stage || "";
  if (match.stage === "GROUP_STAGE" && match.group) {
    return stage + " Group " + match.group;
  }
  return stage;
}

function getStatusLabel(status) {
  if (status === "FINISHED") return "已结束";
  if (status === "IN_PLAY") return "进行中";
  if (status === "PAUSED") return "中场";
  if (status === "POSTPONED") return "延期";
  if (status === "CANCELLED") return "取消";
  return "未开始";
}
function getStatusLabelEn(status) {
  if (status === "FINISHED") return "Finished";
  if (status === "IN_PLAY") return "Live";
  if (status === "PAUSED") return "Half-time";
  if (status === "POSTPONED") return "Postponed";
  if (status === "CANCELLED") return "Cancelled";
  return "Not started";
}

function buildMatchDetail(match) {
  var homeScore = match.homeScore;
  var awayScore = match.awayScore;
  var hasScore = match.status === "FINISHED" && homeScore !== null && awayScore !== null;
  var hasWinner = hasScore && homeScore !== awayScore;

  return {
    id: match.id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeTeamEn: match.homeTeamEn || match.homeTeam,
    awayTeamEn: match.awayTeamEn || match.awayTeam,
    homeTeamFlagUrl: match.homeTeamFlagUrl || "",
    awayTeamFlagUrl: match.awayTeamFlagUrl || "",
    homeTeamGroup: match.homeTeamGroup || "",
    awayTeamGroup: match.awayTeamGroup || "",
    homeScore: homeScore,
    awayScore: awayScore,
    scoreDisplay: hasScore ? (homeScore + " - " + awayScore) : "vs",
    hasScore: hasScore,
    homeWinner: hasWinner && homeScore > awayScore,
    awayWinner: hasWinner && awayScore > homeScore,
    status: match.status,
    statusLabel: getStatusLabel(match.status),
    statusLabelEn: getStatusLabelEn(match.status),
    stage: match.stage,
    stageLabel: getStageLabel(match),
    stageLabelEn: getStageLabelEn(match),
    group: match.group || "",
    kickoff: match.kickoff,
    localTime: match.localTime || "",
    localTimeEn: match.localTimeEn || "",
    utcDate: match.utcDate,
    venue: match.venue || "",
    venueEn: match.venueEn || "",
  };
}

function findTeamInfo(name, allTeams) {
  for (var i = 0; i < allTeams.length; i++) {
    var team = allTeams[i];
    if (team.nameEn === name || team.nameZh === name) return team;
  }
  return null;
}

function buildTeamCard(name, favoriteTeam, allTeams, fallback) {
  var team = findTeamInfo(name, allTeams || []);
  return {
    name: name,
    flagUrl: (fallback && fallback.flagUrl) || (team ? team.flagUrl : ""),
    group: (fallback && fallback.group) || (team ? team.group : ""),
    isFavorite: !!favoriteTeam && (name === favoriteTeam || (team && (team.nameEn === favoriteTeam || team.nameZh === favoriteTeam))),
  };
}

function buildTeamCards(match, favoriteTeam, allTeams) {
  return {
    home: buildTeamCard(match.homeTeam, favoriteTeam, allTeams, {
      flagUrl: match.homeTeamFlagUrl,
      group: match.homeTeamGroup,
    }),
    away: buildTeamCard(match.awayTeam, favoriteTeam, allTeams, {
      flagUrl: match.awayTeamFlagUrl,
      group: match.awayTeamGroup,
    }),
  };
}

module.exports = {
  buildMatchDetail: buildMatchDetail,
  buildTeamCards: buildTeamCards,
  getStageLabel: getStageLabel,
  getStatusLabel: getStatusLabel,
  getStatusLabelEn: getStatusLabelEn,
};
