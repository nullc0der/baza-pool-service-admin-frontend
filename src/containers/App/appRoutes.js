import React from 'react'
import { Switch, Route } from 'react-router-dom'

import LoginPage from 'pages/Login'
import Dashboard from 'containers/Dashboard'

const appRoutes = location => (
    <Switch location={location}>
        <Route path="/" exact component={LoginPage} />
        <Route path="/dashboard" component={Dashboard} />
    </Switch>
)

export default appRoutes
