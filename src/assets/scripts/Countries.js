/* eslint-disable no-console */
import CovidAPI from './Covid19API.js';

class CountriesList {
  constructor() {
    this.list = 'one';
    this.countriesContainer = document.querySelector('.countries_widget');
    this.selectTime = document.querySelector('#selecttimecountrieswidget');
    this.selectParam = document.querySelector('#selectparamcountrieswidget');
    this.selectPercent = document.querySelector('#selectpercentcountrieswidget');

    this.searchForm = document.createElement('form');
    this.searchForm.classList.add('countriesForm');
    this.searchForm.setAttribute('autocomplete', 'off');

    this.autocompleteBlock = document.createElement('div');
    this.autocompleteBlock.classList.add('autocomplete');

    this.searchField = document.createElement('input');
    this.searchField.setAttribute('type', 'text');
    this.searchField.classList.add('inputCity');
    this.autocompleteBlock.appendChild(this.searchField);

    this.searchButton = document.createElement('button');
    this.searchButton.setAttribute('type', 'submit');
    this.searchButton.classList.add('city-button');
    this.autocompleteBlock.appendChild(this.searchButton);

    this.switchKeyboard = document.createElement('button');
    this.switchKeyboard.classList.add('b_getCity', 'keyboard-button');
    this.autocompleteBlock.appendChild(this.switchKeyboard);
    this.searchForm.appendChild(this.autocompleteBlock);
    this.countriesContainer.appendChild(this.searchForm);

    this.listContainer = document.createElement('div');
    this.listContainer.classList.add('list-container');
    this.countriesContainer.appendChild(this.listContainer);
  }

  createList() {
    // this.selects = new Selects(document.querySelector('.countries_widget'));
    // this.selects.createSelects();
    this.listContainer.innerHTML = '';

    document.querySelector('.city-button').onclick = (e) => {
      e.preventDefault();
    };

    CovidAPI.getSummary().then((database) => {
      // console.log(database.countries);

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

        if (this.selectParam.value === 'Confirmed') {
          if (this.selectTime.value === 'Daily') {
            total.innerHTML = country.newConfirmed;
          } else {
            total.innerHTML = country.totalConfirmed;
          }
        }
        if (this.selectParam.value === 'Deaths') {
          if (this.selectTime.value === 'Daily') {
            total.innerHTML = country.newDeaths;
          } else {
            total.innerHTML = country.totalDeaths;
          }
        }
        if (this.selectParam.value === 'Recovered') {
          if (this.selectTime.value === 'Daily') {
            total.innerHTML = country.newRecovered;
          } else {
            total.innerHTML = country.totalRecovered;
          }
        }

        if (this.selectPercent.value === 'Per 100k') {
          const per100k = Number(total.innerHTML) / 100000;
          total.innerHTML = Math.round(per100k);
        }

        countryRow.appendChild(countryFlag);
        countryRow.appendChild(countryName);
        countryRow.appendChild(total);

        this.listContainer.appendChild(countryRow);
      });

      this.rows = document.querySelectorAll('.country-row');
      const arr = [...this.rows];
      arr.sort((a, b) => (Number(a.lastChild.innerHTML) > Number(b.lastChild.innerHTML) ? -1 : 1));
      this.listContainer.innerHTML = '';
      arr.forEach((item) => {
        this.listContainer.appendChild(item);
      });
    }).catch((error) => console.log(error.message));
  }
}

export default CountriesList;
