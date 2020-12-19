import DOMElement from './DOMElement.js';

export default class SelectPanel {
  constructor(widgetName, parent) {
    this.widgetName = widgetName;
    this.parent = parent;
    this.generate();
  }

  generate() {
    this.containerSelect = DOMElement.create('div', 'select-container', null, this.parent,
      ['id', `selectpanel${this.widgetName}`]);

    this.timeSelect = DOMElement.create('select', 'select-time', null, this.containerSelect,
      ['id', `selecttime${this.widgetName}`]);
    this.paramSelect = DOMElement.create('select', 'select-param', null, this.containerSelect,
      ['id', `selectparam${this.widgetName}`]);
    this.percentSelect = DOMElement.create('select', 'select-percent', null, this.containerSelect,
      ['id', `selectpercent${this.widgetName}`]);

    this.timeDaily = DOMElement.create('option', 'select-option', 'Daily', this.timeSelect,
      ['selected', 'selected']);
    this.timeTotal = DOMElement.create('option', 'select-option', 'Total', this.timeSelect);

    this.paramConfirmed = DOMElement.create('option', 'select-option', 'Confirmed', this.paramSelect,
      ['selected', 'selected']);
    this.paramDeaths = DOMElement.create('option', 'select-option', 'Deaths', this.paramSelect);
    this.paramRecovered = DOMElement.create('option', 'select-option', 'Recovered', this.paramSelect);

    this.percentAbs = DOMElement.create('option', 'select-option', 'Absolute', this.percentSelect,
      ['selected', 'selected']);
    this.percentPer100k = DOMElement.create('option', 'select-option', 'Per 100k', this.percentSelect);
  }
}
