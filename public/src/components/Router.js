/* **************************************************** MODULES *********************************************************** */
import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
// import {connect} from 'react-redux'
/* **************************************************** COMPONENTS *********************************************************** */
import Main from './Main'
import Register from './Register'
import Login from './Login'
import Verification from './Verification'
import Hubs from './Hubs'
import Devices from './Devices'
import resetPass from './ResetPass'
import resetPage from './ResetPage'

/* **************************************************** ROUTES *********************************************************** */
function Router() {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Main} />
                <Route path='/register' exact component={Register} />
                <Route path='/login' exact component={Login} />
                <Route path='/verify/:email' exact component={Verification} />
                <Route path='/resetPass' exact component={resetPass} />
                <Route path='/reset/:id/:email' exact component={resetPage} />
                <Route path='/hubs' exact component={Hubs} />
                <Route path="/hub/:id" exact component={Devices} />
            </Switch>
        </BrowserRouter>
    )
}

// export default connect()(Router)
export default Router