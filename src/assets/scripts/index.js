import '../styles/reset.css';
import '../styles/style.css';
import Dashboard from './createSchedule/createSchedule.js';

const imagesContext = require.context('../images', true, /.(png|svg)$/);
const imagesObj = {};
imagesContext.keys().forEach((key) => {
  const code = key.split('./').pop()
    .substring(0, key.length - 6);
  imagesObj[code] = imagesContext(key);
});

function createDashboard() {
  const ctx = document.getElementById('myChart').getContext('2d');
  const dashboard = new Dashboard(ctx);
  dashboard.createSchedule();
  document.querySelector('.map_widget').addEventListener('click', () => {
    dashboard.createSchedule('Belarus', 'daily_totalDeaths');
  });
  document.querySelector('.countries_widget').addEventListener('click', () => {
    dashboard.createSchedule('world', 'cumulative_totalRecovered');
  });
}

createDashboard();

export default imagesObj;
