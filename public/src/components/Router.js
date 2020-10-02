/* **************************************************** MODULES *********************************************************** */
import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
// import {connect} from 'react-redux'
/* **************************************************** COMPONENTS *********************************************************** */
import Main from './Main'
// import Register from './Register'
// import Login from './Login'
// import User from './User'
import Products from './Products'
/* **************************************************** ROUTES *********************************************************** */
function Router() {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Main} />
                {/* <Route path='/register' exact component={Register} />
                <Route path='/login' exact component={Login} />
                <Route path='/user' exact component={User} /> */}
                <Route path='/products' exact component={Products} />
            </Switch>
        </BrowserRouter>
    )
}

// export default connect()(Router)
export default Router