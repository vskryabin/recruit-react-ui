import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import restClient from '../RestClient'
import HeaderButtonsTop from './HeaderButtonsTop'
import authClient from '../Auth';
import utils from '../Utils';

class Candidate extends Component {
  constructor(props) {
    super(props);

    this.candidateFormId = 'candidateForm';
    this.candidateFirstNameId = 'candidateFirstName';
    this.candidateMiddleNameId = 'candidateMiddleName';
    this.candidateLastNameId = 'candidateLastName';
    this.candidateEmailId = 'candidateEmail';
    this.candidatePasswordId = 'candidatePassword';
    this.candidateConfirmPasswordId = 'candidateConfirmPassword';
    this.candidateAddressId = 'candidateAddress';
    this.candidateCityId = 'candidateCity';
    this.candidateStateId = 'candidateState';
    this.candidateZipId = 'candidateZip';
    this.candidateSummaryId = 'candidateSummary';
    this.candidateRoleId = 'candidateRole';
    this.candidateResumeId = 'candidateResume';
    this.candidateErrorId = 'candidateError';
    this.candidateEditId = 'candidateEdit';
    this.candidateWithdrawId = 'candidateWithdraw';

    this.state = {
      candidateId: this.getCandidateIdFromPath(),
      candidate: null,
      disabled: false,
      error: false,
      errorMessage: ''
    };
  }

  getCandidateIdFromPath() {
    const { match: { params } } = this.props;
    console.log('Candidate Id from path: ' + params.candidateId);
    return params.candidateId;
  }

  removeCandidate() {
    this.serverRequest = restClient.deleteCandidate(authClient.profile['id']).then(res => {
      console.log(res);
      authClient.signOut((loggedOut) => {
        if (loggedOut) {
          this.props.history.push('/');
          console.log(`LoggedOut: ${loggedOut}`)
        }
      });
    }).catch(error => {
      console.log(error.response);  
      var errorMessage = ''
      if (error.response.status == 401) {
        errorMessage = 'You have to login to remove your application!'
      } else if (error.response.status == 500) {
        errorMessage = error.response.data.sqlMessage;
      }
      this.setState({
        error: true,
        errorMessage: errorMessage,
        disabled: false
      }, () => {
        this.refs[this.candidateErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
      });
    });
  }

  editCandidate() {
    this.props.history.push('/candidates/' + this.state.candidateId + '/edit')
  }

  componentDidMount () {
    var candidateId = this.getCandidateIdFromPath();
    this.getCandidateById(candidateId);
  }

  getCandidateById(candidateId) {
    this.serverRequest = restClient.getCandidateById(candidateId).then(res => {
      const candidate = res.data;
      this.setState({ candidate });
      console.log(candidate);
    }).catch(error => {
      console.log(error.response);
    });
  }

  isProfileOwner(id) {
    if (authClient.isAuthenticated() && (authClient.profile['id'] === id)) {
      return true;
    } else {
      return false;
    }
  }

  renderCandidate() {
    const {candidate, candidateId} = this.state;
    if (candidate === null) return <p></p>;
    if (!(this.isProfileOwner(candidate.id) || authClient.isRecruiter())) return <h4 className="text-center">Unauthorized</h4>;
    return (
      <div className="container container-full" ref={this.candidateFormId}>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="card border-primary">
                <div className="card-header">
                  <span>Profile Details</span>
                  {
                      this.isProfileOwner(candidate.id) && 
                      <button
                        type="submit"
                        ref={this.candidateEditId} 
                        disabled={this.state.disabled}
                        className="btn btn-secondary top-right-button"
                        onClick={() => {this.editCandidate()}}>
                        Edit
                      </button>
                  }
                </div>
                <div className="card-body text-left">
                {this.state.error &&
                <div ref={this.candidateErrorId} className="alert alert-danger">{this.state.errorMessage}</div>
                }
                <div className="form-row">
                  <div className="form-group col-md-4">
                      <label htmlFor={this.candidateFirstNameId}>First Name</label>
                      <span
                        ref={this.candidateFirstNameId}
                        maxLength="255"
                        disabled={this.state.disabled}
                        type="text"
                        className="form-control no-border bold auto-height"
                      >{candidate.firstName}</span>
                  </div>
                  <div className="form-group col-md-4">
                      <label htmlFor={this.candidateMiddleNameId}>Middle Name</label>
                      <span
                        ref={this.candidateMiddleNameId}
                        maxLength="255"
                        disabled={this.state.disabled}
                        type="text"
                        className="form-control no-border bold auto-height"
                      >{candidate.middleName}</span>
                  </div>
                  <div className="form-group col-md-4">
                      <label htmlFor={this.candidateLastNameId}>Last Name</label>
                      <span
                        ref={this.candidateLastNameId}
                        maxLength="255"
                        disabled={this.state.disabled}
                        type="text"
                        className="form-control no-border bold auto-height"
                      >{candidate.lastName}</span>
                  </div>
                </div>
                <div className="form-row">
                <div className="form-group col-md-4">
                    <label htmlFor={this.candidateEmailId}>Email</label>
                    <span
                        ref={this.candidateEmailId}
                        maxLength="255"
                        rows="2"
                        disabled={this.state.disabled}
                        type="text"
                        className="form-control no-border bold auto-height"
                      >{candidate.email}</span>
                  </div>
                  <div className="form-group col-md-4">
                      <label htmlFor={this.candidatePasswordId}>Password</label>
                      <span
                        ref={this.candidatePasswordId}
                        maxLength="255"
                        disabled={this.state.disabled}
                        type="password"
                        className="form-control no-border bold auto-height"
                        >•••••••••••••••••</span>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-12">
                      <label htmlFor={this.candidateSummaryId}>Summary</label>
                      <span
                          ref={this.candidateSummaryId}
                          maxLength="65535"
                          rows="2"
                          disabled={this.state.disabled}
                          type="text"
                          className="form-control no-border bold auto-height"
                          >{candidate.summary}</span>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor={this.candidateAddressId}>Address</label>
                    <span
                      ref={this.candidateAddressId}
                      disabled={this.state.disabled}
                      type="text"
                      className="form-control no-border bold auto-height"
                      >{candidate.address}</span>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor={this.candidateCityId}>City</label>
                    <span
                      ref={this.candidateCityId}
                      disabled={this.state.disabled}
                      type="text"
                      className="form-control no-border bold auto-height"
                    >{candidate.city}</span>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor={this.candidateStateId}>State</label>
                    <span
                      ref={this.candidateStateId}
                      disabled={this.state.disabled}
                      type="text"
                      className="form-control no-border bold auto-height"
                    >{utils.getStateByValue(candidate.state)}</span>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor={this.candidateZipId}>Zip code</label>
                    <span
                      ref={this.candidateZipId}
                      disabled={this.state.disabled}
                      type="text"
                      className="form-control no-border bold auto-height"
                    >{candidate.zip}</span>
                  </div>
                  {/* <div className="form-group col-md-3">
                    <label htmlFor={this.candidateResumeId}>Resume</label>
                    <div>
                      <input 
                        type="file"
                        ref={this.candidateResumeId}
                        className="form-control no-border"
                      />
                    </div>
                  </div> */}
                </div>
                { this.isProfileOwner(candidate.id) &&
                <button
                  type="submit"
                  ref={this.candidateWithdrawId} 
                  disabled={this.state.disabled}
                  className="btn btn-primary"
                  onClick={() => {this.removeCandidate()}}>
                  Delete Account
                </button>
                }
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
            headerTitle = 'Profile'
        />
        { this.renderCandidate() }
    </div>
    )
  }
}

export default withRouter(Candidate);