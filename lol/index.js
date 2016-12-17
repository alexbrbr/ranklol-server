const axios = require('axios');
const apiKey = process.env.RIOT_KEY;
const apiSuffixes = require('./api-suffixes');

const region = 'euw';
const apiBasis = `https://${region}.api.pvp.net/api/lol/${region}/`;
module.exports = {
  getSummonerByName(summonerName) {
    const url = `${apiBasis}${apiSuffixes.summonerByName}${summonerName}?api_key=${apiKey}`;
    return axios.get(url);
  },
  getRankedMatches(summonerId) {
    const queryParams = 'rankedQueues=RANKED_FLEX_SR&seasons=SEASON2016&';
    const url = `${apiBasis}${apiSuffixes.matchListBySummoner}${summonerId}?${queryParams}api_key=${apiKey}`;
    return axios.get(url);
  }
};
