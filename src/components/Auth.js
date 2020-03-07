import restClient from './RestClient';
import utils from './Utils';

class Auth {
  constructor() {
    this.token;
    this.issuedAt;
    this.expiresAt;
    this.profile;
    this.authenticated = false;

    this.getProfile = this.getProfile.bind(this);
    this.getFullName = this.getFullName.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.isRecruiter = this.isRecruiter.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getFullName() {
    return utils.getFullName(this.profile.firstName, this.profile.middleName, this.profile.lastName)
  }

  getToken() {
    return this.token;
  }

  saveToken() {
    window.sessionStorage.reactRecruitUIToken = this.token;
  }

  loadToken() {
    this.token = window.sessionStorage.reactRecruitUIToken;
    console.log(`Token loaded from sessionStorage: ${this.token}`);
  }
  
  deleteToken() {
    delete window.sessionStorage.reactRecruitUIToken;
  }

  isRecruiter() {
    if (utils.isNotNull(this.profile.role) && this.profile.role.includes('R')) {
      return true;
    } else {
      return false;
    }
  }

  isAdmin() {
    if (utils.isNotNull(this.profile.role) && this.profile.role.includes('A')) {
      return true;
    } else {
      return false;
    }
  }

  isAuthenticated() {
    var currentTime = Math.floor(Date.now() / 1000);
    // console.log("isAuthenticated()")
    // console.log(currentTime)
    // console.log(this.expiresAt)
    // console.log(currentTime < this.expiresAt);
    return this.authenticated && (currentTime < this.expiresAt);
  }

  signIn(username, password, _callback) {
    this.serverRequest = restClient.login(username, password).then(res => {
      var authenticated = false;
      const authResult = res.data;

      this.token = authResult.token;
      // this.authenticated = authResult.authenticated;
      // this.expiresAt = authResult.expiresAt;
      // this.issuedAt = authResult.issuedAt;

      if (res.status == 200 && authResult.authenticated && utils.isNotNull(this.token)) {
        authenticated = true;
        this.saveToken();
      }
      this.handleAuthentication((authorized, errorMessage) => {
        _callback(authenticated, authorized, errorMessage);
      });
    }).catch(error => {
      console.log(error.response);  
      var errorMessage = ''
      if (error.response.status == 401) {
        errorMessage = 'Please provide valid credentials!'
      } else if (error.response.status == 400) {
        errorMessage = error.response.data.errorMessage;
      } else if (error.response.status == 500) {
        errorMessage = error.response.data.sqlMessage;
      }
      _callback(false, false, errorMessage);
    });
  }

  handleAuthentication(_callback) {
    this.serverRequest = restClient.verifyLogin(this.token).then(res => {
      var authorized = false;
      const verifyResult = res.data;
      this.profile = verifyResult;
      console.log(this.profile);
      if (res.status == 200 && utils.isNotNull(verifyResult)) {
        authorized = true;
        this.authenticated = true;
        this.issuedAt = verifyResult.issuedAt;
        this.expiresAt = verifyResult.expiresAt;
      }
      _callback(authorized, undefined);
    }).catch(error => {
      console.log(error.response);
      var errorMessage = ''
      if (error.response.status == 401) {
        errorMessage = 'Please provide valid credentials!'
      } else if (error.response.status == 400) {
        errorMessage = error.response.data.errorMessage;
      } else if (error.response.status == 500) {
        errorMessage = error.response.data.sqlMessage;
      }
      console.log(errorMessage); 
      _callback(false, error.response);
    });
  }

  signOut(_callback) {
    this.serverRequest = restClient.logout(this.token).then(res => {
      var loggedOut = false;
      const signOutResult = res.data;

      this.authenticated = signOutResult.authenticated;
      this.token = undefined;
      this.profile = undefined;
      this.issuedAt = undefined;
      this.expiresAt = undefined;

      if (res.status == 200 && !signOutResult.authenticated) {
        loggedOut = true;
        this.deleteToken();
      }
      _callback(loggedOut);
    }).catch(error => {
      console.log(error.response);
      _callback(false);
    });
  }

  silentAuth(_callback) {
    if (!this.token) {
      this.loadToken();
    }
    var authorized = false;
    if (utils.isNotNull(this.token)) {
      this.handleAuthentication((authorized) => {
        _callback(authorized);
      });
    } else {
      _callback(authorized);
    }
  }
}

const authClient = new Auth();

export default authClient;