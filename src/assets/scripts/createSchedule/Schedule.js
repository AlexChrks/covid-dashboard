import Chart from './Chart.bundle.min.js';

class Schedule {
  constructor(arrayDays, ctx) {
    this.arrayDays = arrayDays;
    this.ctx = ctx;
  }

  set setArr(val) {
    this.arrayDays = val;
  }

  convert(param) {
    for (let i = 1; i < this.arrayDays.length; i++) {
      this.arr.push({
        x: new Date(`${this.arrayDays[i].date}`),
        y: (this.arrayDays[i][param] - this.arrayDays[i - 1][param])
      });
    }
  }

  drawSchedule(param = 'totalConfirmed') {
    if (param === 'totalConfirmed') {
      this.maxValue = 2000000;
      this.stepSize = 500000;
    } else if (param === 'totalDeaths') {
      this.maxValue = 20000;
      this.stepSize = 5000;
    } else {
      this.maxValue = 750000;
      this.stepSize = 250000;
    }
    this.arr = [];
    this.convert(param);
    const chartConfig = {
      type: 'bar',
      data: {
        datasets: [{
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          barThickness: 2,
          data: this.arr
        }]
      },
      options: {
        responsive: true,
        legend: false,
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
