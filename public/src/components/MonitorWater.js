// react
import React, {Fragment, Component} from 'react';
// reactstrap
import {
    Input,
    Label,
    Table
} from 'reactstrap';
// components
// import LineChart from './LineChart';
// import LineChartMultiple from './LineChartMultiple';
// import BarChartHorizontal from './BarChartHorizontal';
// services
import {getData} from '../services/getData';


class MonitorSoil extends Component {

    data = getData();
    // console.log('data: ', this.props.data);

    constructor(props) {
        super(props);
        this.state = {
            inputRangeTime: 0,
            inputRangeDuration: 0,
            // inputRangeMax: "100",
            // graphHeightMax: 160,
            // graphHeightMin: 20
        };
        this.rangeStatusMinRef = React.createRef();
        this.rangeStatusMaxRef = React.createRef();    
    }

    onBtnInputRangeTime = (e, output) => {
        e.preventDefault();
        // output of current value
        output.current.innerText = e.target.value;
        this.setState({inputRangeTime: e.target.value});
        // send current properties to css
        output.current.style.setProperty('--thumb-input', e.target.value);
        output.current.style.setProperty('--output-width', output.current.offsetWidth + "px");
    }
    onBtnInputRangeDuration = (e, output) => {
        e.preventDefault();
        // output of current value
        output.current.innerText = e.target.value;
        this.setState({inputRangeDuration: e.target.value});
        // send current properties to css
        output.current.style.setProperty('--thumb-input', e.target.value);
        output.current.style.setProperty('--output-width', output.current.offsetWidth + "px");
    }

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
                            <td>???%</td>
                            {/* <td>{this.props.data[0]}%</td> */}
                        </tr>
                    </tbody>
                </Table>
                {/* on off button */}
                <div className="d-flex align-items-center">
                    <label className="switch">
                        <input type="checkbox" checked={this.props.status} onChange={this.props.statusChange} />
                        <span className="slider round"></span>
                    </label>
                    <span className="ml-3">waterpump: {this.props.status ? 'ON' : 'OFF'}</span>
                </div>
                {/* range 1 */}
                <div className="range mt-2 min">
                <Label for="rangeInput">time of watering: soil moisture &#60; {this.state.inputRangeTime}%</Label>
                    <output ref={this.rangeStatusMinRef} name="amount" id="amount" htmlFor="rangeInput">0</output>
                    <div>
                        <Input
                            type="range"
                            id="rangeInput"
                            name="rangeInput"
                            min="0"
                            max="100"
                            defaultValue="0"
                            // onInput= {function (e) {e.preventDefault()
                            //     this.output.amount.value=this.value}}
                            // onInput={amount.value = parseInt(this.value)}
                            onInput={e => this.onBtnInputRangeTime(e, this.rangeStatusMinRef)}
                        />
                    </div>
                    <output>100</output>
                </div>
                {/* range 2 */}
                <div className="range mt-2 max">
                    <Label for="rangeInput">duration of watering: {this.state.inputRangeDuration}s</Label>
                    <output ref={this.rangeStatusMaxRef} name="amount" id="amount" htmlFor="rangeInput">0</output>
                    <div>
                        <Input
                            type="range"
                            id="rangeInput"
                            name="rangeInput"
                            min="0"
                            max="100"
                            defaultValue="0"
                            // onInput= {function (e) {e.preventDefault()
                            //     this.output.amount.value=this.value}}
                            // onInput={amount.value = parseInt(this.value)}
                            onInput={e => this.onBtnInputRangeDuration(e, this.rangeStatusMaxRef)}
                        />
                    </div>
                    <output>100</output>
                </div>
                {/* <LineChart data={this.data[0].data} title={this.data[0].title} color="rgb(0, 168, 230)" min={this.props.min} max={this.props.max} /> */}
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