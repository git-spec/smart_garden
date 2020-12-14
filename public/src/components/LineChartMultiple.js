/* ********************************************************* IMPORT ********************************************************* */
import React from 'react';
import Chart from 'chart.js';

/* ******************************************************** CHART STYLE OPTIONS ********************************************************* */
Chart.defaults.global.defaultFontFamily = "Ubuntu";
Chart.defaults.global.legend.display = false;
Chart.defaults.global.defaultFontColor = 'white';

/* ******************************************************** COMPONENT ********************************************************* */
// Generates a multiple line chart, which in our case is used to display the daily average values 
// of the sensors for temperature and humidity at the same time.
class LineChartMultiple extends React.Component {

    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        // get canvas
        const myChartRef = this.chartRef.current.getContext("2d");
        // set gradient line
        let gradientLine = myChartRef.createLinearGradient(0, 0, 0, 100);
        gradientLine.addColorStop(0, "rgb(255, 0, 0)");
        gradientLine.addColorStop(.2, "rgb(0, 168, 230)");
        gradientLine.addColorStop(.8, "rgb(0, 168, 230)");
        gradientLine.addColorStop(1, "rgb(255, 0, 0)");
        const hData = this.props.data[0].map(d => d.value);
        const tData = this.props.data[1].map(d => d.value);
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
                    label: 'humidity',
                    data: hData,
                    fill: 'none',
                    backgroundColor: 0,
                    pointRadius: this.props.chartData.pointRadius,
                    borderColor: gradientLine,
                    borderWidth: 1,
                    lineTension: 0
                },
                {
                    label: 'temperature',
                    data: tData,
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
        this.myChart.data.labels = this.props.data[0].map(d => d.time);
        this.myChart.update();
    }

/* ******************************************************** RENDER ********************************************************* */
    render() {
        return <canvas ref={this.chartRef} />;
    }
}

/* ********************************************************* EXPORT ********************************************************* */
export default LineChartMultiple;