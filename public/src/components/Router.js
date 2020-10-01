/* **************************************************** MODULES *********************************************************** */
import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
/* **************************************************** COMPONENTS *********************************************************** */
import Main from './Main'
/* **************************************************** ROUTES *********************************************************** */
function Router() {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Main} />
            </Switch>
        </BrowserRouter>
    )
}

export default connect()(Router)