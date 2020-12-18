export default class Selects {
  constructor(elementToAppend) { // Place element in argument, where you want to place selects;
    this.elementToAppend = elementToAppend;
  }

  createSelects() {
    this.containerSelect = document.createElement('div');
    this.containerSelect.classList.add('select-container');
    this.optionSelect = document.createElement('select');
    this.paramSelect = document.createElement('select');
    this.percentSelect = document.createElement('select');

    this.paramCases = document.createElement('option');
    this.paramDeaths = document.createElement('option');
    this.paramRecovered = document.createElement('option');
    this.optionDaily = document.createElement('option');
    this.optionTotal = document.createElement('option');
    this.percentAbs = document.createElement('option');
    this.percentPer100k = document.createElement('option');

    this.paramCases.innerText = 'Cases';
    this.paramDeaths.innerText = 'Deaths';
    this.paramRecovered.innerText = 'Recovered';
    this.optionDaily.innerText = 'Daily';
    this.optionTotal.innerText = 'Cumulative';
    this.percentAbs.innerText = 'Absolute';
    this.percentPer100k.innerText = 'Per 100k';

    this.paramCases.value = 'totalConfirmed';
    this.paramDeaths.value = 'totalDeaths';
    this.paramRecovered.value = 'totalRecovered';
    this.optionDaily.value = 'daily';
    this.optionTotal.value = 'cumulative';
    this.percentAbs.value = 'absolute';
    this.percentPer100k.value = 'per100k';

    this.paramCases.setAttribute('selected', 'selected');
    this.optionTotal.setAttribute('selected', 'selected');
    this.percentAbs.setAttribute('selected', 'selected');

    this.optionSelect.append(this.optionDaily, this.optionTotal);
    this.paramSelect.append(this.paramCases, this.paramDeaths, this.paramRecovered);
    this.percentSelect.append(this.percentAbs, this.percentPer100k);

    this.containerSelect.append(this.paramSelect, this.optionSelect, this.percentSelect);
    this.elementToAppend.append(this.containerSelect);
  }
}
