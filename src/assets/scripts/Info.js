import DOMElement from './DOMElement.js';

export default class Info {
  constructor(database) {
    this.database = database;
    this.div = DOMElement.create('div', 'infocontainer');
    this.country = DOMElement.create('p', 'infowidgetcountry', null, this.div);
    this.marker = DOMElement.create('p', 'infowidgetmarker', null, this.div);
    this.value = DOMElement.create('p', 'infowidgetvalue', null, this.div);
    this.update('absolute', 'total', 'confirmed', 'word');
  }

  update(people, time, marker, countryCode) {
    let divider = 1;
    if ((countryCode === 'word') || (countryCode === undefined)) {
      this.country.innerHTML = 'Word';
      if (people === 'per100k') {
        divider = 100000;
      }
      switch (marker) {
        case 'confirmed':
          this.marker.innerHTML = 'Confirmed';
          if (time === 'total') {
            this.value.innerHTML = Math.floor(this.database.global.totalConfirmed / divider);
          } else {
            this.value.innerHTML = Math.floor(this.database.global.newConfirmed / divider);
          }
          break;
        case 'recovered':
          this.marker.innerHTML = 'Recovered';
          if (time === 'total') {
            this.value.innerHTML = Math.floor(this.database.global.totalRecovered / divider);
          } else {
            this.value.innerHTML = Math.floor(this.database.global.newRecovered / divider);
          }
          break;
        case 'death':
          this.marker.innerHTML = 'Deaths';
          if (time === 'total') {
            this.value.innerHTML = Math.floor(this.database.global.totalDeaths / divider);
          } else {
            this.value.innerHTML = Math.floor(this.database.global.newDeaths / divider);
          }
          break;
        default:
          break;
      }
    } else {
      const tmp = this.database.countries.find((cntr) => cntr.countryCode === countryCode);
      this.country.innerHTML = tmp.name;
    }
  }
}
