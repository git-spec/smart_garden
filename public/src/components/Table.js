import React from 'react';
import {Table} from 'reactstrap';

const ReactTable = (props) => {
  return (
    <Table borderless size="sm" className="mb-5">
      <thead>
        <tr>
          <th className="align-bottom"><h3 className="mb-0">kitchen</h3></th>
          <th><i class="fas fa-thermometer-half"></i></th>
          <th><i class="fas fa-cloud"></i></th>
          <th><i class="fas fa-tint"></i></th>
        </tr>
      </thead>
      <tbody>
        <tr>
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
        </tr>
      </tbody>
    </Table>
  );
}

export default ReactTable;