function utc(localDate, localTime, offsetHours) {
  var parts = localDate.split("-").map(Number);
  var time = localTime.split(":").map(Number);
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], time[0] - offsetHours, time[1])).toISOString();
}

function match(id, stage, localDate, localTime, offsetHours, home, away, group) {
  return {
    id: id,
    homeTeam: { name: home, shortName: home },
    awayTeam: { name: away, shortName: away },
    score: { fullTime: { home: null, away: null } },
    status: "SCHEDULED",
    stage: stage,
    group: group ? "GROUP_" + group : null,
    utcDate: utc(localDate, localTime, offsetHours),
  };
}

var matches = [
  match(1, "GROUP_STAGE", "2026-06-11", "13:00", -6, "Mexico", "South Africa", "A"),
  match(2, "GROUP_STAGE", "2026-06-11", "20:00", -6, "Korea Republic", "Czechia", "A"),
  match(3, "GROUP_STAGE", "2026-06-12", "15:00", -4, "Canada", "Bosnia-Herzegovina", "B"),
  match(4, "GROUP_STAGE", "2026-06-12", "20:00", -7, "Qatar", "Switzerland", "B"),
  match(5, "GROUP_STAGE", "2026-06-13", "12:00", -4, "Brazil", "Morocco", "C"),
  match(6, "GROUP_STAGE", "2026-06-13", "18:00", -4, "Haiti", "Scotland", "C"),
  match(7, "GROUP_STAGE", "2026-06-13", "14:00", -7, "USA", "Paraguay", "D"),
  match(8, "GROUP_STAGE", "2026-06-13", "21:00", -7, "Australia", "Turkiye", "D"),
  match(9, "GROUP_STAGE", "2026-06-14", "12:00", -5, "Curacao", "Germany", "E"),
  match(10, "GROUP_STAGE", "2026-06-14", "15:00", -4, "Cote d'Ivoire", "Ecuador", "E"),
  match(11, "GROUP_STAGE", "2026-06-14", "13:00", -6, "Netherlands", "Japan", "F"),
  match(12, "GROUP_STAGE", "2026-06-14", "18:00", -5, "Tunisia", "Sweden", "F"),
  match(13, "GROUP_STAGE", "2026-06-15", "12:00", -4, "Belgium", "Egypt", "G"),
  match(14, "GROUP_STAGE", "2026-06-15", "15:00", -4, "IR Iran", "New Zealand", "G"),
  match(15, "GROUP_STAGE", "2026-06-15", "15:00", -5, "Spain", "Cabo Verde", "H"),
  match(16, "GROUP_STAGE", "2026-06-15", "18:00", -5, "Saudi Arabia", "Uruguay", "H"),
  match(17, "GROUP_STAGE", "2026-06-16", "12:00", -4, "France", "Senegal", "I"),
  match(18, "GROUP_STAGE", "2026-06-16", "15:00", -4, "Norway", "Iraq", "I"),
  match(19, "GROUP_STAGE", "2026-06-16", "15:00", -5, "Argentina", "Algeria", "J"),
  match(20, "GROUP_STAGE", "2026-06-16", "18:00", -5, "Austria", "Jordan", "J"),
  match(21, "GROUP_STAGE", "2026-06-17", "12:00", -4, "Portugal", "Uzbekistan", "K"),
  match(22, "GROUP_STAGE", "2026-06-17", "15:00", -5, "Colombia", "Congo DR", "K"),
  match(23, "GROUP_STAGE", "2026-06-17", "16:00", -5, "England", "Croatia", "L"),
  match(24, "GROUP_STAGE", "2026-06-17", "18:00", -7, "Ghana", "Panama", "L"),
  match(25, "GROUP_STAGE", "2026-06-18", "19:00", -6, "Mexico", "Korea Republic", "A"),
  match(26, "GROUP_STAGE", "2026-06-18", "15:00", -4, "Canada", "Qatar", "B"),
  match(27, "GROUP_STAGE", "2026-06-19", "18:00", -4, "Brazil", "Haiti", "C"),
  match(28, "GROUP_STAGE", "2026-06-19", "15:00", -7, "USA", "Australia", "D"),
  match(73, "LAST_32", "2026-06-28", "15:00", -7, "Group A runners-up", "Group B runners-up"),
  match(89, "LAST_16", "2026-07-04", "15:00", -4, "Winner Match 74", "Winner Match 73"),
  match(97, "QUARTER_FINALS", "2026-07-09", "15:00", -4, "Winner Match 89", "Winner Match 90"),
  match(101, "SEMI_FINALS", "2026-07-14", "20:00", -4, "Winner Match 97", "Winner Match 98"),
  match(103, "THIRD_PLACE", "2026-07-18", "17:00", -4, "Loser Match 101", "Loser Match 102"),
  match(104, "FINAL", "2026-07-19", "15:00", -4, "Winner Match 101", "Winner Match 102"),
];

module.exports = { matches: matches };
