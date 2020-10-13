import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import get from 'lodash/get'
import store from 'store'

import Auth from 'utils/authHelpers'
import { actions as authActions } from 'store/Auth'

import s from './Login.module.scss'
import poolServiceLogo from 'assets/images/logo.svg'

import TextInput from 'components/TextInput'
import EnhancedPasswordField from 'components/EnhancedPasswordField'

class LoginPage extends React.Component {
    state = {
        inputState: {
            username: '',
            password: '',
        },
        loginSuccess: false,
        errorState: {
            username: null,
            password: null,
            nonField: null,
        },
    }

    componentDidMount() {
        if (Auth.isAuthenticated() && Auth.isTokenNotExpired()) {
            this.setState({
                loginSuccess: true,
            })
        }
    }

    onInputChange = (id, value) => {
        this.setState(prevState => ({
            inputState: {
                ...prevState.inputState,
                [id]: value,
            },
        }))
    }

    onLoginClick = e => {
        e.preventDefault()
        const { authenticateUser } = this.props
        const { username, password } = this.state.inputState
        const login = Auth.login(username, password)
        login
            .then(response => {
                if (response.ok) {
                    authenticateUser(
                        response.data.token,
                        response.data.expiry,
                        response.data.username
                    )
                    localStorage.setItem(
                        'auth',
                        JSON.stringify({ Auth: store.getState().Auth })
                    )
                    this.setState({
                        loginSuccess: true,
                        errorState: {
                            username: null,
                            password: null,
                            nonField: null,
                        },
                    })
                }
            })
            .catch(responseData => {
                this.setState({
                    errorState: {
                        username: get(responseData, 'username', null),
                        password: get(responseData, 'password', null),
                        nonField: get(responseData, 'non_field_errors', null),
                    },
                })
            })
    }

    render() {
        const cx = classnames(s.container)
        const loginRedirectURL = '/dashboard/session/current'

        return !this.state.loginSuccess ? (
            <div className={cx}>
                <div className="login-form-wrapper">
                    <div className="d-flex flex-column align-items-center">
                        <img
                            src={poolServiceLogo}
                            alt="Pool Service Logo"
                            className="img-fluid logo-image mb-2"
                        />
                        <h5 className="mb-3">Baza Pool Services</h5>
                    </div>
                    <form className="login-form" onSubmit={this.onLoginClick}>
                        <TextInput
                            id="username"
                            label="Username"
                            className="mb-3"
                            icon={<i className="material-icons">person</i>}
                            value={this.state.inputState.username}
                            onChange={this.onInputChange}
                            errorState={this.state.errorState.username}
                        />
                        <EnhancedPasswordField
                            id="password"
                            label="Password"
                            className="mb-3"
                            icon={
                                <i className="material-icons">lock_outline</i>
                            }
                            value={this.state.inputState.password}
                            onChange={this.onInputChange}
                            errorState={this.state.errorState.password}
                        />
                        {!!this.state.errorState.nonField && (
                            <div className="alert alert-danger">
                                {this.state.errorState.nonField.map((x, i) => (
                                    <p
                                        className={`${i === 0 ? 'mb-0' : ''}`}
                                        key={i}>
                                        {x}
                                    </p>
                                ))}
                            </div>
                        )}
                        <button
                            className="btn btn-block btn-dark mt-2"
                            onClick={this.onLoginClick}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        ) : (
            <Redirect to={loginRedirectURL} />
        )
    }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    authenticateUser: (authToken, expiresIn, userName) =>
        dispatch(authActions.authenticateUser(authToken, expiresIn, userName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
