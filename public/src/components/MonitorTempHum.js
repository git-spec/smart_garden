/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Component, Fragment} from 'react';
// reactstrap
import {Table} from 'reactstrap';
// components
import LineChartMultiple from './LineChartMultiple';
// services
import {deviceTempHumDataPost} from '../services/productsApi';

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
                            <th scope="row">temperature</th>
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
                            <th scope="row">humidity</th>
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

export default MonitorTempHum;