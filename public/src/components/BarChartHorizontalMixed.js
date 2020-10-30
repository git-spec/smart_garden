import React from 'react';
import Chart from 'chart.js';

// chart stlye options
Chart.defaults.global.defaultFontFamily = "Ubuntu";
Chart.defaults.global.legend.display = false;
Chart.defaults.global.defaultFontColor = 'white';

class BarChartHorizontalMixed extends React.Component {
    constructor(props) {
      super(props);
      this.chartRef = React.createRef();
    }
  
    componentDidUpdate() {
      this.myChart.data.labels = this.props.data.map(d => d.label);
      this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
      this.myChart.update();
    }
  
    componentDidMount() {
      this.myChart = new Chart(this.chartRef.current, {
        type: 'horizontalBar',
        data: {
          labels: this.props.data.map(d => d.label),
          datasets: [{
              label: this.props.title,
              data: this.props.data.map(d => d.value),
              backgroundColor: this.props.color,
              pointRadius: 2,
              borderColor: 0,
              borderWidth: 1,
              lineTension: 0
          }]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  min: 0,
                  padding: 10
                },
                gridLines: {
                  color: 'rgba(255, 255, 255, .5)'
                },
                drawBorder: true,
                borderWidth: .5,
                stacked:true
              }
            ],
            yAxes: [
              {
                ticks: {
                  min: 0,
                  padding: 10
                },
                gridLines: {
                  color: 'rgba(255, 255, 255, .5)'
                },
                drawBorder: true,
                borderWidth: .5,
                stacked:true
              }
            ]
          }
        }
      });
    }
  
    render() {
      return <canvas ref={this.chartRef} />;
    }
  }

  export default BarChartHorizontalMixed;