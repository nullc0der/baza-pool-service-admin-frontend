import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'

import { actions as sessionActions } from 'store/Session'

import { getReadableCoins } from 'utils/misc'

import TokenDb from 'components/TokenDb'
import EditSession from 'components/EditSession'
import VotingPayments from 'components/VotingPayments'

import s from './Session.module.scss'

class Session extends React.Component {
    state = {
        tokenDbModalIsOpen: false,
        editSessionModalIsOpen: false,
        selectedSession: '',
        selectedToken: {},
    }

    componentDidMount() {
        this.props.fetchSessions().then(() => {
            this.setState({
                selectedSession: this.props.match.params.sessionname,
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.match.params.sessionname !==
            this.props.match.params.sessionname
        ) {
            this.setState({
                selectedSession: this.props.match.params.sessionname,
            })
        }
    }

    toggleTokenDbModal = () => {
        this.setState({
            tokenDbModalIsOpen: !this.state.tokenDbModalIsOpen,
        })
    }

    toggleEditSessionModal = () => {
        this.setState({
            editSessionModalIsOpen: !this.state.editSessionModalIsOpen,
        })
    }

    toggleSessionStatus = (id, is_paused) => {
        this.props.updateSession(id, { is_paused: is_paused })
    }

    setSelectedToken = token => {
        this.setState({
            selectedToken: token,
        })
    }

    render() {
        const {
            className,
            currentSession,
            nextSession,
            toggleTokenVisibility,
        } = this.props
        const {
            tokenDbModalIsOpen,
            selectedSession,
            editSessionModalIsOpen,
            selectedToken,
        } = this.state
        const cx = classnames(className, s.container)
        const session =
            selectedSession === 'current' ? currentSession : nextSession
        return (
            <div className={cx}>
                <div className="session-details">
                    <div className="d-flex flex-column flex-lg-row align-items-end align-items-lg-center">
                        <span className="mr-0 mr-lg-2">
                            Start Date:{' '}
                            {new Date(session.start_date).toLocaleDateString()}
                        </span>
                        <span>
                            End Date:{' '}
                            {new Date(session.end_date).toLocaleDateString()}
                        </span>
                        <div className="flex-1" />
                        <div className="edit-button-wrapper">
                            <i
                                className={`fas mr-2 ${
                                    session.is_paused ? 'fa-play' : 'fa-pause'
                                }`}
                                onClick={() =>
                                    this.toggleSessionStatus(
                                        session.id,
                                        !session.is_paused
                                    )
                                }
                            />
                            <button
                                className="btn btn-dark"
                                onClick={this.toggleEditSessionModal}>
                                Edit Session
                            </button>
                        </div>
                    </div>
                    <div className="tokens mt-3">
                        <div className="token">
                            <span>Logo</span>
                            <span>Name</span>
                            <span>Total Votes</span>
                            <span>Amount Raised</span>
                            <span className="flex-1 d-none d-lg-inline" />
                            <span>Won Status</span>
                            <span>Visibility</span>
                        </div>
                        {!isEmpty(session) &&
                            session.tokens.map((x, i) => (
                                <div
                                    className="token"
                                    key={i}
                                    onClick={() => this.setSelectedToken(x)}>
                                    <span>
                                        <img
                                            src={
                                                process.env
                                                    .REACT_APP_DOCUMENT_ROOT +
                                                x.logo
                                            }
                                            className="img-fluid"
                                            style={{
                                                width: '40px',
                                            }}
                                            alt="token logo"
                                        />
                                    </span>
                                    <span>{x.name}</span>
                                    <span>{x.total_votes || 'N/A'}</span>
                                    <span>
                                        {x.amount_raised
                                            ? getReadableCoins(
                                                  x.amount_raised,
                                                  1000000
                                              )
                                            : 'N/A'}
                                    </span>
                                    <span className="flex-1 d-none d-lg-inline" />
                                    {x.has_won && (
                                        <span className="fas fa-trophy" />
                                    )}
                                    <span>
                                        <i
                                            className={`fas fa-${
                                                includes(
                                                    session.hidden_tokens_id,
                                                    x.id.toString()
                                                )
                                                    ? 'eye'
                                                    : 'eye-slash'
                                            }`}
                                            onClick={e => {
                                                e.stopPropagation()
                                                toggleTokenVisibility(
                                                    session.id,
                                                    x.id
                                                )
                                            }}
                                            title={
                                                includes(
                                                    session.hidden_tokens_id,
                                                    x.id.toString()
                                                )
                                                    ? 'Show token in session'
                                                    : 'Hide token from session'
                                            }
                                        />
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
                <TokenDb
                    tokenDbModalIsOpen={tokenDbModalIsOpen}
                    toggleTokenDbModal={this.toggleTokenDbModal}
                />
                <EditSession
                    editSessionModalIsOpen={editSessionModalIsOpen}
                    toggleEditSessionModal={this.toggleEditSessionModal}
                    session={session}
                    currentSession={selectedSession === 'current'}
                />
                <VotingPayments
                    isVotingPaymentsModalOpen={
                        !isEmpty(session) && !isEmpty(selectedToken)
                    }
                    closeVotingPaymentModal={() => this.setSelectedToken({})}
                    session={session}
                    token={selectedToken}
                />
                <div
                    className="tokendb-button"
                    onClick={this.toggleTokenDbModal}>
                    <i className="fas fa-database" />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentSession: state.Session.currentSession,
    nextSession: state.Session.nextSession,
})

const mapDispatchToProps = dispatch => ({
    fetchSessions: () => dispatch(sessionActions.fetchSessions()),
    updateSession: (id, data) =>
        dispatch(sessionActions.updateSession(id, data)),
    toggleTokenVisibility: (sessionID, tokenID) =>
        dispatch(sessionActions.toggleTokenVisibility(sessionID, tokenID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Session)
