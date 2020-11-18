// react
import React, {Fragment} from 'react';
// reactstrap
import {Table} from 'reactstrap';


const MonitorHomeOffice = props => {

    return (
        <Fragment>
            <h3 className="text-center">home office</h3>
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
                        <th scope="row">cactus</th>
                        <td>21°</td>
                        <td>54%</td>
                        <td>37%</td>
                        <td>52%</td>
                    </tr>
                </tbody>
            </Table>
        </Fragment>
    )    
}

export default MonitorHomeOffice;
