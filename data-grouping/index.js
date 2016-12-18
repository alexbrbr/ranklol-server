const moment = require('moment');
const rolesList = {
  carry: 0,
  support: 0,
  jungle: 0,
  soloMid: 0,
  soloTop: 0,
  troll: 0
};


module.exports = {
  getRoleStats: matchList => matchList.reduce((rolesStats, match) => {
    if (match.role === 'DUO_CARRY') {
      rolesStats.carry += 1;
    } else if (match.role === 'DUO_SUPPORT') {
      rolesStats.support += 1;
    } else if (match.role === 'NONE' && match.lane === 'JUNGLE') {
      rolesStats.jungle += 1;
    } else if (match.role === 'SOLO' && match.lane === 'MID') {
      rolesStats.soloMid += 1;
    } else if (match.role === 'SOLO' && match.lane === 'TOP') {
      rolesStats.soloTop += 1;
    } else {
      rolesStats.troll += 1;
    }
    return rolesList;
  }, Object.assign({}, rolesList)),

  // ex: 'dddd' for day of week
  //     'L'    for day of year
  //     'H'    for hour
  //     'MMMM' for month
  //     'W'    for week

  getDateStats: (matchList, format) => matchList.reduce((datesStats, match) => {
    const timeOfMatch = moment(match.timestamp).format(format);
    if (datesStats[timeOfMatch]) {
      datesStats[timeOfMatch] += 1;
    } else {
      datesStats[timeOfMatch] = 1;
    }
    return datesStats;
  }, {})

};
