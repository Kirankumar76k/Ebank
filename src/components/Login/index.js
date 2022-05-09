import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userIdInput: '', pinInput: '', showSubmitError: false, errorMsg: ''}

  onChangeUserId = event => {
    this.setState({userIdInput: event.target.value})
  }

  onChangePin = event => {
    this.setState({pinInput: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userIdInput, pinInput} = this.state
    const userDetails = {userIdInput, pinInput}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUserId = () => {
    const {userIdInput} = this.state
    return (
      <>
        <label htmlFor="userId" className="label">
          User ID
        </label>
        <input
          type="text"
          className="inputCls"
          onChange={this.onChangeUserId}
          placeholder="Enter User ID"
          value={userIdInput}
          id="userId"
        />
      </>
    )
  }

  renderPinInput = () => {
    const {pinInput} = this.state
    return (
      <>
        <label htmlFor="pinId" className="label">
          PIN
        </label>
        <input
          type="password"
          className="inputCls"
          onChange={this.onChangePin}
          placeholder="Enter PIN"
          value={pinInput}
          id="pinId"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-container">
        <div className="app-container">
          <div className="login-img-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-img"
            />
          </div>
          <div className="login-form-container">
            <form onSubmit={this.onSubmitForm}>
              <h1 className="heading">Welcome Back</h1>
              <div className="input-container">{this.renderUserId()}</div>
              <div className="input-container">{this.renderPinInput()}</div>
              <button className="login-btn" type="submit">
                Login
              </button>
              {showSubmitError && <p className="error-message">*{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default Login
