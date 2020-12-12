import Chart from './Chart.bundle.min.js';

class Schedule {
  constructor(ctx) {
    this.ctx = ctx;
  }

  set setArr(val) {
    this.arrayDays = val;
  }

  convertDaily(param, option) {
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
    this.maxValue = Math.ceil(Math.max(...this.arr.map((el) => el.y)) / 10) * 15;
    this.stepSize = this.maxValue / 3;
  }

  drawSchedule(param, option = 'daily') {
    if (param === 'totalConfirmed') this.color = 'rgb(255, 99, 132)';
    else if (param === 'totalDeaths') this.color = 'rgb(194, 10, 10)';
    else this.color = 'rgb(41, 181, 20)';
    if (option === 'daily') this.type = 'bar';
    else if (option === 'cumulative') this.type = 'bubble';
    this.arr = [];
    this.convertDaily(param, option);
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
        interaction: {
          mode: 'x'
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
