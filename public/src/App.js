import React, {Fragment} from 'react';
import Navigation from './components/Navigation';
import Router from './components/Router';

function App() {
  return (
    <Fragment>
      <div className="cover"></div>
      <Navigation />
      <Router />
    </Fragment>
  );
}

export default App;