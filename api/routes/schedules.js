var express = require('express');
var router = express.Router();
var axios = require('axios');
var formatData = require('../helpers/formatData');

router.get('/:hour/:minute', function(req, res, next) {
  // need current_time
  let current_time = `${req.params.hour}:${req.params.minute}`
  console.log('')
  console.log('current_time')
  console.log(current_time)
  axios.get(`https://api-v3.mbta.com/schedules/?filter[stop]=place-sstat&filter[min_time]=${current_time}&sort=departure_time`)
    .then((routes) => {
      console.log('')
      console.log('routes')
      // console.log(routes.data.data)
      let formattedRoutes = formatData(routes.data.data);
      res.send(formattedRoutes)
    })
    .catch((err) => {
      console.log('ERROR routes')
      console.log(err)
      res.status(404)
      res.send('error fetching routes')
    })

});

module.exports = router;
