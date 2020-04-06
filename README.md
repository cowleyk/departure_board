# South Station Departure Board
Insurify coding challenge
Kevin Cowley

Live link: http://kevin-cowley-insurify.surge.sh/

## Key Decisions
### Multiple API Calls
Being this is an external server with a set structure of returned data, I made a judgement call to hit multiple endpoints and utilize the filtering and sorting provided by MTBA API.  The filtering and sorting was useful in linking together all the different data.
The calls made could have been combined by pinging the /schedules endpoint, filtering by stop, and including the predictions.
The single-call approach limited the filtering of predictions and I could not specify multiple days for the schedule, which led to routes being omitted based on the time of day.

### Component structure
Just a simple table was needed, so I used what styling library I'm most comfortable with (Material-UI) and used a single functional component.

## Enhancements
### Remove Polling
The MTBA API V3 has a [streaming service](https://www.mbta.com/developers/v3-api/streaming).
Due to CORS issues, this is difficult to implement in a browser-only application.
Adding middleware to get around this issue would be a great next step.

### Add vehicle numbers to board
This is available with the vehicle ID that is passed as a relationship to the prediction resource.
I did not see a track # available in the API to match what is in the [example departure board](https://commons.wikimedia.org/wiki/File:North_Station_departure_board.JPG).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running Locally
1) Clone this repository
2) `npm install`
3) `npm start`
