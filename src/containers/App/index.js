import React from 'react'

import './App.scss'

import appRoutes from './appRoutes'

class App extends React.Component {
    render() {
        return <div className="app-main">{appRoutes(this.props.location)}</div>
    }
}

export default App
