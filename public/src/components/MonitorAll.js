// react
import React, {Fragment} from 'react';
// components
import LineChart from './LineChart';
// import LineChartMultiple from './LineChartMultiple';
import BarChartHorizontal from './BarChartHorizontal';
import Table from './Table';
// services
import {getData} from '../services/getData';

const MonitorAll = props => {

    const data = getData();

    return (
        <Fragment>
            <h3 className="text-center">title</h3>
            <Table />
            <LineChart data={data[0].data} title={data[0].title} color="rgb(0, 168, 230)" min="20" max="160" />
            {/* <LineChartMultiple data={data[0].data} title={data[0].title} color="rgb(0, 168, 230)" /> */}
            <BarChartHorizontal data={data[3].data} title={data[3].title} color="rgb(0, 168, 230)" />
        </Fragment>
    )
};

export default MonitorAll;
