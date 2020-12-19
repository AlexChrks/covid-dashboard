import SelectPanel from './SelectPanel.js';
import Schedule from './Schedule.js';
import { MapWidget } from './map.js';
import CountriesList from './Countries.js';
import Info from './Info.js';

export default class App {
  constructor(summary, lastUpdatedLabel, generalGrid) {
    this.summary = summary;
    this.lastUpdatedLabel = lastUpdatedLabel;
    this.generalGrid = generalGrid;
    this.selectPanelsArray = [];
  }

  init() {
    const dtoptions = {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
    };
    this.lastUpdatedLabel.innerHTML = this.summary.dateTime.toLocaleString('en-US', dtoptions);

    this.infoWidget = this.generalGrid.getElementsByClassName('info_widget').item(0);
    this.infoWidgetSelectPanel = new SelectPanel('infowidget', this.infoWidget);
    this.selectPanelsArray.push(this.infoWidgetSelectPanel);
    this.info = new Info(this.summary);
    this.infoWidget.append(this.info.div);
    this.infoWidgetSelectPanel.containerSelect.addEventListener('change', () => {
      const state = {
        time: this.infoWidgetSelectPanel.timeSelect.children
          .item(this.infoWidgetSelectPanel.timeSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, ''),
        param: this.infoWidgetSelectPanel.paramSelect.children
          .item(this.infoWidgetSelectPanel.paramSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, ''),
        percent: this.infoWidgetSelectPanel.percentSelect.children
          .item(this.infoWidgetSelectPanel.percentSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, '')
      };
      const stateShort = {
        time: this.infoWidgetSelectPanel.timeSelect.selectedIndex,
        param: this.infoWidgetSelectPanel.paramSelect.selectedIndex,
        percent: this.infoWidgetSelectPanel.percentSelect.selectedIndex
      };
      this.updateSelectPanels(state, stateShort);
    });

    this.countriesWidget = this.generalGrid.getElementsByClassName('countries_widget').item(0);
    this.countriesSelectPanel = new SelectPanel('countrieswidget', this.countriesWidget);
    this.selectPanelsArray.push(this.countriesSelectPanel);
    this.countries = new CountriesList();
    this.countries.createList();
    this.countriesSelectPanel.containerSelect.addEventListener('change', () => {
      const state = {
        time: this.countriesSelectPanel.timeSelect.children
          .item(this.countriesSelectPanel.timeSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, ''),
        param: this.countriesSelectPanel.paramSelect.children
          .item(this.countriesSelectPanel.paramSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, ''),
        percent: this.countriesSelectPanel.percentSelect.children
          .item(this.countriesSelectPanel.percentSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, '')
      };
      const stateShort = {
        time: this.countriesSelectPanel.timeSelect.selectedIndex,
        param: this.countriesSelectPanel.paramSelect.selectedIndex,
        percent: this.countriesSelectPanel.percentSelect.selectedIndex
      };
      this.updateSelectPanels(state, stateShort);
    });

    this.schedule = new Schedule();

    MapWidget.init();
    this.createPopup();
  }

  updateSelectPanels(state, stateShort) {
    this.selectPanelsArray.forEach((panel) => {
      panel.timeSelect.selectedIndex = stateShort.time;
      panel.paramSelect.selectedIndex = stateShort.param;
      panel.percentSelect.selectedIndex = stateShort.percent;
    });
    this.info.update(state.percent, state.time, state.param, 'world');
  }

  createPopup() {
    this.buttons = document.querySelectorAll('.full_screen');
    this.buttons.forEach((el) => {
      el.addEventListener('click', () => {
        const parent = el.parentNode.parentNode;
        if (parent.classList[0] === 'general_grid') {
          const arr = parent.children;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].classList[0] !== el.parentNode.classList[0]) {
              arr[i].classList.toggle('widget_display');
            }
          }
        } else {
          const arr = parent.parentNode.children;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].classList[0] !== parent.classList[0]) {
              arr[i].classList.toggle('widget_display');
            }
          }
        }
        document.querySelector('main').classList.toggle('main_content');
        el.parentNode.classList.toggle('full_screen_popup');
      });
    });
  }
}
