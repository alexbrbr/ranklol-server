require('dotenv').config();

const express = require('express');
const lol = require('./lol');
const dataGrouping = require('./data-grouping');

const app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/:summonerName', (req, res) => {
  const summonerName = req.params.summonerName;
  lol.getSummonerByName(summonerName)
    .then(summonerDataResponse => {
      const summonerData = summonerDataResponse.data;
      const summonerId = summonerData[summonerName.toLowerCase().replace(/ /g, '')].id;
      return lol.getRankedMatches(summonerId);
    })
    .catch(error => res.send(error))
    .then(matchesDataResponse => {
      const matchesData = matchesDataResponse.data.matches;
      const rolesData = dataGrouping.getRoleStats(matchesData);
      const daysData = dataGrouping.getDateStats(matchesData, 'L');
      const daysOfWeekData = dataGrouping.getDateStats(matchesData, 'dddd');
      const hourData = dataGrouping.getDateStats(matchesData, 'H');
      const monthData = dataGrouping.getDateStats(matchesData, 'MMMM');
      const weekData = dataGrouping.getDateStats(matchesData, 'W');
      res.send({
        rolesData,
        daysData,
        daysOfWeekData,
        hourData,
        monthData,
        weekData
      });
    })
    .catch(error => res.send(error));
});

app.listen(process.env.PORT || 4000); // eslint-disable-line
