import React from 'react';
import Chart from 'chart.js';

// chart stlye options
Chart.defaults.global.defaultFontFamily = "Ubuntu";
Chart.defaults.global.legend.display = false;
Chart.defaults.global.defaultFontColor = 'white';

class LineChartMultiple extends React.Component {
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
      data: {
          datasets: [{
              data: [20, 50, 100, 75, 25, 0],
              label: 'Left dataset',
  
              // This binds the dataset to the left y axis
              yAxisID: 'left-y-axis',
              fill: 'none',
              backgroundColor: 0,
              pointRadius: 2,
              borderColor: this.props.color,
              borderWidth: 1,
              lineTension: 0
          }, {
              data: [0.1, 0.5, 1.0, 2.0, 1.5, 0],
              label: 'Right dataset',
  
              // This binds the dataset to the right y axis
              yAxisID: 'right-y-axis',
              fill: 'none',
              backgroundColor: 0,
              pointRadius: 2,
              borderColor: 'red',
              borderWidth: 1,
              lineTension: 0
          }],
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      options: {
          scales: {
              yAxes: [{
                  id: 'left-y-axis',
                  type: 'linear',
                  position: 'left',
                  gridLines: {
                    color: 'rgba(255, 255, 255, .5)'
                  },
                  drawBorder: true,
                  borderWidth: .5
              }, {
                  id: 'right-y-axis',
                  type: 'linear',
                  position: 'right'
              }],
              xAxes: [{
                ticks: {
                  min: 0,
                  padding: 10
                },
                type: 'time',
                time: {
                  unit: 'week'
                },
                gridLines: {
                  color: 'rgba(255, 255, 255, .5)'
                },
                drawBorder: true,
                borderWidth: .5
              }]
          }
        }
    });
  };
  
  render() {
    return <canvas ref={this.chartRef} />;
  }
}

export default LineChartMultiple;