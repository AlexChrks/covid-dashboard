import Chart from './Chart.bundle.min.js';
import CovidAPI from './Covid19API.js';

class Schedule {
  constructor() {
    this.generateSchedule();
    this.createSchedule();
  }

  generateSchedule() {
    this.graphWidget = document.querySelector('.graph_widget');
    this.scheduleInside = document.createElement('div');
    this.canvas = document.createElement('canvas');
    this.containerSelect = document.createElement('div');

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

    this.containerSelect.className = 'schedule_select';
    this.scheduleInside.className = 'schedule_inside';

    this.canvas.id = 'myChart';
    this.optionSelect.id = 'select_option';
    this.paramSelect.id = 'select_param';
    this.percentSelect.id = 'select_percent';

    this.ctx = this.canvas.getContext('2d');

    this.optionSelect.append(this.optionDaily, this.optionTotal);
    this.paramSelect.append(this.paramCases, this.paramDeaths, this.paramRecovered);
    this.percentSelect.append(this.percentAbs, this.percentPer100k);

    this.containerSelect.append(this.paramSelect, this.optionSelect, this.percentSelect);
    this.scheduleInside.append(this.canvas);
    this.graphWidget.append(this.scheduleInside, this.containerSelect);
  }

  createSchedule(country = 'world', param = 'totalConfirmed',
    option = 'cumulative', percent = 'absolute') {
    this.country = country;
    const selectParam = document.getElementById('select_param');
    const selectOption = document.getElementById('select_option');
    const selectPercent = document.getElementById('select_percent');
    const arraySelected = [];
    arraySelected.push(selectParam, selectOption, selectPercent);
    setTimeout(() => {
      selectParam.value = param;
      selectOption.value = option;
      selectPercent.value = percent;
    }, 200);
    const arrayPromises = [];
    if (country !== 'world') {
      this.promiseHistory = CovidAPI.getCountryHistory(country)
        .then((database) => database)
        .catch((error) => new Error(error.message));
    } else {
      this.promiseHistory = CovidAPI.getWorldHistory()
        .then((database) => database)
        .catch((error) => new Error(error.message));
    }
    this.promiseSummary = CovidAPI.getSummary()
      .then((database) => database)
      .catch((error) => new Error(error.message));
    arrayPromises.push(this.promiseSummary, this.promiseHistory);
    Promise.all(arrayPromises).then((arr) => {
      [this.objCases, this.arrayDays] = arr;
      this.drawSchedule(param, option, percent);
    });
    this.handleEvent = (e) => {
      if (e.type === 'change') {
        this.drawSchedule(selectParam.value, selectOption.value, selectPercent.value);
      }
    };
    arraySelected.forEach((el) => {
      el.removeEventListener('change', this, false);
    });
    arraySelected.forEach((el) => {
      el.addEventListener('change', this, false);
    });
  }

  transformMaxValue(num) {
    let newNum;
    this.toStringNum = `${Math.trunc(num)}`;
    if (num < 1) newNum = 1;
    else {
      newNum = (Math.trunc(Math.trunc(num)
        / (10 ** (this.toStringNum.length - 1))) * 2) * (10 ** (this.toStringNum.length - 1));
    }
    return newNum;
  }

  convertAbsoluteCases(param, option) {
    let population;
    if (this.country === 'world') {
      population = this.objCases.global.totalPopulation;
    } else {
      this.objCases.countries.forEach((el) => {
        if (el.name === this.country) {
          population = el.population;
        }
      });
    }
    for (let i = 1; i < this.arrayDays.length; i++) {
      let num;
      if (option === 'daily') {
        num = ((this.arrayDays[i][param] - this.arrayDays[i - 1][param])
          / population) * (10 ** 5);
      } else if (option === 'cumulative') {
        num = (this.arrayDays[i][param] / population) * (10 ** 5);
      }
      if (num < 0) num = 0;
      this.arr.push({
        x: new Date(`${this.arrayDays[i].date}`),
        y: (num.toFixed(3))
      });
    }
    const max = Math.max(...this.arr.map((el) => el.y));
    this.maxValue = this.transformMaxValue(max);
    this.stepSize = this.maxValue / 4;
  }

  convertCases(param, option) {
    for (let i = 1; i < this.arrayDays.length; i++) {
      let num;
      if (option === 'daily') {
        num = this.arrayDays[i][param] - this.arrayDays[i - 1][param];
      } else if (option === 'cumulative') {
        num = this.arrayDays[i][param];
      }
      if (num < 0) num = 0;
      this.arr.push({
        x: new Date(`${this.arrayDays[i].date}`),
        y: (num)
      });
    }
    const max = Math.max(...this.arr.map((el) => el.y));
    this.maxValue = this.transformMaxValue(max);
    this.stepSize = this.maxValue / 4;
  }

  drawSchedule(param, option, percent) {
    if (param === 'totalConfirmed') {
      this.color = 'rgb(255, 99, 132)';
    } else if (param === 'totalDeaths') {
      this.color = 'rgb(194, 10, 10)';
    } else {
      this.color = 'rgb(41, 181, 20)';
    }

    if (option === 'cumulative') {
      this.type = 'bubble';
    } else this.type = 'bar';
    this.arr = [];
    if (percent === 'absolute') this.convertCases(param, option);
    else this.convertAbsoluteCases(param, option);
    const chartConfig = {
      type: this.type,
      data: {
        datasets: [{
          backgroundColor: this.color,
          borderColor: this.color,
          barThickness: 2,
          data: this.arr
        }]
      },
      options: {
        responsive: true,
        legend: false,
        tooltips: {
          callbacks: {
            label(tooltipItem) {
              let label = '';
              if (option === 'cumulative') {
                label += `${tooltipItem.xLabel}:${tooltipItem.yLabel}`;
              } else {
                label += tooltipItem.yLabel;
              }
              return label;
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: this.stepSize,
              max: this.maxValue,
              callback(value) {
                const ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'k' }
                ];
                function formatNumber(n) {
                  for (let i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (n / ranges[i].divider).toString() + ranges[i].suffix;
                    }
                  }
                  return n;
                }
                return `${formatNumber(value)}`;
              }
            },
            gridLines: {
              borderDash: [5, 5],
              color: 'rgba(255, 255, 255, .1)',
              zeroLineColor: 'rgba(255, 255, 255, .1)'
            }
          }],
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: { month: 'MMM' },
              tooltipFormat: 'MM/DD/YY',
              unit: 'month'
            },
            ticks: {
              beginAtZero: true,
              stepSize: 100
            },
            gridLines: {
              borderDash: [5, 5],
              zeroLineWidth: 0.8,
              zeroLineBorderDash: [5, 5],
              color: 'rgba(255, 255, 255, .1)',
              zeroLineColor: 'rgba(255, 255, 255, .1)'
            }
          }]
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      }
    };
    if (this.chart) this.chart.destroy();
    Chart.defaults.global.defaultFontColor = 'rgba(255,255,255,.7)';
    this.chart = new Chart(this.ctx, chartConfig);
  }
}

export default Schedule;
