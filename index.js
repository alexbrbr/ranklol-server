require('dotenv').config();

const express = require('express');
const lol = require('./lol');
const dataGrouping = require('./data-grouping');

const app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Origin', 'http://ranklol.com');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/summoner/:summonerName', (req, res) => {
  const summonerName = req.params.summonerName;
  lol.getSummonerByName(summonerName)
    .then(summonerDataResponse => {
      const summonerData = summonerDataResponse.data;
      const summonerId = summonerData[summonerName.toLowerCase().replace(/ /g, '')].id;
      return lol.getRankedMatches(summonerId);
    })
    .then(matchesDataResponse => {
      const matchesData = matchesDataResponse.data.matches;
      const matchIds = matchesData.map(matchData => matchData.matchId);
      res.send({
        rolesData: dataGrouping.getRoleStats(matchesData),
        daysData: dataGrouping.getDateStats(matchesData, 'L'),
        daysOfWeekData: dataGrouping.getDateStats(matchesData, 'dddd'),
        hourData: dataGrouping.getDateStats(matchesData, 'H'),
        monthData: dataGrouping.getDateStats(matchesData, 'MMMM'),
        weekData: dataGrouping.getDateStats(matchesData, 'W'),
        championData: dataGrouping.getChampionStats(matchesData),
        matchIds
      });
    })
    .catch(err => {
      console.log(err) // eslint-disable-line
      if (err.response.status === 503) {
        res.status(503).send({
          errMessage: 'Riot server unavailable'
        });
      } else if (err.response.status === 404) {
        res.status(404).send({
          errMessage: 'Summoner unknown'
        });
      } else {
        res.status(500).send({
          errMessage: 'Unknown error from ranklol server'
        });
      }
    });
});

app.get('/api/match/:matchId', (req, res) => {
  const matchId = req.params.matchId;
  return lol.getMatch(matchId)
  .then(matchResponse => {
    res.send(dataGrouping.getMatchSummary(matchResponse.data));
  });
});
app.get('/api/champions', (req, res) => {
  dataGrouping.getChampions()
    .then(champions => res.send(champions));
});

app.listen(process.env.PORT || 4000); // eslint-disable-line
