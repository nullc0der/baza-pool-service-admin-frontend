import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Sidebar from 'components/Sidebar'
import Topbar from 'components/Topbar'

import Auth from 'utils/authHelpers'

import dashRoutes from './dashRoutes'

import './Dashboard.scss'

class Dashboard extends React.Component {
    state = {
        sideBarIsOpen: window.screen.width > 1024 ? true : false,
    }

    toggleSideBar = () => {
        this.setState({
            sideBarIsOpen: !this.state.sideBarIsOpen,
        })
    }

    render() {
        const { userName } = this.props
        return Auth.isAuthenticated() && Auth.isTokenNotExpired() ? (
            <div className="dashboard">
                <Sidebar
                    isOpen={this.state.sideBarIsOpen}
                    toggleSideBar={this.toggleSideBar}
                />
                <Topbar
                    userName={userName}
                    onClickLogout={Auth.logout}
                    toggleSideBar={this.toggleSideBar}
                />
                <div className="content">{dashRoutes(this.props.location)}</div>
            </div>
        ) : (
            <Redirect to="/" />
        )
    }
}

const mapStateToProps = state => ({
    userName: state.Auth.userName,
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
