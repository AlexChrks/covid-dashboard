import CovidAPI from '../Covid19API.js';
import Schedule from './Schedule.js';

/* function createSchedule(country, percent = false) {
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
    chart.drawSchedule('totalConfirmed', 'cumulative');
  });

  function getSelectValue(value) {
    const selectScheduleValue = document.getElementById('select_schedule').value;
    if (value) chart.drawSchedule(value);
    chart.drawSchedule(selectScheduleValue.split('_')[1],
      selectScheduleValue.split('_')[0],
      selectScheduleValue.split('_')[2]);
  }
  selectSchedule.addEventListener('change', getSelectValue);
} */

class Dashboard {
  constructor(ctx) {
    this.chart = new Schedule(ctx);
  }

  createSchedule(country, option, percent) {
    this.chart.createSchedule(country, option, percent);
  }
  /*
  createSchedule(country, option = 'cumulative_totalConfirmed', percent = false) {
    const selectSchedule = document.getElementById('select_schedule');
    setTimeout(() => {
      selectSchedule.value = option;
    }, 300);
    if (country !== undefined) {
      this.promiseHistory = CovidAPI.getCountryHistory(country)
        .then((database) => database)
        .catch((error) => new Error(error.message));
    } else if (!country && !percent) {
      this.promiseHistory = CovidAPI.getWorldHistory()
        .then((database) => database)
        .catch((error) => new Error(error.message));
    }
    this.promiseHistory.then((res) => {
      this.chart.setArr = res;
      this.chart.drawSchedule(option.split('_')[1], option.split('_')[0]);
    });
    this.handleEvent = (e) => {
      if (e.type === 'change') {
        const selectScheduleValue = selectSchedule.value;
        this.chart.drawSchedule(selectScheduleValue.split('_')[1],
          selectScheduleValue.split('_')[0],
          selectScheduleValue.split('_')[2]);
      }
    };
    selectSchedule.removeEventListener('change', this, false);
    selectSchedule.addEventListener('change', this, false);
  }
} */
}

export default Dashboard;
