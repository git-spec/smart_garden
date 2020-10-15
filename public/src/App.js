import React from 'react';
import {Container} from 'reactstrap';
// import '../public/css/style.css';
import Router from './components/Router';

function App() {
    return (
        <Router>
            <Container>
                Hello!
            </Container>
        </Router>
    );
}

export default App;