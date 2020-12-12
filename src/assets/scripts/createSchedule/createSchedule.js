import CovidAPI from '../Covid19API.js';
import Schedule from './Schedule.js';

function createSchedule() {
  const ctx = document.getElementById('myChart').getContext('2d');
  const btns = document.querySelectorAll('.btn_schedule');
  const somePromise = CovidAPI.getWorldHistory()
    .then((database) => database)
    .catch((error) => console.log(error.message));
  somePromise.then((res) => {
    const chart = new Schedule(res, ctx);
    chart.setArr = res;
    chart.drawSchedule();
    btns.forEach((el) => {
      el.addEventListener('click', () => {
        chart.drawSchedule(el.dataset.id);
      });
    });
  });
}

export default createSchedule;
