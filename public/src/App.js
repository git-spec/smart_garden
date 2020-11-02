import React, {Fragment} from 'react';
import Router from './components/Router';
// import Navigation from './components/Navigation';

function App() {
    return (
        <Fragment>
            <div className="cover"></div>
            <Router>
                {/* <Navigation /> */}
            </Router>
        </Fragment>
    );
}

export default App;