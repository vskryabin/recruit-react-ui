import axios from 'axios';
import authClient from './Auth';
import utils from './Utils';
import config from '../../config/config'

class RestClient {
  constructor() {
    this.protocol = location.protocol; 
    this.hostName = location.hostname;
    this.port = config.rest_port;
    this.baseUrl = `${this.protocol}//${this.hostName}:${this.port}/recruit/api/v1`;
    this.bearer = 'Bearer ';

    this.loginUrl = `${this.baseUrl}/login`;
    this.verifyLoginUrl = `${this.baseUrl}/verify`;
    this.logoutUrl = `${this.baseUrl}/logout`;
    this.positionsUrl = `${this.baseUrl}/positions`;
    this.candidatesUrl = `${this.baseUrl}/candidates`;
    this.applicationsUrl = `${this.baseUrl}/applications`;
  }

  login(username, password) {
    return axios.post(this.loginUrl, {
      email: username,
      password: password,
    }, {
      headers: {'Content-Type': 'application/json'}
    }
    // {
      // headers: { 'Authorization': `Bearer ${authClient.getToken()}` }
    // }
    );
  }

  verifyLogin(token) {
    return axios.post(this.verifyLoginUrl, {
    }, {
      headers: {'Authorization': this.bearer + token}
    }
    );
  }

  logout(token) {
    return axios.post(this.logoutUrl, {
    }, {
      headers: {'Authorization': this.bearer + token}
    }
    );
  }

  createPosition(title, address, city, state, zip, dateOpen, description) {
    return axios.post(this.positionsUrl, {
      title: title,
      address: address,
      city: city,
      state: state,
      zip: zip,
      dateOpen: dateOpen,
      description: description
    }, {
      headers: {'Content-Type': 'application/json', 'Authorization': this.bearer + authClient.getToken()}
    }
    );
  }

  updatePosition(positionId, title, address, city, state, zip, dateOpen, description) {
    return axios.put(this.positionsUrl + "/" + positionId, {
      title: title,
      address: address,
      city: city,
      state: state,
      zip: zip,
      dateOpen: dateOpen,
      description: description
    }, {
      headers: {'Content-Type': 'application/json', 'Authorization': this.bearer + authClient.getToken()}
    }
    );
  }

  getPositions(searchQuery) {
    if (searchQuery !== '') {
      const query = `?title=${searchQuery}`
      return axios.get(this.positionsUrl + query);
    } else {
      return axios.get(this.positionsUrl);
    }
  }

  getPositionById(positionId) {
    return axios.get(`${this.positionsUrl}/${positionId}`);
  }

  getPositionsByCandidateId(candidateId) {
    const positionsByCandidateIdUrl = `${this.candidatesUrl}/${candidateId}/positions`;
    return axios.get(positionsByCandidateIdUrl);
  }

  deletePosition(positionId) {
    return axios.delete(this.positionsUrl + "/" + positionId, {
      headers: {'Authorization': this.bearer + authClient.getToken()}
    }
    );
  }

  createCandidate(firstName, middleName, lastName, email, password, address, city, state, zip, summary) {
    return axios.post(this.candidatesUrl, {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      password: password,
      address: address,
      city: city,
      state: state,
      zip: zip,
      summary: summary
    }, {
      headers: {'Content-Type': 'application/json', 'Authorization': this.bearer + authClient.getToken()}
    }
    );
  }

  updateCandidate(candidateId, firstName, middleName, lastName, email, password, address, city, state, zip, summary) {
    if (password !== '•••••••••••••••••') {
      return axios.put(this.candidatesUrl + "/" + candidateId, {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        password: password,
        address: address,
        city: city,
        state: state,
        zip: zip,
        summary: summary
      }, {
        headers: {'Content-Type': 'application/json', 'Authorization': this.bearer + authClient.getToken()}
      }
      );
    } else {
      return axios.put(this.candidatesUrl + "/" + candidateId, {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        address: address,
        city: city,
        state: state,
        zip: zip,
        summary: summary
      }, {
        headers: {'Content-Type': 'application/json', 'Authorization': this.bearer + authClient.getToken()}
      }
      );
    }
    

  }

  getCandidates(searchQuery) {
    if (searchQuery !== '') {
      const query = `?email=${searchQuery}`
      return axios.get(this.candidatesUrl + query);
    } else {
      return axios.get(this.candidatesUrl);
    }
  }

  getCandidateById(candidateId) {
    return axios.get(`${this.candidatesUrl}/${candidateId}`);
  }

  getCandidatesByPositionId(positionId) {
    const candidatesByPositionIdUrl = `${this.positionsUrl}/${positionId}/candidates`;
    return axios.get(candidatesByPositionIdUrl);
  }

  deleteCandidate(candidateId) {
    return axios.delete(this.candidatesUrl + "/" + candidateId, {
      headers: {'Authorization': this.bearer + authClient.getToken()}
    }
    );
  }
  
  createApplication(candidateId, positionId) {
    console.log(authClient.getToken());
    console.log(utils.getTodaysDate());
    return axios.post(this.applicationsUrl, {
      candidateId: candidateId,
      positionId: positionId,
      dateApplied: utils.getTodaysDate()
    }, {
      headers: {'Content-Type': 'application/json', 'Authorization': this.bearer + authClient.getToken()}
    }
    );
  }

  deleteApplication(candidateId, positionId) {
    return axios.delete(this.applicationsUrl + "?positionId=" + positionId + "&candidateId=" + candidateId, {
      headers: {'Authorization': this.bearer + authClient.getToken()}
    }
    );
  }
}

const restClient = new RestClient();

export default restClient;