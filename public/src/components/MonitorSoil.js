// react
import React, {Fragment, Component} from 'react';
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

class MonitorSoil extends Component {

    data = getData();

    // console.log('data: ', this.props.data);

    render() {
        return (
            <Fragment>
                {/* <h3 className="text-center">{this.props.title}</h3> */}
                <Table borderless size="sm" className="mb-5">
                    <thead>
                        <tr>
                            <th className="align-bottom"><h3 className="mb-0">{this.props.hub}</h3></th>
                            <th><i className="fas fa-tint mr-2 mb-2"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">{this.props.device}</th>
                            <td>50%</td>
                            {/* <td>{this.props.data[0]}%</td> */}
                        </tr>
                    </tbody>
                </Table>
                <LineChart data={this.data[0].data} title={this.data[0].title} color="rgb(0, 168, 230)" />
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

export default MonitorSoil;