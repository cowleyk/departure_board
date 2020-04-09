var express = require('express');
var router = express.Router();
var axios = require('axios');
var moment = require('moment-timezone');
var formatData = require('../helpers/formatData');

router.get('/', function(req, res, next) {
  let current_time = moment().tz('America/New_York').format('HH:mm')
  let tommorrow_date = moment().add(1,'days').format('YYYY-MM-DD')

  let new_predictions = axios.get(`https://api-v3.mbta.com/predictions/?filter[stop]=place-sstat&sort=arrival_time`);
  let new_routes = axios.get(`https://api-v3.mbta.com/routes/?filter[stop]=place-sstat`);
  let new_schedule = axios.get(`https://api-v3.mbta.com/schedules/?filter[stop]=place-sstat&filter[min_time]=${current_time}&sort=departure_time`);
  let tomorrow_schedule = axios.get(`https://api-v3.mbta.com/schedules/?filter[stop]=place-sstat&filter[date]=${tommorrow_date}&sort=departure_time`);
  Promise.all([new_predictions, new_routes, new_schedule, tomorrow_schedule])
    .then((resp) => {
      let formattedData = formatData(resp[0].data.data, resp[1].data.data, resp[2].data.data, resp[3].data.data);
      res.status(200).json(formattedData);
    })
    .catch((err) => {
      console.log('ERROR', err);
      res.status(404).send(err);
    })

});

module.exports = router;
