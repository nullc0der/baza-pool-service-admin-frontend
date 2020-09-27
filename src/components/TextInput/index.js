import React from 'react'
import classnames from 'classnames'

import s from './TextInput.module.scss'

export default class TextField extends React.Component {
    state = {
        value: ''
    }

    componentDidMount = () => {
        if (this.props.value) {
            this.setState({ value: this.props.value })
        }
    }

    onChange = (id, value) => {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(id, value)
        }
    }

    onInputChange = e => {
        e.stopPropagation()
        const value = e.target.value
        const id = e.target.id
        this.setState({ value })
        this.onChange(id, value)
    }

    render() {
        const {
            className,
            inputClassName,
            label = false,
            icon = false,
            center = false,
            type = 'text',
            errorState = null,
            firstCharUpper = false,
            value,
            onChange,
            ...others
        } = this.props

        const cx = classnames(s.container, 'ui-textfield', className)

        const inputClass = classnames('ui-textfield-input', inputClassName, {
            'has-value': this.state.value || value,
            'in-center': center,
            'first-char-upper': firstCharUpper
        })

        const _Label = !!label && (
            <label className="ui-textfield-label">
                {!!icon && <span className="label-icon"> {icon} </span>}
                <span className="label-text"> {label} </span>
            </label>
        )

        const _ValidationIcon = errorState !== null && (
            <div className="ui-textfield-validation-icon">
                {errorState === false ? (
                    <i className="material-icons text-success">check</i>
                ) : errorState === 'loading' ? (
                    <i className="material-icons text-info">cached</i>
                ) : (
                    <i className="material-icons text-danger">close</i>
                )}
            </div>
        )

        return (
            <div className={cx}>
                <input
                    type={type}
                    className={inputClass}
                    onChange={this.onInputChange}
                    value={value || this.state.value || ''}
                    autoComplete="off"
                    {...others}
                />
                {_Label}
                {_ValidationIcon}
                {errorState && errorState !== 'loading' && (
                    <div className="ui-textfield-error"> {errorState} </div>
                )}
            </div>
        )
    }
}
