import DOMElement from './DOMElement.js';

const optionsDefault = {
  timeGroup: true,
  populationGroup: true,
  indicatorGroup: true
};
export default class OptionsPanel {
  constructor(options = optionsDefault) {
    this.options = options;
    this.generate();
  }

  generate() {
    this.div = DOMElement.create('div', 'optionspanel', null, null, ['id', 'optionspanel']);
    this.optionsContainer1 = DOMElement.create('div', 'optionscontainer1', null, this.div, ['id', 'optionscontainer1']);
    this.optionsContainer2 = DOMElement.create('div', 'optionscontainer2', null, this.div, ['id', 'optionscontainer2']);
    if (this.options.timeGroup === true) {
      this.timeGroup = DOMElement.create('form', 'timegroup', null, this.optionsContainer1);
      this.timeGroupTotal = DOMElement.create('p', 'optionslabel', 'All period', this.timeGroup);
      this.totalBtn = DOMElement.create('input', 'radiobutton', null, null,
        ['name', 'timegroup'], ['type', 'radio'], ['value', 'total'], ['checked', 'true']);
      this.timeGroupTotal.prepend(this.totalBtn);
      this.timeGroupLastDay = DOMElement.create('p', 'optionslabel', 'Last Day', this.timeGroup);
      this.lastDayBtn = DOMElement.create('input', 'radiobutton', null, null, ['name', 'timegroup'],
        ['type', 'radio'], ['value', 'lastDay']);
      this.timeGroupLastDay.prepend(this.lastDayBtn);
    }
    if (this.options.populationGroup === true) {
      this.populationGroup = DOMElement.create('form', 'populationgroup', null, this.optionsContainer1);
      this.populationGroupAll = DOMElement.create('p', 'optionslabel', 'Absolute', this.populationGroup);
      this.AbsoluteBtn = DOMElement.create('input', 'radiobutton', null, null,
        ['name', 'populationgroup'], ['type', 'radio'], ['value', 'absolute'], ['checked', 'true']);
      this.populationGroupAll.prepend(this.AbsoluteBtn);
      this.populationGroupPer100k = DOMElement.create('p', 'optionslabel', 'Per 100,000', this.populationGroup);
      this.per100kBtn = DOMElement.create('input', 'radiobutton', null, null,
        ['name', 'populationgroup'], ['type', 'radio'], ['value', 'per100k']);
      this.populationGroupPer100k.prepend(this.per100kBtn);
    }
    if (this.options.indicatorGroup === true) {
      this.indicatorGroup = DOMElement.create('form', 'indicatorgroup', null, this.optionsContainer2);
      this.indicatorGroupConfirmed = DOMElement.create('p', 'optionslabel', 'Confirmed', this.indicatorGroup);
      this.confirmedBtn = DOMElement.create('input', 'radiobutton', null, null,
        ['name', 'indicatorgroup'], ['type', 'radio'], ['value', 'confirmed'], ['checked', 'true']);
      this.indicatorGroupConfirmed.prepend(this.confirmedBtn);
      this.indicatorGroupRecovered = DOMElement.create('p', 'optionslabel', 'Recovered', this.indicatorGroup);
      this.recoveredBtn = DOMElement.create('input', 'radiobutton', null, null,
        ['name', 'indicatorgroup'], ['type', 'radio'], ['value', 'recovered']);
      this.indicatorGroupRecovered.prepend(this.recoveredBtn);
      this.indicatorGroupDeath = DOMElement.create('p', 'optionslabel', 'Death', this.indicatorGroup);
      this.deathBtn = DOMElement.create('input', 'radiobutton', null, null,
        ['name', 'indicatorgroup'], ['type', 'radio'], ['value', 'death']);
      this.indicatorGroupDeath.prepend(this.deathBtn);
    }
    return this.div;
  }
}
