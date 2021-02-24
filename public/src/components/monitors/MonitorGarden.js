/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment} from 'react';
// reactstrap
import {Table} from 'reactstrap';
// icons
import { ReactComponent as Humidity } from '../../imgs/humidity.svg';
import { ReactComponent as Temperature } from '../../imgs/temperature.svg';
import { ReactComponent as Moisture } from '../../imgs/soil_moisture.svg';
import { ReactComponent as Light } from '../../imgs/light.svg';

/* ********************************************************* COMPONENT ********************************************************* */
const MonitorGarden = props => {

    return (
        <Fragment>
            <h3 className="text-center">garden</h3>
            <Table style={{tableLayout: "fixed"}} borderless size="sm" className="mb-4">
                <thead>
                    <tr>
                        <th className="align-bottom text-uppercase">Devices</th>
                        <th className="align-top">
                            <Temperature width='1rem' height='1.2rem' stroke='#241B12' className="temperature" />
                        </th>
                        <th className="align-top">
                            <Humidity width='1.4rem' height='1.1rem' stroke='#241B12' className="humidity" />
                        </th>
                        <th className="align-top">
                            <Moisture width='0.8rem' height='1.2rem' stroke='#241B12' className="moisture" />
                        </th>
                        <th className="align-top">
                            <Light width='1rem' height='1.2rem' stroke='#241B12' className="light" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">tomatoes</th>
                        <td>17°</td>
                        <td>39%</td>
                        <td>62%</td>
                        <td>71%</td>
                    </tr>
                </tbody>
            </Table>
        </Fragment>
    )    
}

/* ********************************************************* EXPORT ********************************************************* */
export default MonitorGarden;
