/*
Example for use
import CovidAPI from './CovidAPI.js'
const somePromise = CovidAPI.getSummary().then((database) => {
  console.log(database.global);
}).catch((error) => console.log(error.message));
For NodeJS install node-fetch package
*/
export default class CovidAPI {
  static #covid19APIURL = 'https://api.covid19api.com/summary';

  static #countryInfoURL = 'https://restcountries.eu/rest/v2/all?fields=alpha2Code;name;population;flag';

  static #worldHistory =`https://disease.sh/v3/covid-19/historical/all?lastdays=${Math.floor(
    (new Date() - new Date(2020, 0, 1)) / (1000 * 60 * 60 * 24)
  )}`;

  static getSummary() {
    const urls = [CovidAPI.#covid19APIURL, CovidAPI.#countryInfoURL];
    const requests = urls.map((url) => fetch(url));
    const retPromise = Promise.all(requests).then((responses) => {
      let err = false;
      responses.forEach((response) => {
        if (response.status !== 200) {
          err = true;
        }
      });
      if (err) {
        return new Error('getSummary http request error');
      }
      return responses;
    }).then((responses) => {
      const data = responses.map((response) => response.json());
      return Promise.all(data);
    }).then((objects) => {
      const covid = objects[0];
      const countriesInfo = objects[1];
      const database = {
        global: {
          newConfirmed: covid.Global.NewConfirmed,
          totalConfirmed: covid.Global.TotalConfirmed,
          newDeaths: covid.Global.NewDeaths,
          totalDeaths: covid.Global.TotalDeaths,
          newRecovered: covid.Global.NewRecovered,
          totalRecovered: covid.Global.TotalRecovered
        },
        countries: [],
        ready: false,
        dateTime: new Date()
      };
      covid.Countries.forEach((country) => {
        const obj = countriesInfo.find((element) => element.alpha2Code === country.CountryCode);
        if (obj !== undefined) {
          const cntr = {
            name: country.Country,
            slug: country.Slug, // key for other covid19API requests
            countryCode: country.CountryCode,
            newConfirmed: country.NewConfirmed,
            totalConfirmed: country.TotalConfirmed,
            newDeaths: country.NewDeaths,
            totalDeaths: country.TotalDeaths,
            newRecovered: country.NewRecovered,
            totalRecovered: country.TotalRecovered,
            population: obj.population,
            flag: obj.flag
          };
          database.countries.push(cntr);
        }
      });
      database.ready = true;
      return database;
    });
    return retPromise;
  }

  static getWorldHistory() {
    const retPromise = fetch(CovidAPI.#worldHistory).then((response) => {
      if (response.status !== 200) {
        return new Error('getSummary http request error');
      }
      return response.json();
    }).then((data) => {
      const database = [];
      const dateArr = Object.keys(data.cases);
      dateArr.forEach((date) => {
        const day = {
          date: new Date(date),
          totalConfirmed: data.cases[date],
          totalDeaths: data.deaths[date],
          totalRecovered: data.recovered[date]
        };
        database.push(day);
      });
      return database;
    });
    return retPromise;
  }
}
