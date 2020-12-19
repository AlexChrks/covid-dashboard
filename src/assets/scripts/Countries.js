/* eslint-disable no-console */
import CovidAPI from './Covid19API.js';
import Selects from './Selects.js';

class CountriesList {
  constructor() {
    this.list = 'one';
    this.countriesContainer = document.querySelector('.countries_widget');
  }

  createList() {
    const selects = new Selects(document.querySelector('.countries_widget'));
    selects.createSelects();

    const searchForm = document.createElement('form');
    searchForm.classList.add('countriesForm');

    const searchField = document.createElement('input');
    searchField.setAttribute('type', 'text');
    searchField.classList.add('inputCity');
    searchForm.appendChild(searchField);

    const searchButton = document.createElement('button');
    searchButton.setAttribute('type', 'submit');
    searchButton.classList.add('city-button');
    searchForm.appendChild(searchButton);

    const switchKeyboard = document.createElement('button');
    switchKeyboard.classList.add('b_getCity', 'keyboard-button');
    searchForm.appendChild(switchKeyboard);

    this.countriesContainer.appendChild(searchForm);

    document.querySelector('.city-button').onclick = (e) => {
      e.preventDefault();
    };

    CovidAPI.getSummary().then((database) => {
      console.log(database.countries);

      database.countries.forEach((country) => {
        const countryRow = document.createElement('div');
        countryRow.classList.add('country-row');

        const countryFlag = document.createElement('img');
        countryFlag.classList.add('country-flag');
        countryFlag.src = country.flag;

        const countryName = document.createElement('div');
        countryName.classList.add('country-name');
        countryName.innerHTML = country.name;

        const total = document.createElement('div');
        total.classList.add('country-total');
        total.innerHTML = country.totalConfirmed;

        countryRow.appendChild(countryFlag);
        countryRow.appendChild(countryName);
        countryRow.appendChild(total);

        this.countriesContainer.appendChild(countryRow);
      });
    }).catch((error) => console.log(error.message));
  }
}

export default CountriesList;
