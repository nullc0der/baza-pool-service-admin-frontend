import React from 'react'
import { Switch, Route } from 'react-router-dom'

import SessionPage from 'pages/Session'

const dashRoutes = location => (
    <Switch location={location}>
        <Route path="/dashboard/session/:sessionname" component={SessionPage} />
    </Switch>
)

export default dashRoutes
