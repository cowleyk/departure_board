var express = require('express');
var router = express.Router();
var axios = require('axios');
var formatData = require('../helpers/formatData');

router.get('/', function(req, res, next) {
  axios.get('https://api-v3.mbta.com/predictions/?filter[stop]=place-sstat&sort=arrival_time')
    .then((predictions) => {
      console.log('')
      console.log('predictions')
      console.log(predictions.data.data)
      let formattedRoutes = formatData(predictions.data.data);
      res.send(formattedRoutes)
    })
    .catch((err) => {
      console.log('ERROR predictions')
      console.log(err)
      res.status(404)
      res.send('error fetching predictions')
    })

});

module.exports = router;
