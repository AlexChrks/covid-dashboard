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
    this.searchField.classList.add('inputCity', 'use-keyboard-input');
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

    window.addEventListener('DOMContentLoaded', () => {
      this.keyboardStart();
      this.keyboard.init();
      document.querySelectorAll('.keyboard__key').forEach((key) => {
        key.addEventListener('click', () => {
          this.liveSearchProcess();
        });
      });
    });
  }

  createList() {
    this.listContainer.innerHTML = '';

    document.querySelector('.city-button').onclick = (e) => {
      e.preventDefault();
    };
    document.querySelector('.keyboard-button').onclick = (e) => {
      e.preventDefault();
    };

    CovidAPI.getSummary().then((database) => {
      database.countries.forEach((country) => {
        const countryRow = document.createElement('div');
        countryRow.classList.add('country-row');

        countryRow.setAttribute('data-countryslug', `${country.slug}`);
        countryRow.setAttribute('data-countrycode', `${country.countryCode}`);

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
      this.sortedRows = document.querySelectorAll('.country-row');
      this.liveSearch();
    }).catch((error) => console.log(error.message));
  }

  liveSearch() {
    this.searchField.addEventListener('input', () => {
      this.liveSearchProcess();
    });
  }

  liveSearchProcess() {
    const value = this.searchField.value.trim().toLowerCase();
    if (value !== '') {
      this.sortedRows.forEach((row) => {
        if (row.children[1].innerText.toLowerCase().search(value) === -1) {
          row.classList.add('hide');
        } else {
          row.classList.remove('hide');
        }
      });
    } else {
      this.sortedRows.forEach((row) => {
        row.classList.remove('hide');
      });
    }
  }

  keyboardStart() {
    this.keyboard = {
      elements: {
        main: null,
        keysContainer: null,
        keys: []
      },

      eventHandlers: {
        oninput: null,
        onclose: null
      },

      properties: {
        value: '',
        capsLock: false
      },

      init() {
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this.createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll('.keyboard-button').forEach((element) => {
          element.addEventListener('click', () => {
            document.querySelector('.keyboard-button').classList.add('active-keyboard');
            const input = document.querySelector('.use-keyboard-input');
            this.open(input.value, (currentValue) => {
              input.value = currentValue;
            });
          });
        });
      },

      createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
          '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
          'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
          'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
          'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
          'space'
        ];

        const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

        keyLayout.forEach((key) => {
          const keyElement = document.createElement('button');
          const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

          keyElement.setAttribute('type', 'button');
          keyElement.classList.add('keyboard__key');

          switch (key) {
            case 'backspace':
              keyElement.classList.add('keyboard__key--wide');
              keyElement.innerHTML = createIconHTML('backspace');

              keyElement.addEventListener('click', () => {
                this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                this.triggerEvent('oninput');
              });

              break;

            case 'caps':
              keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
              keyElement.innerHTML = createIconHTML('keyboard_capslock');

              keyElement.addEventListener('click', () => {
                this.toggleCapsLock();
                keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
              });

              break;

            case 'enter':
              keyElement.classList.add('keyboard__key--wide');
              keyElement.innerHTML = createIconHTML('keyboard_return');

              keyElement.addEventListener('click', () => {
                this.properties.value += '\n';
                this.triggerEvent('oninput');
              });

              break;

            case 'space':
              keyElement.classList.add('keyboard__key--extra-wide');
              keyElement.innerHTML = createIconHTML('space_bar');

              keyElement.addEventListener('click', () => {
                this.properties.value += ' ';
                this.triggerEvent('oninput');
              });

              break;

            case 'done':
              keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
              keyElement.innerHTML = createIconHTML('check_circle');

              keyElement.addEventListener('click', () => {
                this.close();
                this.triggerEvent('onclose');
              });

              break;

            default:
              keyElement.textContent = key.toLowerCase();

              keyElement.addEventListener('click', () => {
                this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                this.triggerEvent('oninput');
              });

              break;
          }

          fragment.appendChild(keyElement);

          if (insertLineBreak) {
            fragment.appendChild(document.createElement('br'));
          }
        });

        return fragment;
      },

      triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] === 'function') {
          this.eventHandlers[handlerName](this.properties.value);
        }
      },

      toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (let i = 0; i < this.elements.keys.length; i++) {
          if (this.elements.keys[i].childElementCount === 0) {
            this.elements.keys[i].textContent = this.properties.capsLock
              ? this.elements.keys[i].textContent.toUpperCase()
              : this.elements.keys[i].textContent.toLowerCase();
          }
        }
      },

      open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');
      },

      close() {
        document.querySelector('.keyboard-button').classList.remove('active-keyboard');
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');
      }
    };
  }
}

export default CountriesList;
