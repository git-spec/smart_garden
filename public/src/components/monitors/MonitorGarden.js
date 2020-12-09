/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment} from 'react';
// reactstrap
import {Table} from 'reactstrap';

/* ********************************************************* COMPONENT ********************************************************* */
const MonitorGarden = props => {

    return (
        <Fragment>
            <h3 className="text-center">garden</h3>
            <Table style={{tableLayout: "fixed"}} borderless size="sm" className="mb-4">
                <thead>
                    <tr>
                        <th className="align-bottom text-uppercase">Devices</th>
                        <th><i className="fas fa-thermometer-half mr-2 mb-2"></i></th>
                        <th><i className="fas fa-cloud mr-2 mb-2"></i></th>
                        <th><i className="fas fa-tint mr-2 mb-2"></i></th>
                        <th><i className="fas fa-lightbulb mr-2 mb-2"></i></th>
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
