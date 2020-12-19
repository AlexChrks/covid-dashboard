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
    this.infoWidgetSelectPanel.containerSelect.addEventListener('change', this.selectPanelsHandle);

    this.countriesWidget = this.generalGrid.getElementsByClassName('countries_widget').item(0);
    this.countriesSelectPanel = new SelectPanel('countrieswidget', this.countriesWidget);
    this.selectPanelsArray.push(this.countriesSelectPanel);
    this.countries = new CountriesList();
    this.countries.createList();
    this.countriesSelectPanel.containerSelect.addEventListener('change', this.selectPanelsHandle);

    this.schedule = new Schedule();

    MapWidget.init();
  }

  updateSelectPanels(state, stateShort) {
    this.selectPanelsArray.forEach((panel) => {
      panel.timeSelect.selectedIndex = stateShort.time;
      panel.paramSelect.selectedIndex = stateShort.param;
      panel.percentSelect.selectedIndex = stateShort.percent;
    });
    this.info.update(state.percent, state.time, state.param, 'world');
  }

  selectPanelsHandle = (event) => {
    const panelID = event.target.closest('.select-container').id;
    const panel = this.selectPanelsArray.find((element) => `selectpanel${element.widgetName}` === panelID);
    const state = {
      time: panel.timeSelect.children
        .item(panel.timeSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, ''),
      param: panel.paramSelect.children
        .item(panel.paramSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, ''),
      percent: panel.percentSelect.children
        .item(panel.percentSelect.selectedIndex).innerText.toLowerCase().replace(/\s/g, '')
    };
    const stateShort = {
      time: panel.timeSelect.selectedIndex,
      param: panel.paramSelect.selectedIndex,
      percent: panel.percentSelect.selectedIndex
    };
    this.updateSelectPanels(state, stateShort);
  }
}
