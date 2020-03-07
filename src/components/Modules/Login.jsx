import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import authClient from '../Auth';
import HeaderButtonsTop from './HeaderButtonsTop'
import utils from '../Utils';

class Login extends Component {
  constructor(props) {
    super(props);

    this.loginUsernameId = 'loginUsername';
    this.loginPasswordId = 'loginPassword';
    this.loginButtonId = 'loginButton';
    this.loginErrorId = 'loginError';

    this.state = {
      disabled: false,
      username: '',
      password: '',
      error: false,
      errorMessage: ''
    };

    this.submit = this.submit.bind(this);
  }

  updateUsername(value) {
    this.setState({
      username: value,
    });
  }

  updatePassword(value) {
    this.setState({
      password: value,
    });
  }

  submit() {
    var username = this.refs[this.loginUsernameId].value;
    var password = this.refs[this.loginPasswordId].value;

    var fieldsMap = {Username: username, Password: password};
    var requiredErrors = '';
    for (var key in fieldsMap) {
      if (!utils.isNotNull(fieldsMap[key])) {
        requiredErrors = requiredErrors + key + ', ';
      }
    }
    if (utils.isNotNull(requiredErrors)) {
      requiredErrors = requiredErrors.slice(0, -2);
      this.setState({
        error: true,
        errorMessage: 'Missing: ' + requiredErrors,
        disabled: false
      }, () => {
        this.refs[this.loginErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
      });
      return false;
    }
    
    this.setState({
      disabled: true,
      username: username,
      password: password
    });

    authClient.signIn(username, password, (authenticated, authorized, errorMessage) => {
      this.setState({
        disabled: false,
      });
      console.log(`Authenticated: ${authenticated}. Authorized: ${authorized}.`);
      if (authenticated && authorized) {
        this.setState({
          error: false,
          errorMessage: '',
          disabled: false
        });
        {this.props.history.push('/')}
      } else {
        if (errorMessage.includes("Illegal mix of collations")) {
          errorMessage = "Not allowed characters."
        }
        this.setState({
          error: true,
          errorMessage: errorMessage,
          disabled: false
        }, () => {
          this.refs[this.loginErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
        });
        // {this.props.history.push('/login')}
      }
    });
  }

  componentDidMount () {
    const script = document.createElement("script");
    script.type = 'text/javascript';
    script.async = true;
    script.text = `document.onkeydown = function(e){
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == '13'){
        document.getElementById('${this.loginButtonId}').click();
        return false;
      }
    };`;
    // script.text = `document.getElementById('${this.loginUsernameId}').onkeypress = function(e){
    //   if (!e) e = window.event;
    //   var keyCode = e.keyCode || e.which;
    //   if (keyCode == '13'){
    //     document.getElementById('${this.loginButtonId}').click();
    //     return false;
    //   }
    // };
    // document.getElementById('${this.loginPasswordId}').onkeypress = function(e){
    //   if (!e) e = window.event;
    //   var keyCode = e.keyCode || e.which;
    //   if (keyCode == '13'){
    //     document.getElementById('${this.loginButtonId}').click();
    //     return false;
    //   }
    // };`;
    document.head.appendChild(script);
  }

  renderLogin() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-header">Credentials</div>
              <div className="card-body text-left">
              {this.state.error &&
              <div ref={this.loginErrorId} className="alert alert-danger">Authentication error. {this.state.errorMessage}</div>
              }
                <div className="form-group required">
                  <label className="control-label" htmlFor={this.loginUsernameId}>Username</label>
                  <input
                    ref={this.loginUsernameId}
                    maxLength="255"
                    disabled={this.state.disabled}
                    type="text"
                    onBlur={(e) => {this.updateUsername(e.target.value)}}
                    className="form-control"
                    placeholder="Please enter an Email"
                    // defaultValue="owen@example.com"
                  />
                </div>
                <div className="form-group required">
                  <label className="control-label" htmlFor={this.loginPasswordId}>Password</label>
                  <input
                    ref={this.loginPasswordId}
                    maxLength="255"
                    disabled={this.state.disabled}
                    type="password"
                    onBlur={(e) => {this.updatePassword(e.target.value)}}
                    className="form-control"
                    placeholder="Please enter a Password"
                    // defaultValue="welcome"
                  />
                </div>
                <button
                  type="submit"
                  id={this.loginButtonId}
                  disabled={this.state.disabled}
                  className="btn btn-primary"
                  onClick={() => {this.submit()}}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <HeaderButtonsTop 
          headerTitle = 'Login'
        />
        { this.renderLogin() }
      </div>
    )
  }
}

export default withRouter(Login);