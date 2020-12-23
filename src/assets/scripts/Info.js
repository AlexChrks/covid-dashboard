import DOMElement from './DOMElement.js';

export default class Info {
  constructor(database) {
    this.database = database;
    this.div = DOMElement.create('div', 'infocontainer');
    this.country = DOMElement.create('p', 'infowidgetcountry', null, this.div);
    // this.marker = DOMElement.create('p', 'infowidgetmarker', null, this.div);
    // this.value = DOMElement.create('p', 'infowidgetvalue', null, this.div);
    this.confirmedMarker = DOMElement.create('p', 'infowidgetmarker', null, this.div);
    this.confirmedValue = DOMElement.create('p', 'infowidgetvalue', null, this.div);
    this.recoveredMarker = DOMElement.create('p', 'infowidgetmarker', null, this.div);
    this.recoveredValue = DOMElement.create('p', 'infowidgetvalue', null, this.div);
    this.deathsMarker = DOMElement.create('p', 'infowidgetmarker', null, this.div);
    this.deathsValue = DOMElement.create('p', 'infowidgetvalue', null, this.div);
    this.confirmedMarker.innerHTML = 'Confirmed';
    this.recoveredMarker.innerHTML = 'Recovered';
    this.deathsMarker.innerHTML = 'Deaths';
    if (database !== null) {
      this.update('absolute', 'total', 'confirmed', 'world');
    }
  }

  update(people, time, marker, countryCode) {
    let divider = 1;
    if (people === 'per100k') {
      divider = 100000;
    }
    if ((countryCode === 'world') || (countryCode === undefined)) {
      this.country.innerHTML = 'World';
      if (time === 'total') {
        this.confirmedValue.innerHTML = Info.calcPer100k(this.database.global.totalConfirmed,
          this.database.global.totalPopulation, divider);
        this.recoveredValue.innerHTML = Info.calcPer100k(this.database.global.totalRecovered,
          this.database.global.totalPopulation, divider);
        this.deathsValue.innerHTML = Info.calcPer100k(this.database.global.totalDeaths,
          this.database.global.totalPopulation, divider);
      } else {
        this.confirmedValue.innerHTML = Info.calcPer100k(this.database.global.newConfirmed,
          this.database.global.totalPopulation, divider);
        this.recoveredValue.innerHTML = Info.calcPer100k(this.database.global.newRecovered,
          this.database.global.totalPopulation, divider);
        this.deathsValue.innerHTML = Info.calcPer100k(this.database.global.newDeaths,
          this.database.global.totalPopulation, divider);
      }
    } else {
      const country = this.database.countries.find((cntr) => cntr.countryCode === countryCode);
      this.country.innerHTML = country.name;
      if (time === 'total') {
        this.confirmedValue.innerHTML = Info.calcPer100k(country.totalConfirmed, country.population, divider);
        this.recoveredValue.innerHTML = Info.calcPer100k(country.totalRecovered, country.population, divider);
        this.deathsValue.innerHTML = Info.calcPer100k(country.totalDeaths, country.population, divider);
      } else {
        this.confirmedValue.innerHTML = Info.calcPer100k(country.newConfirmed, country.population, divider);
        this.recoveredValue.innerHTML = Info.calcPer100k(country.newRecovered, country.population, divider);
        this.deathsValue.innerHTML = Info.calcPer100k(country.newDeaths, country.population, divider);
      }
    }
  }

  static calcPer100k(value, population, divider) {
    if (divider === 1) return value;
    const tmp = (value * divider) / population;
    if (Math.floor(tmp) === 0) {
      return Math.floor(tmp * 1000) / 1000;
    }
    return Math.floor(tmp);
  }
}
