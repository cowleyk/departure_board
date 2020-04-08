export default function formatPredictions(predictions, routes, schedules, tomorrow_schedule) {
  // pull in schedule when prediction not available
  // need to calc. time until arrival (moment? use seconds since epoch)

  let formattedRoutes = [];
  // form dict {route_id: predicted arrival_time} to track times
  let route_prediction_tracker = {};

  // loop over routes and match predicted or scheduled
  routes.forEach((route) => {
    route_prediction_tracker[route.id] = null;

    // want to return only needed data
    let newRoute = {
      id: route.id,
      fare_class: route.attributes.fare_class,
      name: route.attributes.long_name,
      arrival_time: null,
      direction: null,
      schedule: false
    }

    for(let i=predictions.length-1; i>=0; i--) {
      let pred_route_id = predictions[i].relationships.route.data.id;

      // api best practices suggest using the arrival_time for predictions
      let pred_arrive_time = predictions[i].attributes.arrival_time;
      let pred_direction_id = predictions[i].attributes.direction_id;


      // if prediction matches the route and we haven't already got the most recent prediction
      if(pred_route_id === route.id && !route_prediction_tracker[pred_route_id] && pred_arrive_time) {
        route_prediction_tracker[pred_route_id] = pred_arrive_time;
        newRoute.arrival_time = pred_arrive_time;
        // newRoute.vehicle = predictions[i].relationships.vehicle.data.id;
        if(route.attributes.direction_destinations[pred_direction_id] === 'South Station') {
          // vehicle is outbound from south station
          newRoute.direction = route.attributes.direction_destinations[0]
        } else {
          newRoute.direction = route.attributes.direction_destinations[pred_direction_id]
        }
        break;
      } else if(pred_route_id === route.id && route_prediction_tracker[pred_route_id]) {
        // break out early if prediction already found
        break;
      }
    }

    // if arrival_time is not predicted, grab upcoming time from schedule
    if(!newRoute.arrival_time) {
      for(let i=0; i<schedules.length; i++) {
        let sched_route_id = schedules[i].relationships.route.data.id;

        let sched_arrive_time = schedules[i].attributes.departure_time;
        let sched_direction_id = schedules[i].attributes.direction_id;

        if(sched_route_id === route.id && !route_prediction_tracker[sched_route_id]) {
          route_prediction_tracker[sched_route_id] = sched_arrive_time;
          newRoute.arrival_time = sched_arrive_time;
          newRoute.schedule = true;
          if(route.attributes.direction_destinations[sched_direction_id] === 'South Station') {
            // vehicle is outbound from south station
            newRoute.direction = route.attributes.direction_destinations[0]
          } else {
            newRoute.direction = route.attributes.direction_destinations[sched_direction_id]
          }
          break;
        } else if(sched_route_id === route.id) {
          // break out early if prediction already examined
          break;
        }
      }
    }

    // if arrival time is still not available, grab from tomorrow's schedule
    if(!newRoute.arrival_time) {
      for(let i=0; i<tomorrow_schedule.length; i++) {
        let sched_route_id = tomorrow_schedule[i].relationships.route.data.id;

        let sched_arrive_time = tomorrow_schedule[i].attributes.departure_time;
        let sched_direction_id = tomorrow_schedule[i].attributes.direction_id;

        if(sched_route_id === route.id && !route_prediction_tracker[sched_route_id]) {
          route_prediction_tracker[sched_route_id] = sched_arrive_time;
          newRoute.arrival_time = sched_arrive_time;
          newRoute.schedule = true;
          if(route.attributes.direction_destinations[sched_direction_id] === 'South Station') {
            // vehicle is outbound from south station
            newRoute.direction = route.attributes.direction_destinations[0]
          } else {
            newRoute.direction = route.attributes.direction_destinations[sched_direction_id]
          }
          break;
        } else if(sched_route_id === route.id) {
          // break out early if prediction already examined
          break;
        }
      }
    }
    formattedRoutes.push(newRoute)
  })
  return formattedRoutes;
}
