/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, Component} from 'react';
// reactstrap
import {
    Input,
    Label,
    Table,
    // Button,
    FormGroup,
    CustomInput
} from 'reactstrap';

/* ********************************************************* COMPONENT ********************************************************* */
class MonitorWater extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputRangeTime: this.props.device.water_time,
            inputRangeDuration: this.props.device.water_duration,
            soilMoistureDevice: this.props.device.moisture_device_id,
            deviceID: null
        };
        this.rangeStatusMinRef = React.createRef();
        this.rangeStatusMaxRef = React.createRef();
    }

    componentDidMount() {
        this.rangeStatusMinRef.current.style.setProperty('--thumb-input', this.state.inputRangeTime);
        this.rangeStatusMinRef.current.style.setProperty('--output-width', this.rangeStatusMinRef.current.offsetWidth + "px");
        this.rangeStatusMaxRef.current.style.setProperty('--thumb-input', this.state.inputRangeDuration);
        this.rangeStatusMaxRef.current.style.setProperty('--output-width', this.rangeStatusMaxRef.current.offsetWidth + "px");
        this.setState({
            deviceID: this.props.device.id,
            inputRangeTime: this.props.device.water_time,
            inputRangeDuration: this.props.device.water_duration,
            soilMoistureDevice: this.props.device.moisture_device_id,
        });     
    }
    componentDidUpdate() {
        if(this.props.device.id !== this.state.deviceID) {
            this.rangeStatusMinRef.current.style.setProperty('--thumb-input', this.props.device.water_time);
            this.rangeStatusMinRef.current.style.setProperty('--output-width', this.rangeStatusMinRef.current.offsetWidth + "px");
            this.rangeStatusMaxRef.current.style.setProperty('--thumb-input', this.props.device.water_duration);
            this.rangeStatusMaxRef.current.style.setProperty('--output-width', this.rangeStatusMaxRef.current.offsetWidth + "px");  
            this.setState({
                deviceID: this.props.device.id,
                inputRangeTime: this.props.device.water_time,
                inputRangeDuration: this.props.device.water_duration,
                soilMoistureDevice: this.props.device.moisture_device_id,
            }); 
        }
    }

/* ********************************************************* EVENTS ********************************************************* */
    onBtnInputRangeTime = (e, output) => {
        e.preventDefault();
        // output of current value
        output.current.innerText = e.target.value;
        this.setState({ inputRangeTime: e.target.value });
        // send current properties to css
        output.current.style.setProperty('--thumb-input', e.target.value);
        output.current.style.setProperty('--output-width', output.current.offsetWidth + "px");
    }
    onBtnInputRangeDuration = (e, output) => {
        e.preventDefault();
        // output of current value
        output.current.innerText = e.target.value;
        this.setState({ inputRangeDuration: e.target.value });
        // send current properties to css
        output.current.style.setProperty('--thumb-input', e.target.value);
        output.current.style.setProperty('--output-width', output.current.offsetWidth + "px");
    }
    onSoilMoistureSelect = e => {
        e.preventDefault();
        this.setState({soilMoistureDevice: e.target.value});
    }

/* ********************************************************* RENDER ********************************************************* */
    render() {
        let options = null;
        if(this.props.devices){
            const soilMoistureDevices = this.props.devices.filter(device => device.hub_id === this.props.device.hub_id && device.type_id === 1)
             options = soilMoistureDevices.map(device => {
                return (
                    <option value={device.id} key={device.id}>{device.name}</option>
                )
            })
        }
        return (
            <Fragment>
                <h3 className="text-center">{this.props.hub.name}</h3>
                <Table borderless size="sm" className="mb-4">
                    <thead>
                        <tr>                            
                            <th className="align-bottom text-uppercase">{this.props.device.name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">{this.props.device.device_name}</th>
                        </tr>
                    </tbody>
                </Table>
                {/* on off button */}
                <div className="d-flex align-items-center">
                    <label className="switch">
                        <input type="checkbox" checked={this.props.device.status} onChange={this.props.statusChange} />
                        <span className="slider round"></span>
                    </label>
                    <span className="ml-3">waterpump: {this.props.device.status ? 'ON' : 'OFF'}</span>
                </div>
                {/* soil moisture selector */}
                <FormGroup>
                    {/* <Label for="soilMoistureSelect">soil moisture modules:</Label> */}
                    <CustomInput type="select" id="soilMoistureSelect" name="soilMoistureSelect" onChange={this.onSoilMoistureSelect} value={this.state.soilMoistureDevice ? this.state.soilMoistureDevice : ''}>
                        <option value="">select your module</option>
                        {options}
                    </CustomInput>
                </FormGroup>
                {/* range time */}
                <div className="range mt-2 min">
                    <Label for="rangeInput">time of watering: soil moisture &#60; {this.state.inputRangeTime}%</Label>
                    <output ref={this.rangeStatusMinRef} name="amount" id="amount" htmlFor="rangeInput">{this.state.inputRangeTime}</output>
                    <div>
                        <Input
                            type="range"
                            id="rangeInput"
                            name="rangeInput"
                            min="0"
                            max="100"
                            value={this.state.inputRangeTime}
                            onChange={e => this.onBtnInputRangeTime(e, this.rangeStatusMinRef)}
                        />
                    </div>
                    <output>100</output>
                </div>
                {/* range duration */}
                <div className="range mt-2 max">
                    <Label for="rangeInput">duration of watering: {this.state.inputRangeDuration}s</Label>
                    <output ref={this.rangeStatusMaxRef} name="amount" id="amount" htmlFor="rangeInput">{this.state.inputRangeDuration}</output>
                    <div>
                        <Input
                            type="range"
                            id="rangeInput"
                            name="rangeInput"
                            min="0"
                            max="100"
                            value={this.state.inputRangeDuration}
                            onChange={e => this.onBtnInputRangeDuration(e, this.rangeStatusMaxRef)}
                        />
                    </div>
                    <output>100</output>
                </div>
                {/* save button */}
                {/* <Button
                    outline color="secondary"
                    onClick={e => this.props.save(e, this.state.inputRangeTime, this.state.inputRangeDuration, this.state.soilMoistureDevice)}
                >
                    save
                </Button> */}
            </Fragment>
        )
    }
};

/* ********************************************************* EXPORT ********************************************************* */
export default MonitorWater;