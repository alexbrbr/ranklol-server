require('dotenv').config();

const express = require('express');
const lol = require('./lol');

const app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'ranklol.com');
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
    .then(matchesDataResponse => {
      const matchesData = matchesDataResponse.data;
      res.send({
        matchesData
      });
    });
});

app.listen(process.env.PORT || 4000); // eslint-disable-line
