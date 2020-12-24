/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, Component} from 'react';
// reactstrap
import {Table} from 'reactstrap';
// components
import LineChart from '../LineChart';
// services
import {deviceLightDataPost} from '../../services/productsApi';
import {capitalizeName} from '../../services/capitalizeName';
// icons
import { ReactComponent as Light } from '../../imgs/light.svg';

/* ********************************************************* COMPONENT ********************************************************* */
class MonitorLight extends Component {

    state = {
        data: [],
        deviceID: null
    }

    componentDidMount() {
        deviceLightDataPost(this.props.device.id).then(results => {
            const data = results.map(result => {return {value : Number(result.value), time: new Date(result.time)}})
            this.setState({data: data, deviceID: this.props.device.id})
        })
    }
    componentDidUpdate() {
        if(this.props.device.id !== this.state.deviceID) {
            deviceLightDataPost(this.props.device.id).then(results => {
                const data = results.map(result => {return {value : Number(result.value), time: new Date(result.time)}})
                this.setState({data: data, deviceID: this.props.device.id})
            })    
        }
    }

/* ********************************************************* RENDER ********************************************************* */
    render() {
        let chart = null
        if (this.state.data.length) {
            chart = (
                <LineChart
                    data={this.state.data}
                    title={this.props.device.name}
                    color="rgb(0, 168, 230)"
                    min="10"
                    max="100"
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">
                                {capitalizeName(this.props.device.device_name)}
                                <Light width='1rem' height='1.2rem' stroke='#241B12' className="light ml-2" />
                            </th>
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
        );
    }
}

/* ********************************************************* EXPORT ********************************************************* */
export default MonitorLight;
