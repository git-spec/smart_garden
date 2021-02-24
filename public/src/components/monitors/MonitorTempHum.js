/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Component, Fragment} from 'react';
// reactstrap
import {Table} from 'reactstrap';
// components
import LineChartMultiple from '../LineChartMultiple';
// services
import {deviceTempHumDataPost} from '../../services/productsApi';
// icons
import { ReactComponent as Humidity } from '../../imgs/humidity.svg';
import { ReactComponent as Temperature } from '../../imgs/temperature.svg';

/* ********************************************************* COMPONENT ********************************************************* */
class MonitorTempHum extends Component {

    state = {
        data: [],
        deviceID: null
    }
    
    componentDidMount() {
        deviceTempHumDataPost(this.props.device.id).then(results => {
            const data = [results.map(result => {return {value : Number(result.humidity), time: new Date(result.time)}}),results.map(result => {return {value : Number(result.temp), time: new Date(result.time)}})];
            this.setState({data: data, deviceID: this.props.device.id});
        })
    }
    componentDidUpdate() {
        if(this.props.device.id !== this.state.deviceID) {
            deviceTempHumDataPost(this.props.device.id).then(results => {
                const data = [results.map(result => {return {value : Number(result.humidity), time: new Date(result.time)}}),results.map(result => {return {value : Number(result.temp), time: new Date(result.time)}})];
                this.setState({data: data, deviceID: this.props.device.id});
            })
        }
    }
    // capitalize name
    capitalizeTemp() {return this.props.device.device_name.charAt(0).toUpperCase() + this.props.device.device_name.substring(1, this.props.device.device_name.indexOf(' '))};
    capitalizeHum() {return this.props.device.device_name.charAt(this.props.device.device_name.indexOf('&') + 2).toUpperCase() + this.props.device.device_name.substring(this.props.device.device_name.indexOf('&') + 3)};

/* ********************************************************* RENDER ********************************************************* */
    render() {
        let chart = null;
        if (this.state.data.length) {
            if(this.state.data[0].length)
            chart = (
                <LineChartMultiple 
                    data={this.state.data} 
                    title={this.props.device.name} 
                    color="rgb(0, 168, 230)" 
                    chartData={this.props.chartData}
                />
            )
        }
        return (
            <Fragment>
                <h3 className="text-center">{this.props.hub.name}</h3>
                <Table borderless size="sm" className="mb-5">
                    <thead>
                        <tr>
                            <th className="align-bottom text-uppercase">{this.props.device.name}</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">
                                {this.capitalizeTemp()}
                                <Temperature width='1rem' height='1.2rem' stroke='#241B12' className="temperature ml-2" />
                            </th>
                            <th></th>
                            <td>
                                {this.props.device.connected
                                    ? this.props.data[1]
                                        ? this.props.data[1] + '°'
                                        : 'loading'
                                    : 'not connected'}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                {this.capitalizeHum()}
                                <Humidity width='1.4rem' height='1.1rem' stroke='#241B12' className="humidity ml-2" />
                                </th>
                            <th></th>
                            <td>
                                {this.props.device.connected
                                    ? this.props.data[0]
                                        ? this.props.data[0] + '%'
                                        : 'loading'
                                    : 'not connected'}
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {chart}
            </Fragment>
        )
    }
};

/* ********************************************************* EXPORT ********************************************************* */
export default MonitorTempHum;