const moment = require('moment');
const rolesList = {
  'AD Carry': 0,
  Support: 0,
  Jungle: 0,
  'Mid Lane': 0,
  'Top Lane': 0,
  Unknown: 0
};

const lol = require('../lol');
const staticUrlBasis = 'http://ddragon.leagueoflegends.com/cdn/';

let champions = null;
let staticVersion;


function getChampionNameById(championId) {
  return getChampions()
    .then(champions => champions
      .find(champion => champion.id === championId).name
    );
}

function getChampions() {
  return champions ?
    Promise.resolve(champions) :
    lol.getStaticVersion()
    .then(staticVersionData => {
      staticVersion = staticVersionData.data[0];
      return lol.getChampionsListImage();
    })
    .then(championsResponse => {
      const championsData = championsResponse.data.data;
      champions = Object
        .keys(championsData)
        .map(championName => ({
          id: championsData[championName].id,
          name: championsData[championName].name,
          image: `${staticUrlBasis}${staticVersion}/img/champion/${championsData[championName].image.full}`
        }));
      return champions;
    })
}
getChampions();

module.exports = {
  getRoleStats: matchList => matchList.reduce((rolesStats, match) => {
    if (match.role === 'DUO_CARRY') {
      rolesStats['AD Carry'] += 1;
    } else if (match.role === 'DUO_SUPPORT') {
      rolesStats.Support += 1;
    } else if (match.role === 'NONE' && match.lane === 'JUNGLE') {
      rolesStats.Jungle += 1;
    } else if (match.role === 'SOLO' && match.lane === 'MID') {
      rolesStats['Mid Lane'] += 1;
    } else if (match.role === 'SOLO' && match.lane === 'TOP') {
      rolesStats['Top Lane'] += 1;
    } else {
      rolesStats.Unknown += 1;
    }
    return rolesStats;
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
  }, {}),

  getChampionStats: matchList => matchList.reduce((championsStats, match) => {
    const championInMatch = getChampionNameById(match.champion);
    if (championsStats[championInMatch]) {
      championsStats[championInMatch] += 1;
    } else {
      championsStats[championInMatch] = 1;
    }
    return championsStats;
  }, {}),

  getMatchSummary: match => match.participants.map(participant => {
    return {
      championId: participant.championId,
      winner: participant.stats.winner,
      summonerName: match.participantIdentities
        .find(participantIdentity => participantIdentity.participantId === participant.participantId)
        .player.summonerName,
      role: participant.timeline.role,
      lane: participant.timeline.lane
    };
  }),

  getChampions
};
