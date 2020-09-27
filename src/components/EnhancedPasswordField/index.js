import React from 'react'
import classnames from 'classnames'

import TextInput from 'components/TextInput'

import s from './EnhancedPasswordField.module.scss'

class EnhancedPasswordField extends React.Component {
    state = {
        passwordShown: false
    }

    togglePasswordVisibility = () => {
        this.setState({
            passwordShown: !this.state.passwordShown
        })
    }

    render() {
        const {
            className,
            id,
            label = false,
            icon = false,
            errorState = null,
            value,
            onChange
        } = this.props
        const cx = classnames(s.container, className)
        return (
            <div className={cx}>
                <TextInput
                    id={id}
                    value={value}
                    onChange={onChange}
                    type={this.state.passwordShown ? 'text' : 'password'}
                    label={label}
                    icon={icon}
                    errorState={errorState}
                />
                <div
                    className="password-visibility-toggle"
                    onClick={this.togglePasswordVisibility}>
                    <i
                        className={`fas fa-${
                            this.state.passwordShown ? 'eye-slash' : 'eye'
                        }`}
                    />
                </div>
            </div>
        )
    }
}

export default EnhancedPasswordField
