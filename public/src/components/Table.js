import React from 'react';
import {Table} from 'reactstrap';

const ReactTable = (props) => {

    return (
        <Table borderless size="sm" className="mb-5">
            <thead>
                <tr>
                    <th className="align-bottom"><h3 className="mb-0">{props.hub}</h3></th>
                    <th><i className="fas fa-thermometer-half mr-2 mb-2"></i></th>
                    <th><i className="fas fa-cloud mr-2 mb-2"></i></th>
                    {/* <th><i className="fas fa-tint mr-2 mb-2"></i></th> */}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">{props.device}</th>
                    <td>{props.data[1]}°</td>
                    <td>{props.data[0]}%</td>
                    {/* <td>34%</td> */}
                </tr>
                {/* <tr>
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
                </tr> */}
            </tbody>
        </Table>
    );
}

export default ReactTable;