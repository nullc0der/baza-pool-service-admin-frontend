import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import get from 'lodash/get'
import Modal from 'react-bootstrap/Modal'
import DateTime from 'react-datetime'
import moment from 'moment'

import TextInput from 'components/TextInput'

import { actions as sessionActions } from 'store/Session'

import 'react-datetime/css/react-datetime.css'
import s from './EditSession.module.scss'

class EditSession extends React.Component {
    state = {
        inputState: {
            minAmount: '',
            description: '',
            startDate: null,
            endDate: null,
        },
        errorState: {
            minAmount: null,
            description: null,
            startDate: null,
            endDate: null,
            nonField: null,
        },
    }

    componentDidMount() {
        this.setInputStateFromSession(this.props.session)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.session !== this.props.session) {
            this.setInputStateFromSession(this.props.session)
        }
    }

    setInputStateFromSession = session => {
        this.setState({
            inputState: {
                minAmount: session.minimum_amount_per_token,
                description: session.description,
                startDate: moment(session.start_date).format('YYYY-MM-DD'),
                endDate: moment(session.end_date).format('YYYY-MM-DD'),
            },
        })
    }

    onInputChange = (id, value) => {
        this.setState(prevState => ({
            inputState: {
                ...prevState.inputState,
                [id]: value,
            },
        }))
    }

    onStartDateChange = date => {
        this.setState(prevState => ({
            inputState: {
                ...prevState.inputState,
                startDate: moment(date).format('YYYY-MM-DD'),
            },
        }))
    }

    onEndDateChange = date => {
        this.setState(prevState => ({
            inputState: {
                ...prevState.inputState,
                endDate: moment(date).format('YYYY-MM-DD'),
            },
        }))
    }

    onClickSubmit = () => {
        const { inputState } = this.state
        const {
            updateSession,
            session,
            currentSession,
            toggleEditSessionModal,
        } = this.props

        const data = {
            minimum_amount_per_token: inputState.minAmount,
            description: inputState.description,
            start_date: inputState.startDate,
            end_date: inputState.endDate,
        }

        if (currentSession) {
            delete data.start_date
        }

        updateSession(session.id, data)
            .then(() => toggleEditSessionModal())
            .catch(responseData => {
                this.setState({
                    errorState: {
                        minAmount: get(
                            responseData,
                            'minimum_amount_per_token',
                            null
                        ),
                        description: get(responseData, 'description', null),
                        startDate: get(responseData, 'start_date', null),
                        endDate: get(responseData, 'end_date', null),
                        nonField: get(responseData, 'non_field_errors', null),
                    },
                })
            })
    }

    render() {
        const {
            className,
            editSessionModalIsOpen,
            currentSession,
            toggleEditSessionModal,
        } = this.props
        const { inputState, errorState } = this.state
        const cx = classnames(s.container, className)

        return (
            <Modal
                show={editSessionModalIsOpen}
                onHide={toggleEditSessionModal}
                dialogClassName={cx}>
                <Modal.Header>
                    <Modal.Title>Session Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TextInput
                        id="minAmount"
                        label="Min Baza For Session"
                        className="mb-3"
                        value={inputState.minAmount}
                        onChange={this.onInputChange}
                        errorState={errorState.minAmount}
                    />
                    <TextInput
                        id="description"
                        label="Description"
                        className="mb-3"
                        value={inputState.description}
                        onChange={this.onInputChange}
                        errorState={errorState.description}
                    />
                    {!currentSession && (
                        <div className="mb-3">
                            <p className="mb-0 text-small">Start date</p>
                            <DateTime
                                dateFormat="YYYY-MM-DD"
                                onChange={this.onStartDateChange}
                                timeFormat={false}
                                value={inputState.startDate}
                            />
                            {!!errorState.startDate && (
                                <span className="text-danger error-text">
                                    {errorState.startDate}
                                </span>
                            )}
                        </div>
                    )}
                    <div className="mb-3">
                        <p className="mb-0 text-small">End date</p>
                        <DateTime
                            dateFormat="YYYY-MM-DD"
                            onChange={this.onEndDateChange}
                            timeFormat={false}
                            value={inputState.endDate}
                        />
                        {!!errorState.endDate && (
                            <span className="text-danger error-text">
                                {errorState.endDate}
                            </span>
                        )}
                    </div>
                    {!!errorState.nonField && (
                        <div className="alert alert-danger">
                            {errorState.nonField.map((x, i) => (
                                <p
                                    className={`${i === 0 ? 'mb-0' : ''}`}
                                    key={i}>
                                    {x}
                                </p>
                            ))}
                        </div>
                    )}
                    <div className="d-flex">
                        <div className="flex-1" />
                        <button
                            className="btn btn-dark mr-2"
                            onClick={toggleEditSessionModal}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-dark"
                            onClick={this.onClickSubmit}>
                            Submit
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    updateSession: (id, data) =>
        dispatch(sessionActions.updateSession(id, data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSession)
