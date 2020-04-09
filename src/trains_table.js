import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import axios from 'axios';
import moment from 'moment-timezone';
import formatPredictions from './utils/helpers'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ControlledExpansionPanels() {
  const classes = useStyles();
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchData();

    // set up polling of MTBA API every 15 seconds (gives buffer room for 20 calls/minute)
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    let current_time = moment().tz('America/New_York').format('HH:mm')
    let tommorrow_date = moment().add(1,'days').format('YYYY-MM-DD')

    // it is possible to use the `include` parameter to get all of this data from one api call
    // however, the include limits to data filtering and is even messier than it already is to format
    let new_predictions = axios.get(`https://api-v3.mbta.com/predictions/?filter[stop]=place-sstat&sort=arrival_time`);
    let new_routes = axios.get(`https://api-v3.mbta.com/routes/?filter[stop]=place-sstat`);
    let new_schedule = axios.get(`https://api-v3.mbta.com/schedules/?filter[stop]=place-sstat&filter[min_time]=${current_time}&sort=departure_time`);
    let tomorrow_schedule = axios.get(`https://api-v3.mbta.com/schedules/?filter[stop]=place-sstat&filter[date]=${tommorrow_date}&sort=departure_time`);
    Promise.all([new_predictions, new_routes, new_schedule, tomorrow_schedule])
      .then((resp) => {
        console.log('resp', resp);
        let formattedRoutes = formatPredictions(resp[0].data.data, resp[1].data.data, resp[2].data.data, resp[3].data.data);
        setRoutes(formattedRoutes);
      })
      .catch((err) => {
        console.log('ERROR', err)
      })
  }

  const determineStatus = (route) => {
    let current_time = moment().tz('America/New_York')
    let arrival_time = moment(route.arrival_time)
    let diff = arrival_time.diff(current_time, 'seconds')
    if(route.schedule) {
      return 'On Time';
    } else if(diff <= 30) {
      return 'Arriving';
    } else if(diff <= 60) {
      return 'Approaching';
    } else {
      return `${arrival_time.diff(current_time, 'minutes')} minute${diff < 90 ? '' : 's'} away`;
    }
  };

  // TODO:
  // order by closest?
  // let newRoute = {
  //   id: route.id,
  //   fare_class: route.attributes.fare_class,
  //   name: route.attributes.long_name,
  //   arrival_time: null,
  //   direction: null,
  //   schedule: false
  // }

  return (

    <TableContainer component={Paper}>
      <h1>South Station</h1>
      <h3>Current Time: <p>{moment().format('LT')}</p></h3>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Route</TableCell>
            <TableCell align="right">Destination</TableCell>
            <TableCell align="right">Arrival Time</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Fare Class</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.id}>
              <TableCell component="th" scope="row">
                {route.name}
              </TableCell>
              <TableCell align="right">{route.direction}</TableCell>
              <TableCell align="right">{moment(route.arrival_time).format('LT')}</TableCell>
              <TableCell align="right">{determineStatus(route)}</TableCell>
              <TableCell align="right">{route.fare_class}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
