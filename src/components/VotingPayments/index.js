import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/Modal'

import { getReadableCoins } from 'utils/misc'

import TextInput from 'components/TextInput'

import { actions as sessionActions } from 'store/Session'

import s from './VotingPayments.module.scss'

class VotingPayments extends React.Component {
    state = {
        inputState: {
            txHashSearch: '',
        },
        votingPayments: [],
        totalAmountRaised: '',
        totalVotes: 0,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (
            prevProps.session.id !== this.props.session.id ||
            prevProps.token.id !== this.props.token.id
        ) {
            if (this.props.session.id && this.props.token.id) {
                this.props
                    .fetchVotingPayments(
                        this.props.session.id,
                        this.props.token.id
                    )
                    .then(response => {
                        this.setState({
                            votingPayments: response.data.voting_payments,
                            totalAmountRaised:
                                response.data.total_amount_raised,
                            totalVotes: response.data.voting_payments.length,
                        })
                    })
            }
        }
    }

    onInputChange = (id, value) => {
        if (id === 'txHashSearch') {
            let votingPayments = []
            if (value) {
                votingPayments = this.props.votingPayments.voting_payments.filter(
                    x => x.tx_hash === value
                )
            } else {
                votingPayments = this.props.votingPayments.voting_payments
            }
            this.setState(prevState => ({
                inputState: {
                    ...prevState.inputState,
                    [id]: value,
                },
                votingPayments,
            }))
        } else {
            this.setState(prevState => ({
                inputState: {
                    ...prevState.inputState,
                    [id]: value,
                },
            }))
        }
    }

    render() {
        const {
            className,
            isVotingPaymentsModalOpen,
            closeVotingPaymentModal,
            session,
            token,
        } = this.props
        const {
            inputState,
            votingPayments,
            totalAmountRaised,
            totalVotes,
        } = this.state
        const cx = classnames(s.container, className)

        return (
            <Modal
                show={isVotingPaymentsModalOpen}
                onHide={closeVotingPaymentModal}
                size="lg"
                dialogClassName={cx}>
                <Modal.Header>
                    <Modal.Title>
                        Voting payments of {token.name} of session{' '}
                        {moment(session.start_date).format('DD/MM/YYYY')} -{' '}
                        {moment(session.end_date).format('DD/MM/YYYY')}{' '}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex mb-2">
                        <TextInput
                            id="txHashSearch"
                            className="hash-search"
                            label="Enter a tx hash to search"
                            icon={<i className="material-icons">search</i>}
                            value={inputState.txHashSearch}
                            onChange={this.onInputChange}
                        />
                    </div>
                    <div className="d-flex justify-content-end">
                        <p>
                            Total amount raised:{' '}
                            {getReadableCoins(totalAmountRaised, 1000000)}
                        </p>
                    </div>
                    <div className="d-flex mb-2 justify-content-end">
                        <p>Total Votes: {totalVotes}</p>
                    </div>
                    <div className="voting-payments">
                        {votingPayments.map((x, i) => (
                            <div className="payment" key={i}>
                                <span title="Tx Hash">{x.tx_hash}</span>
                                <span title="Time stamp">
                                    {moment(x.timestamp).format('DD/MM/YYYY')}
                                </span>
                                <span title="Amount">
                                    {getReadableCoins(x.amount, 1000000)}
                                </span>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    votingPayments: state.Session.votingPayments,
})

const mapDispatchToProps = dispatch => ({
    fetchVotingPayments: (sessionID, tokenID) =>
        dispatch(sessionActions.fetchVotingPayments(sessionID, tokenID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(VotingPayments)
