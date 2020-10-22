import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import { actions as sessionActions } from 'store/Session'

import { getReadableCoins } from 'utils/misc'

import VotingPayments from 'components/VotingPayments'

import s from './Session.module.scss'

class PastSessions extends React.Component {
    state = {
        selectedToken: {},
        selectedSession: {},
        collapsedSessions: [],
    }

    componentDidMount() {
        this.props.fetchSessions().then(response => {
            const collapsedSessions = []
            for (const session of response.data.past_sessions) {
                collapsedSessions.push(session.id)
            }
            this.setState({
                collapsedSessions,
            })
        })
    }

    setSelectedTokenAndSession = (token, session) => {
        this.setState({
            selectedToken: token,
            selectedSession: session,
        })
    }

    toggleCollapsedSession = sessionID => {
        const collapsedSessions =
            this.state.collapsedSessions.indexOf(sessionID) > -1
                ? this.state.collapsedSessions.filter(x => x !== sessionID)
                : [...this.state.collapsedSessions, sessionID]
        this.setState({
            collapsedSessions,
        })
    }

    renderOnePastSession = (session, i) => (
        <div className="session" key={i}>
            <div className="session-details">
                <div
                    className="d-flex flex-column flex-lg-row align-items-end align-items-lg-center"
                    onClick={() => this.toggleCollapsedSession(session.id)}>
                    <span className="mr-0 mr-lg-2">
                        Start Date:{' '}
                        {new Date(session.start_date).toLocaleDateString()}
                    </span>
                    <span>
                        End Date:{' '}
                        {new Date(session.end_date).toLocaleDateString()}
                    </span>
                    <div className="flex-1" />
                    <span
                        className={`fas ${
                            this.state.collapsedSessions.indexOf(session.id) >
                            -1
                                ? 'fa-caret-down'
                                : 'fa-caret-up'
                        }`}
                    />
                </div>
                <div
                    className={`tokens ${
                        this.state.collapsedSessions.indexOf(session.id) > -1
                            ? 'hidden'
                            : ''
                    } mt-3`}>
                    <div className="token">
                        <span>Logo</span>
                        <span>Name</span>
                        <span>Total Votes</span>
                        <span>Amount Raised</span>
                        <span className="flex-1 d-none d-lg-inline" />
                        <span>Won Status</span>
                    </div>
                    {session.tokens.map((x, i) => (
                        <div
                            className="token"
                            key={i}
                            onClick={() =>
                                this.setSelectedTokenAndSession(x, session)
                            }>
                            <span>
                                <img
                                    src={
                                        process.env.REACT_APP_DOCUMENT_ROOT +
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
                                    ? getReadableCoins(x.amount_raised, 1000000)
                                    : 'N/A'}
                            </span>
                            <span className="flex-1 d-none d-lg-inline" />
                            {x.has_won && <span className="fas fa-trophy" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    render() {
        const { className, pastSessions } = this.props
        const { selectedSession, selectedToken } = this.state
        const cx = classnames(s.container, className)
        //console.log(this.state.collapsedSessions)

        return (
            <div className={cx}>
                {!!pastSessions.length &&
                    pastSessions.map(this.renderOnePastSession)}
                <VotingPayments
                    isVotingPaymentsModalOpen={
                        !isEmpty(selectedSession) && !isEmpty(selectedToken)
                    }
                    closeVotingPaymentModal={() =>
                        this.setSelectedTokenAndSession({}, {})
                    }
                    session={selectedSession}
                    token={selectedToken}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    pastSessions: state.Session.pastSessions,
})

const mapDispatchToProps = dispatch => ({
    fetchSessions: () => dispatch(sessionActions.fetchSessions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PastSessions)
