import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import get from 'lodash/get'
import Pagination from 'react-js-pagination'
import Modal from 'react-bootstrap/Modal'

import { actions as tokenActions } from 'store/Token'
import { actions as sessionActions } from 'store/Session'

import TextInput from 'components/TextInput'

import s from './TokenDb.module.scss'

class TokenDb extends React.Component {
    state = {
        inputState: {
            name: '',
            symbol: '',
            logo: null,
            homepageUrl: '',
            algo: '',
        },
        errorState: {
            name: null,
            symbol: null,
            logo: null,
            homepageUrl: null,
            algo: null,
        },
        selectedToken: 0,
        selectedTokenLogo: null,
        selectedTokenIsArchived: false,
    }

    componentDidMount() {
        this.props.fetchTokens()
    }

    onInputChange = (id, value) => {
        this.setState(prevState => ({
            inputState: {
                ...prevState.inputState,
                [id]: value,
            },
        }))
    }

    onLogoFileInputChange = e => {
        const file = e.target.files[0]
        this.setState(prevState => ({
            inputState: {
                ...prevState.inputState,
                logo: file,
            },
        }))
    }

    setErrorState = responseData => {
        this.setState({
            errorState: {
                name: get(responseData, 'name', null),
                symbol: get(responseData, 'symbol', null),
                logo: get(responseData, 'logo', null),
                homepageUrl: get(responseData, 'homepage_url', null),
                algo: get(responseData, 'algo', null),
                nonField: get(responseData, 'non_field_errors', null),
            },
        })
    }

    onSubmitToken = () => {
        const { inputState, selectedToken } = this.state
        const data = new FormData()
        data.append('name', inputState.name)
        data.append('symbol', inputState.symbol)
        if (inputState.logo) {
            data.append('logo', inputState.logo)
        }
        data.append('homepage_url', inputState.homepageUrl)
        data.append('algo', inputState.algo)
        if (selectedToken === 0) {
            this.props
                .createToken(data)
                .then(response => {
                    this.props.addTokenToCurrentAndNextSession(response.data)
                    this.resetStateThanClose()
                })
                .catch(responseData => {
                    this.setErrorState(responseData)
                })
        } else {
            this.props
                .updateToken(selectedToken, data)
                .then(response => {
                    this.props.updateTokenOfCurrentAndNextSession(response.data)
                    this.resetStateThanClose()
                })
                .catch(responseData => {
                    this.setErrorState(responseData)
                })
        }
    }

    handlePaginationItemClick = pageNumber => {
        const token = this.props.tokens.filter(x => x.id === pageNumber)
        this.setState({
            selectedToken: pageNumber,
            selectedTokenLogo: token[0].logo,
            selectedTokenIsArchived: token[0].is_archived,
            inputState: {
                name: token[0].name,
                symbol: token[0].symbol,
                logo: null,
                homepageUrl: token[0].homepage_url,
                algo: token[0].algo,
            },
            errorState: {
                name: null,
                symbol: null,
                logo: null,
                homepageUrl: null,
                algo: null,
            },
        })
    }

    onClickNew = () => {
        this.setState({
            selectedToken: 0,
            selectedTokenLogo: null,
            selectedTokenIsArchived: false,
            inputState: {
                name: '',
                symbol: '',
                logo: null,
                homepageUrl: '',
                algo: '',
            },
            errorState: {
                name: null,
                symbol: null,
                logo: null,
                homepageUrl: null,
                algo: null,
            },
        })
    }

    resetStateThanClose = () => {
        this.setState(
            {
                selectedToken: 0,
                selectedTokenLogo: null,
                selectedTokenIsArchived: false,
                inputState: {
                    name: '',
                    symbol: '',
                    logo: null,
                    homepageUrl: '',
                    algo: '',
                },
                errorState: {
                    name: null,
                    symbol: null,
                    logo: null,
                    homepageUrl: null,
                    algo: null,
                },
            },
            () => this.props.toggleTokenDbModal()
        )
    }

    onClickArchive = (id, shouldArchive) => {
        const data = new FormData()
        data.append('is_archived', shouldArchive)
        this.props.updateToken(id, data).then(() => {
            this.resetStateThanClose()
        })
    }

