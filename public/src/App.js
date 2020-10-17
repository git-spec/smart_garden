import React, {Fragment} from 'react';
import Navigation from './components/Navigation';
import Router from './components/Router';

function App() {
  return (
    <Fragment>
      <div className="layer"></div>
      <Navigation />
      <div className="nav-space">
        <div className="layer layer-space"></div>
      </div>
      <Router />
    </Fragment>
  );
}

export default App;