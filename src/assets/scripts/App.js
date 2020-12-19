import OptionsPanel from './OptionsPanel.js';
import Schedule from './Schedule.js';
import { MapWidget } from './map.js';
import Info from './Info.js';

export default class App {
  constructor(summary, lastUpdatedLabel, generalGrid) {
    this.summary = summary;
    this.lastUpdatedLabel = lastUpdatedLabel;
    this.generalGrid = generalGrid;
  }

  init() {
    const dtoptions = {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
    };
    this.lastUpdatedLabel.innerHTML = this.summary.dateTime.toLocaleString('en-US', dtoptions);
    this.infoWidget = this.generalGrid.getElementsByClassName('info_widget').item(0);
    this.infoWidgetOptions = new OptionsPanel();
    this.infoWidget.append(this.infoWidgetOptions.div);
    this.info = new Info(this.summary);
    this.infoWidget.append(this.info.div);
    this.schedule = new Schedule();
    MapWidget.init();
  }
}
