import React, {Fragment} from 'react';
import {Table} from 'reactstrap';

const ReactTable = props => {

/*
props = {
    title: "temperatue",
    data:{
        key1: value,
        key2: value
    }
}
*/

    return (
        <Fragment>
            <h3>{props.data.title}</h3>
            <Table borderless size="sm" className="mb-5">
                <thead>
                    <tr>
                        <th></th>
                        {Object.keys(props.data.data).map((item, idx) => {
                            return <th key={idx}>{item}</th>;
                        })}
                    </tr>
                    {/* <tr>
                        <th className="align-bottom"><h3 className="mb-0"></h3></th>
                        <th><i className="fas fa-thermometer-half mr-2 mb-2"></i></th>
                        <th><i className="fas fa-cloud mr-2 mb-2"></i></th>
                        <th><i className="fas fa-tint mr-2 mb-2"></i></th>
                    </tr> */}
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        {Object.keys(props.data.data).map((item, idx) => {
                            return <td key={idx}>{props.data.data[item]}</td>;
                        })}
                    </tr>
                    {/* <tr>
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
                    </tr> */}
                </tbody>
            </Table>
        </Fragment>
    );
};

export default ReactTable;
