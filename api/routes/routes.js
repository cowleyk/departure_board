var express = require('express');
var router = express.Router();
var axios = require('axios');
var formatData = require('../helpers/formatData');

router.get('/', function(req, res, next) {
  axios.get('https://api-v3.mbta.com/routes/?filter[stop]=place-sstat')
    .then((routes) => {
      console.log('')
      console.log('routes')
      console.log(routes.data.data)
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
