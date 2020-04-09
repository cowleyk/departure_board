# South Station Departure Board
Insurify coding challenge
Kevin Cowley

Live link: http://kevin-cowley-insurify.surge.sh/

## Key Decision
### Number of API Calls vs. data management
Being this is an external server with a set structure of returned data, I made a judgement call to hit multiple endpoints and utilize the filtering and sorting provided by MTBA API.  The filtering and sorting was useful in linking together all the different data.
The calls made could have been combined by pinging the /schedules endpoint, filtering by stop, and including the predictions.
The single-call approach limited the filtering of predictions and I could not specify multiple days for the schedule, which led to routes being omitted based on the time of day.
I could have gone even further and made multiple API calls per route.  The major draw back to this would be querying the /routes endpoint first, then having to wait for a second round of API calls to the /predictions and /schedules endpoints filtering by each of the routes.
I ultimately decided on the middle ground and by filtering through the predictions first I could ignore the /schedules data for many routes.

### Component structure
Just a simple table was needed, so I used what styling library I'm most comfortable with (Material-UI) and used a single functional component.

## Enhancements
### Remove Polling
The MTBA API V3 has a [streaming service](https://www.mbta.com/developers/v3-api/streaming).
Due to CORS issues, this is difficult to implement in a browser-only application.
Adding a proxy/middleware to get around this issue (especially in development) would be a great next step.  NPM's `http-proxy-middleware` seems like a great library for this.

### Split routes to separate inbound/outbound row in table
Red Line is the only route that treats the South Station as a middle stop.  All other routes are only outbound from the South Station.  It would be good to have an Ashmont/Braintree row and an Alewife row to show predictions.

### Add vehicle numbers to board
This is available with the vehicle ID that is passed as a relationship to the prediction resource.
I did not see a track # available in the API to match what is in the [example departure board](https://commons.wikimedia.org/wiki/File:North_Station_departure_board.JPG).

### Implementing a database
This would be useful in storing routes, and allow for fewer/less frequent API calls.
The routes and schedules could be stored, and updated periodically, and only the /predictions route would need to be polled (or ideally, updated with the streaming service)

## Running UI-Only App Locally
1) Clone this repository
2) `git checkout ui-surge`
3) `npm install`
4) `npm start`
5) open localhost:3000 in the browser

## Running UI and Express server inside a single docker container
1) `docker pull kcowley/departure_board_insurify`
2) `docker run -p <preffered port to run on>:3001 kcowley/departure_board_insurify`
3) open localhost:<port> in the browser
