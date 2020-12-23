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
    this.scheduleInside.className = 'schedule_inside';
    this.canvas.id = 'myChart';
    this.ctx = this.canvas.getContext('2d');
    this.scheduleInside.append(this.canvas);
    this.graphWidget.append(this.scheduleInside);
    return this.graphWidget;
  }

  createSchedule(country = 'world', param = 'totalConfirmed',
    option = 'total', percent = 'absolute') {
    this.country = country;
    const arrayPromises = [];
    let newParam;
    switch (param) {
      case 'confirmed':
        newParam = 'totalConfirmed';
        break;
      case 'deaths':
        newParam = 'totalDeaths';
        break;
      case 'recovered':
        newParam = 'totalRecovered';
        break;
      default:
        newParam = param;
        break;
    }
    if (country !== 'world') {
      this.promiseHistory = CovidAPI.getCountryHistoryAlter(country)
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
    return Promise.all(arrayPromises).then((arr) => {
      [this.objCases, this.arrayDays] = arr;
      this.drawSchedule(newParam, option, percent);
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
        if (el.countryCode === this.country) {
          population = el.population;
        }
      });
    }
    for (let i = 1; i < this.arrayDays.length; i++) {
      let num;
      if (option === 'daily') {
        num = ((this.arrayDays[i][param] - this.arrayDays[i - 1][param])
          / population) * (10 ** 5);
      } else if (option === 'total') {
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
    return this.arr;
  }

  convertCases(param, option) {
    for (let i = 1; i < this.arrayDays.length; i++) {
      let num;
      if (option === 'daily') {
        num = this.arrayDays[i][param] - this.arrayDays[i - 1][param];
      } else if (option === 'total') {
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
    return this.arr;
  }

  drawSchedule(param, option, percent) {
    if (param === 'totalConfirmed') {
      this.color = 'rgb(255, 99, 132)';
    } else if (param === 'totalDeaths') {
      this.color = 'rgb(194, 10, 10)';
    } else {
      this.color = 'rgb(41, 181, 20)';
    }

    if (option === 'total') {
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
        maintainAspectRatio: false,
        legend: false,
        tooltips: {
          callbacks: {
            label(tooltipItem) {
              let label = '';
              if (option === 'total') {
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
