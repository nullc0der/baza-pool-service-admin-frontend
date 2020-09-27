import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

import poolServiceLogo from 'assets/images/logo.svg'
import s from './Sidebar.module.scss'

const MENU_ITEMS = [
    {
        name: 'Current Session',
        link: '/dashboard/session/current',
    },
    {
        name: 'Next Session',
        link: '/dashboard/session/next',
    },
    {
        name: 'Past Sessions',
        link: '/dashboard/sessions/past',
    },
]

class Sidebar extends React.Component {
    render() {
        const { className, isOpen, toggleSideBar } = this.props
        const cx = classnames(s.container, className, { 'is-open': isOpen })

        return (
            <div className={cx}>
                <div className="sidebar-content">
                    <div className="header">
                        <img
                            src={poolServiceLogo}
                            alt="Pool Service Logo"
                            className="img-fluid logo-image"
                        />
                        <h5>Baza Pool Service</h5>
                    </div>
                    <div className="menu">
                        {MENU_ITEMS.map((x, i) => (
                            <Link key={i} className="menu-item" to={x.link}>
                                {x.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div
                    className="sidebar-backdrop d-lg-none"
                    onClick={toggleSideBar}
                />
            </div>
        )
    }
}

export default Sidebar
