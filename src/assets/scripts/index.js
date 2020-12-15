import '../styles/reset.css';
import '../styles/style.css';
import App from './App.js';
import Covid19API from './Covid19API.js';

const imagesContext = require.context('../images', true, /.(png|svg)$/);
const imagesObj = {};
imagesContext.keys().forEach((key) => {
  const code = key.split('./').pop()
    .substring(0, key.length - 6);
  imagesObj[code] = imagesContext(key);
});

export default imagesObj;
const lastUpdatedLabel = document.getElementById('lastupdateddate');
const generalGrid = document.getElementById('generalgrid');
Covid19API.getSummary().then((summary) => {
  const app = new App(summary, lastUpdatedLabel, generalGrid);
  app.init();
});
