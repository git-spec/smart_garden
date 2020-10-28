import React from 'react';
import Chart from 'chart.js';

// chart stlye options
Chart.defaults.global.defaultFontFamily = "Ubuntu";
Chart.defaults.global.legend.display = false;
Chart.defaults.global.defaultFontColor = 'white';

class LineChart extends React.Component {
    constructor(props) {
      super(props);
      this.chartRef = React.createRef();
    }
  
    componentDidUpdate() {
      this.myChart.data.labels = this.props.data.map(d => d.time);
      this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
      this.myChart.update();
    }
  
    componentDidMount() {
      this.myChart = new Chart(this.chartRef.current, {
        type: 'line',
        options: {
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'week'
                },
                gridLines: {
                  color: 'rgba(255, 255, 255, .5)'
                },
                drawBorder: true,
                borderWidth: .5
              }
            ],
            yAxes: [
              {
                ticks: {
                  min: 0
                },
                gridLines: {
                  color: 'rgba(255, 255, 255, .5)'
                },
                borderWidth: .5
              }
            ]
          }
        },
        data: {
          labels: this.props.data.map(d => d.time),
          datasets: [{
            label: this.props.title,
            data: this.props.data.map(d => d.value),
            fill: 'none',
            backgroundColor: 0,
            pointRadius: 2,
            borderColor: this.props.color,
            borderWidth: 1,
            lineTension: 0
          }]
        }
      });
    }
  
    render() {
      return <canvas ref={this.chartRef} />;
    }
  }

  export default LineChart;