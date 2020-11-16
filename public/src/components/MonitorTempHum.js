// react
import React, {Component, Fragment} from 'react';
// reactstrap
import {
    // Input,
    // Label,
    // FormGroup,
    Table
} from 'reactstrap';
// components
import LineChart from './LineChart';
// import LineChartMultiple from './LineChartMultiple';
// import BarChartHorizontal from './BarChartHorizontal';
// services
import {getData} from '../services/getData';

class MonitorTempHum extends Component {

    data = getData();

    render() {
        return (
            <Fragment>
                {/* <h3 className="text-center">{this.props.title}</h3> */}
                {/* title: "cactus", data: {Temperature: "21", Humidity: "61"} */}
                <Table borderless size="sm" className="mb-5">
                    <thead>
                        <tr>
                            <th className="align-bottom"><h3 className="mb-0">{this.props.hub}</h3></th>
                            <th><i className="fas fa-thermometer-half mr-2 mb-2"></i></th>
                            <th><i className="fas fa-cloud mr-2 mb-2"></i></th>
                            {/* <th><i className="fas fa-tint mr-2 mb-2"></i></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">{this.props.device}</th>
                            {/* <td>{this.props.data[1]}°</td>
                            <td>{this.props.data[0]}%</td> */}
                            <td>
                                {this.props.connected
                                    ? this.props.data[1]
                                        ? this.props.data[1] + '°'
                                        : 'loading'
                                    : 'not connected'}
                            </td>
                            <td>
                                {this.props.connected
                                    ? this.props.data[0]
                                        ? this.props.data[0] + '%'
                                        : 'loading'
                                    : 'not connected'}
                            </td>
                        </tr>
                        {/* <tr>
                            <th scope="row">chives</th>
                            <td>27°</td>
                            <td>58%</td>
                            <td>74%</td>
                        </tr>
                        <tr>
                            <th scope="row">basil</th>
                            <td>24°</td>
                            <td>48%</td>
                            <td>56%</td>
                        </tr> */}
                    </tbody>
                </Table>
                <LineChart data={this.data[0].data} title={this.data[0].title} color="rgb(0, 168, 230)" min="20" max="160" />
                {/* <LineChartMultiple data={data[0].data} title={data[0].title} color="rgb(0, 168, 230)" /> */}
                {/* <BarChartHorizontal data={data[3].data} title={data[3].title} color="rgb(0, 168, 230)" /> */}
                {/* <FormGroup>
                    <Label for="rangeInput">Range</Label>
                    <Input
                        type="range"
                        id="rangeInput"
                        name="rangeInput"
                        min="0"
                        max="100"
                        // onInput="this.output.amount.value=this.value"
                    />
                    <output name="amount" id="amount" htmlFor="rangeInput">
                        0
                    </output>
                </FormGroup> */}
            </Fragment>
        )
    }
};

export default MonitorTempHum;