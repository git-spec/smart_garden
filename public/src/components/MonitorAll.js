// react
import React, {Fragment} from 'react';
// reactstrap
import {
    Input,
    Label,
    FormGroup,
    Table
} from 'reactstrap';
// components
import LineChart from './LineChart';
// import LineChartMultiple from './LineChartMultiple';
import BarChartHorizontal from './BarChartHorizontal';
// services
import {getData} from '../services/getData';

const MonitorAll = props => {

    const data = getData();

    return (
        <Fragment>
            {/* <h3 className="text-center">{props.title}</h3> */}
            <Table borderless size="sm" className="mb-5">
                <thead>
                    <tr>
                        <th className="align-bottom"><h3 className="mb-0">kitchen</h3></th>
                        <th><i className="fas fa-thermometer-half mr-2 mb-2"></i></th>
                        <th><i className="fas fa-cloud mr-2 mb-2"></i></th>
                        <th><i className="fas fa-tint mr-2 mb-2"></i></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">tomato</th>
                        <td>23°</td>
                        <td>54%</td>
                        <td>34%</td>
                    </tr>
                    <tr>
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
                    </tr>
                </tbody>
            </Table>
            <LineChart data={data[0].data} title={data[0].title} color="rgb(0, 168, 230)" />
            {/* <LineChartMultiple data={data[0].data} title={data[0].title} color="rgb(0, 168, 230)" /> */}
            <BarChartHorizontal data={data[3].data} title={data[3].title} color="rgb(0, 168, 230)" />
            <FormGroup>
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
            </FormGroup>
        </Fragment>
    )
};

export default MonitorAll;
