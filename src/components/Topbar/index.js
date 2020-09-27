import React from 'react'
import classnames from 'classnames'

import s from './Topbar.module.scss'

class Topbar extends React.Component {
    render() {
        const { className, userName, onClickLogout, toggleSideBar } = this.props
        const cx = classnames(s.container, className)

        return (
            <div className={cx}>
                <div
                    className="sidebar-toggle d-lg-none"
                    onClick={toggleSideBar}>
                    <span className="material-icons">menu</span>
                </div>
                <div className="flex-1" />
                <div className="profile mr-1">{userName}</div>
                <div className="btn btn-dark mr-1" onClick={onClickLogout}>
                    Logout
                </div>
            </div>
        )
    }
}

export default Topbar