    render() {
        const { className, tokenDbModalIsOpen, tokens } = this.props
        const {
            inputState,
            errorState,
            selectedToken,
            selectedTokenLogo,
            selectedTokenIsArchived,
        } = this.state
        const cx = classnames(className, s.container)

        return (
            <div className={cx}>
                <Modal
                    show={tokenDbModalIsOpen}
                    onHide={this.resetStateThanClose}
                    size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Token DB</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '1rem 2rem' }}>
                        <div className="token-form-wrapper">
                            <TextInput
                                id="name"
                                label="Token Name"
                                className="mb-3"
                                value={inputState.name}
                                onChange={this.onInputChange}
                                errorState={errorState.name}
                            />
                            <TextInput
                                id="symbol"
                                label="Token Symbol"
                                className="mb-3"
                                value={inputState.symbol}
                                onChange={this.onInputChange}
                                errorState={errorState.symbol}
                            />
                            <TextInput
                                id="homepageUrl"
                                label="Homepage URL"
                                className="mb-3"
                                value={inputState.homepageUrl}
                                onChange={this.onInputChange}
                                errorState={errorState.homepageUrl}
                            />
                            <TextInput
                                id="algo"
                                label="Token Algo"
                                className="mb-3"
                                value={inputState.algo}
                                onChange={this.onInputChange}
                                errorState={errorState.algo}
                            />
                            <div className="mb-3">
                                <p className="mb-0">Token Logo</p>
                                {!!selectedTokenLogo && (
                                    <img
                                        src={
                                            process.env
                                                .REACT_APP_DOCUMENT_ROOT +
                                            selectedTokenLogo
                                        }
                                        className="img-fluid mr-2"
                                        style={{
                                            width: '30px',
                                        }}
                                        alt="token logo"
                                    />
                                )}
                                <input
                                    type="file"
                                    onChange={this.onLogoFileInputChange}
                                />
                                {!!errorState.logo && (
                                    <p
                                        className="text-danger"
                                        style={{ fontSize: '12px' }}>
                                        {errorState.logo}
                                    </p>
                                )}
                            </div>
                            {!!errorState.nonField && (
                                <div className="alert alert-danger">
                                    {errorState.nonField.map((x, i) => (
                                        <p
                                            className={`${
                                                i === 0 ? 'mb-0' : ''
                                            }`}
                                            key={i}>
                                            {x}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                        {!!tokens.length && (
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <Pagination
                                    activePage={selectedToken}
                                    itemsCountPerPage={1}
                                    totalItemsCount={tokens.length}
                                    pageRangeDisplayed={10}
                                    onChange={this.handlePaginationItemClick}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </div>
                        )}
                        <div className="d-flex">
                            {selectedToken !== 0 && (
                                <>
                                    <button
                                        className="btn btn-dark mr-2"
                                        onClick={() =>
                                            this.onClickArchive(
                                                selectedToken,
                                                !selectedTokenIsArchived
                                            )
                                        }>
                                        {selectedTokenIsArchived
                                            ? 'UnArchive'
                                            : 'Archive'}
                                    </button>
                                    <button
                                        className="btn btn-dark"
                                        onClick={this.onClickNew}>
                                        New
                                    </button>
                                </>
                            )}
                            <div className="flex-1" />
                            <button
                                className="btn btn-dark mr-2"
                                onClick={this.resetStateThanClose}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-dark"
                                onClick={this.onSubmitToken}>
                                Submit
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    tokens: state.Token.tokens,
})

const mapDispatchToProps = dispatch => ({
    fetchTokens: () => dispatch(tokenActions.fetchTokens()),
    createToken: data => dispatch(tokenActions.createToken(data)),
    updateToken: (id, data) => dispatch(tokenActions.updateToken(id, data)),
    addTokenToCurrentAndNextSession: token =>
        dispatch(sessionActions.addTokenToCurrentAndNextSession(token)),
    updateTokenOfCurrentAndNextSession: token =>
        dispatch(sessionActions.updateTokenOfCurrentAndNextSession(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenDb)
