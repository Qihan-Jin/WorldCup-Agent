function uniqueTeams(teams) {
  var seen = {};
  var result = [];
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    if (team && !seen[team]) {
      seen[team] = true;
      result.push(team);
    }
  }
  return result;
}

function toggleTeam(teams, team) {
  var list = uniqueTeams(teams || []);
  var index = list.indexOf(team);
  if (index === -1) {
    list.push(team);
  } else {
    list.splice(index, 1);
  }
  return list;
}

function primaryTeam(teams) {
  return teams && teams.length ? teams[0] : "";
}

function upsertReminder(reminders, item) {
  var list = (reminders || []).filter(function (r) { return r.id !== item.id; });
  list.push(item);
  return list;
}

module.exports = {
  uniqueTeams: uniqueTeams,
  toggleTeam: toggleTeam,
  primaryTeam: primaryTeam,
  upsertReminder: upsertReminder,
};
