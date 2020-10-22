import React from 'react'
import { Switch, Route } from 'react-router-dom'

import SessionPage from 'pages/Session'
import PastSessionPage from 'pages/Session/PastSessions'

const dashRoutes = location => (
    <Switch location={location}>
        <Route
            path="/dashboard/session/:sessionname"
            exact
            component={SessionPage}
        />
        <Route
            path="/dashboard/sessions/past"
            exact
            component={PastSessionPage}
        />
    </Switch>
)

export default dashRoutes
