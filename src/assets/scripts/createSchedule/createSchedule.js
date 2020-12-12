import CovidAPI from '../Covid19API.js';
import Schedule from './Schedule.js';

function createSchedule(country) {
  const ctx = document.getElementById('myChart').getContext('2d');
  const selectSchedule = document.getElementById('select_schedule');
  const chart = new Schedule(ctx);
  let promiseHistory;
  if (country !== undefined) {
    promiseHistory = CovidAPI.getCountryHistory('Belarus')
      .then((database) => database)
      .catch((error) => new Error(error.message));
  } else {
    promiseHistory = CovidAPI.getWorldHistory()
      .then((database) => database)
      .catch((error) => new Error(error.message));
  }
  promiseHistory.then((res) => {
    chart.setArr = res;
    chart.drawSchedule('totalConfirmed');
  });

  function getSelectValue(value) {
    const selectScheduleValue = document.getElementById('select_schedule').value;
    if (value) chart.drawSchedule(value);
    chart.drawSchedule(selectScheduleValue.split('_')[1], selectScheduleValue.split('_')[0]);
  }
  selectSchedule.addEventListener('change', getSelectValue);
}

export default createSchedule;
