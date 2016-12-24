const axios = require('axios');
const apiKey = process.env.RIOT_KEY; //eslint-disable-line
const apiSuffixes = require('./api-suffixes');

const RateLimiter = require('limiter').RateLimiter;
const limiter10s = new RateLimiter(10, 10 * 1000);
const limiter10min = new RateLimiter(500, 10 * 60 * 1000);


const region = 'euw';
const apiBasis = `https://${region}.api.pvp.net/api/lol/${region}/`;
const apiStaticBasis = `https://global.api.pvp.net/api/lol/static-data/${region}/`;
const staticVersions = 'https://ddragon.leagueoflegends.com/api/versions.json';

function callRiotAPI(url) {
  return new Promise((resolve, reject) => {
    limiter10s.removeTokens(1, function (err10s) {
      if (err10s) {
        reject(err10s);
      }
      limiter10min.removeTokens(1, function (err10min) {
        if (err10min) {
          reject(err10min);
        }
        resolve(axios.get(url));
      });
    });
  });
}

module.exports = {
  getSummonerByName(summonerName) {
    const url = `${apiBasis}${apiSuffixes.summonerByName}${summonerName}?api_key=${apiKey}`;
    return callRiotAPI(url);
  },
  getRankedMatches(summonerId) {
    const queryParams = 'rankedQueues=RANKED_FLEX_SR&seasons=SEASON2016&';
    const url = `${apiBasis}${apiSuffixes.matchListBySummoner}${summonerId}?${queryParams}api_key=${apiKey}`;
    return callRiotAPI(url);
  },
  getChampionsListImage() {
    const url = `${apiStaticBasis}${apiSuffixes.staticChampions}?champData=image&api_key=${apiKey}`;
    return callRiotAPI(url);
  },
  getStaticVersion() {
    const url = `${staticVersions}`;
    return callRiotAPI(url);
  },
  getMatch(matchId) {
    const url = `${apiBasis}${apiSuffixes.match}${matchId}?api_key=${apiKey}`;
    return callRiotAPI(url);
  }
};
