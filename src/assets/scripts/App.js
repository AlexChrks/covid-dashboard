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
    this.selectPanelsState = { time: 'total', param: 'confirmed', percent: 'absolute' };
    this.selectedCountry = { slug: 'world', countryCode: 'world' };
    this.cntrmemory = 'world';
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
    this.infoWidgetSelectPanel.containerSelect.addEventListener('change', this.selectPanelsHandle);

    this.countriesWidget = this.generalGrid.getElementsByClassName('countries_widget').item(0);
    this.countriesSelectPanel = new SelectPanel('countrieswidget', this.countriesWidget);
    this.selectPanelsArray.push(this.countriesSelectPanel);
    this.countries = new CountriesList();
    this.countries.createList();
    this.countriesSelectPanel.containerSelect.addEventListener('change', this.selectPanelsHandle);
    this.countries.listContainer.addEventListener('click', this.listContainerHandle);

    this.scheduleWidget = this.generalGrid.getElementsByClassName('graph_widget').item(0);
    this.scheduleSelectPanel = new SelectPanel('schedulewidget', this.scheduleWidget);
    this.selectPanelsArray.push(this.scheduleSelectPanel);
    this.schedule = new Schedule();
    this.scheduleSelectPanel.containerSelect.addEventListener('change', this.selectPanelsHandle);

    this.mapWidget = this.generalGrid.getElementsByClassName('map_widget').item(0);
    this.mapSelectPanel = new SelectPanel('map_widget', this.mapWidget);
    this.selectPanelsArray.push(this.mapSelectPanel);
    MapWidget.init();
    MapWidget.initCurCntr(this.selectedCountry);
    MapWidget.elements.mapImg.on('click', this.mapContainerHandle);
    this.mapSelectPanel.containerSelect.addEventListener('change', this.selectPanelsHandle);

    this.createPopup();
  }

  updateSelectPanels(state, stateShort) {
    this.selectPanelsArray.forEach((panel) => {
      panel.timeSelect.selectedIndex = stateShort.time;
      panel.paramSelect.selectedIndex = stateShort.param;
      panel.percentSelect.selectedIndex = stateShort.percent;
    });
    this.schedule.createSchedule(this.selectedCountry.slug, state.param, state.time, state.percent);
    this.info.update(state.percent, state.time, state.param, this.selectedCountry.countryCode);
    this.countries.createList();
    MapWidget.drawCircles(state.param, state.time, state.percent);
  }

  selectPanelsHandle = (event) => {
    const panelID = event.target.closest('.select-container').id;
    const panel = this.selectPanelsArray.find((element) => `selectpanel${element.widgetName}` === panelID);
    this.selectPanelsState.time = panel.timeSelect.children
      .item(panel.timeSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, '');
    this.selectPanelsState.param = panel.paramSelect.children
      .item(panel.paramSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, '');
    this.selectPanelsState.percent = panel.percentSelect.children
      .item(panel.percentSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, '');
    const stateShort = {
      time: panel.timeSelect.selectedIndex,
      param: panel.paramSelect.selectedIndex,
      percent: panel.percentSelect.selectedIndex
    };
    this.updateSelectPanels(this.selectPanelsState, stateShort);
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

  listContainerHandle =(event) => {
    const country = event.target.closest('.country-row');
    if (country !== null) {
      this.selectedCountry.countryCode = country.dataset.countrycode;
      this.selectedCountry.slug = country.dataset.slug;
      if (this.cntrmemory !== this.selectedCountry.countryCode) {
        this.cntrmemory = this.selectedCountry.countryCode;
        this.info.update(this.selectPanelsState.percent, this.selectPanelsState.time, this.selectPanelsState.param,
          this.selectedCountry.countryCode);
        this.schedule.createSchedule(this.selectedCountry.countryCode, this.selectPanelsState.param,
          this.selectPanelsState.time, this.selectPanelsState.percent);
        MapWidget.focusCountry(this.selectedCountry.countryCode);
      }
    }
  };

  mapContainerHandle = () => {
    if (this.cntrmemory !== this.selectedCountry.countryCode) {
      this.cntrmemory = this.selectedCountry.countryCode;
      this.info.update(this.selectPanelsState.percent, this.selectPanelsState.time, this.selectPanelsState.param,
        this.selectedCountry.countryCode);
      this.schedule.createSchedule(this.selectedCountry.countryCode, this.selectPanelsState.param,
        this.selectPanelsState.time, this.selectPanelsState.percent);
    }
  }
}
