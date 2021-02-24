import React from 'react';
import Chart from 'chart.js';

// chart style options
Chart.defaults.global.defaultFontFamily = "Ubuntu";
Chart.defaults.global.legend.display = false;
Chart.defaults.global.defaultFontColor = 'white';

class BarChartHorizontal extends React.Component {
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
                            borderWidth: .5
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
                            borderWidth: .5
                        }
                    ]
                }
            },
            data: {
                labels: this.props.data.map(d => d.label),
                datasets: [{
                    label: this.props.title,
                    data: this.props.data.map(d => d.value),
                    fill: 'none',
                    backgroundColor: this.props.color,
                    pointRadius: 2,
                    borderColor: 0,
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

export default BarChartHorizontal;