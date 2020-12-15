/*
Example for use
import CovidAPI from './Covid19API.js'
const somePromise = CovidAPI.getSummary().then((database) => {
  console.log(database.global);
}).catch((error) => console.log(error.message));
For NodeJS install node-fetch package
getSummary return
{
  global : {
    newConfirmed: 697848,
    totalConfirmed: 69582029,
    newDeaths: 12481,
    totalDeaths: 1581758,
    newRecovered: 489131,
    totalRecovered: 44863011,
    totalPopulation: 7304699132
  }
  countries : [{
    name: 'Afghanistan',
    slug: 'afghanistan',
    countryCode: 'AF',
    newConfirmed: 202,
    totalConfirmed: 48053,
    newDeaths: 16,
    totalDeaths: 1935,
     newRecovered: 67,
    totalRecovered: 38099,
    population: 27657145,
    flag: 'https://restcountries.eu/data/afg.svg',
    latLon: [ 33, 65 ]
  }, {...}]
  ready: false,
  dateTime: new Date()
}
getWorldHistory and getCountryHistory(slug) return
[{
  date: 2020-01-22T00:00:00.000Z,
  totalConfirmed: 555,
  totalDeaths: 17,
  totalRecovered: 28
}]
*/
import LocalStorage from './LocalStorage.js';

export default class CovidAPI {
  static getSummary() {
    const covid19APIURL = 'https://api.covid19api.com/summary';
    const countryInfoURL = 'https://restcountries.eu/rest/v2/all?fields=alpha2Code;name;population;latlng;flag';
    const c19Summary = LocalStorage.read('c19Summary');
    let cash = false;
    if (c19Summary !== null) {
      if (Math.floor((new Date() - new Date(c19Summary.dateTime)) / (1000 * 60 * 60)) < 12) {
        cash = true;
      }
    }
    if (cash === true) {
      return new Promise((resolve) => resolve(c19Summary));
    }
    const urls = [covid19APIURL, countryInfoURL];
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
      let totalPopulation = 0;
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
            flag: obj.flag,
            latLon: obj.latlng
          };
          totalPopulation += obj.population;
          database.countries.push(cntr);
        }
      });
      database.global.totalPopulation = totalPopulation;
      database.ready = true;
      LocalStorage.write('c19Summary', database);
      return database;
    });
    return retPromise;
  }

  static getWorldHistory() {
    const worldHistory = `https://disease.sh/v3/covid-19/historical/all?lastdays=${Math.floor(
      (new Date() - new Date(2020, 0, 1)) / (1000 * 60 * 60 * 24)
    )}`;
    const retPromise = fetch(worldHistory).then((response) => {
      if (response.status !== 200) {
        return new Error('getWorldHistory http request error');
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

  static getCountryHistory(countrySlug) {
    const countryHistory = `https://api.covid19api.com/country/slug?from=${(new Date(2020, 4, 1))
      .toISOString()}&to=${(new Date()).toISOString()}`;
    const url = countryHistory.replace(/slug/, countrySlug);
    const retPromise = fetch(url).then((response) => {
      if (response.status !== 200) {
        return new Error('getCountryHistory http request error');
      }
      return response.json();
    }).then((data) => {
      const database = [];
      data.forEach((element) => {
        const day = {
          date: new Date(element.Date),
          totalConfirmed: element.Confirmed,
          totalDeaths: element.Deaths,
          totalRecovered: element.Recovered
        };
        database.push(day);
      });
      return database;
    });
    return retPromise;
  }
}
