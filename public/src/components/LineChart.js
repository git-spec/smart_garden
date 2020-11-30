import React from 'react';
import Chart from 'chart.js';

// chart style options
Chart.defaults.global.defaultFontFamily = "Ubuntu";
Chart.defaults.global.legend.display = false;
Chart.defaults.global.defaultFontColor = 'white';

class LineChart extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            fontsize: null
        }
        this.chartRef = React.createRef();
    }

    // get timestamp for labels and dataset from props
    componentDidUpdate() {
        this.myChart.data.labels = this.props.data.map(d => d.time);
        this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
        this.myChart.update();
    }

    componentDidMount() {
        // get canvas
        const myChartRef = this.chartRef.current.getContext("2d");
        // const {height: graphHeight} = myChartRef.canvas;
        // set gradient line
        let gradientLine = myChartRef.createLinearGradient(0, this.props.min, 0, this.props.max);
        gradientLine.addColorStop(0, "rgb(255, 0, 0)");
        gradientLine.addColorStop(.2, "rgb(0, 122, 167)");
        gradientLine.addColorStop(.8, "rgb(0, 122, 167)");
        gradientLine.addColorStop(1, "rgb(255, 0, 0)");
        // create chart
        this.myChart = new Chart(myChartRef, {
            type: 'line',
            options: {
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                min: 0,
                                padding: 10,
                                fontSize: this.props.chartData.fontSize,
                                fontColor: 'rgb(29, 44, 34)'

                            },
                            type: 'time',
                            time: {
                                unit: 'day'
                            },
                            gridLines: {
                                color: 'rgba(29, 44, 34, .3)'
                            },
                            drawBorder: true,
                            borderWidth: .5
                        }
                    ],
                    yAxes: [
                        {
                            ticks: {
                                min: 0,
                                padding: 10,
                                fontSize: this.props.chartData.fontSize,
                                fontColor: 'rgb(29, 44, 34)'
                            },
                            gridLines: {
                                color: 'rgba(29, 44, 34, .3)'
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
                    pointRadius: this.props.chartData.pointRadius,
                    borderColor: gradientLine,
                    borderWidth: 1,
                    lineTension: 0
                }]
            },
            plugins: {
                indexlabels: {
                    fontSize: function (context) {
                        var width = context.chart.width;
                        var size = Math.round(width / 32);
                        return {
                            size: size
                        };
                    }
                }
            }
        });
    }

    render() {
        return (
            <div className="lineGraph">
                <canvas ref={this.chartRef} />
            </div>
        );
    }
}

export default LineChart;