import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import restClient from '../RestClient'
import HeaderButtonsTop from './HeaderButtonsTop'
import authClient from '../Auth';
import utils from '../Utils';

class UpsertCandidate extends Component {
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
    this.candidateSubmitId = 'candidateSubmit';
    this.candidateCancelEditId = 'candidateCancelEdit';

    this.state = {
      disabled: false,
      fullName: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      summary: '',
      role: '',
      resume: null,
      fullAddress: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      error: false,
      errorMessage: '',
      positionId: this.getPositionIdFromQuery(),
      position: null,
      applicationWidth: 'col-lg-12',
      candidateId: this.getCandidateIdFromPath(),
      candidate: null
    };
    this.submit = this.submit.bind(this);
  }

  getCandidateIdFromPath() {
    const { match: { params } } = this.props;
    console.log('Candidate Id from path: ' + params.candidateId);
    return params.candidateId;
  }

  updateFirstName(value) {
    this.setState({
      firstName: value,
    });
  }

  updateMiddleName(value) {
    this.setState({
      middleName: value,
    });
  }

  updateLastName(value) {
    this.setState({
      lastName: value,
    });
  }

  updateEmail(value) {
    this.setState({
      email: value,
    });
  }

  updatePassword(value) {
    this.setState({
      password: value,
    });
  }

  updateConfirmPassword(value) {
    this.setState({
      confirmPassword: value,
    });
  }

  updateSummary(value) {
    this.setState({
      summary: value,
    });
  }

  updateRole(value) {
    this.setState({
      role: value,
    });
  }

  updateResume(value) {
    this.setState({
      resume: value,
    });
  }

  updateAddress(value) {
    this.setState({
      address: value,
    });
  }

  updateCity(value) {
    this.setState({
      city: value,
    });
  }

  updateState(value) {
    this.setState({
      state: value,
    });
  }

  updateZip(value) {
    this.setState({
      zip: value,
    });
  }

  updateFullAddress(value) {
    this.fullAddress({
      fullAddress: value,
    });
  }

  updatePositionId(value) {
    this.setState({
      positionId: value,
    });
  }

  updateApplicationWidth(value) {
    this.setState({
      applicationWidth: value,
    });
  }

  getPositionIdFromQuery() {
    const params = new URLSearchParams(this.props.location.search); 
    return params.get('positionId');
  }

  submit() {
    var firstName = this.refs[this.candidateFirstNameId].value;
    var middleName = this.refs[this.candidateMiddleNameId].value;
    var lastName = this.refs[this.candidateLastNameId].value;
    var email = this.refs[this.candidateEmailId].value;
    var password = this.refs[this.candidatePasswordId].value;
    var confirmPassword = this.refs[this.candidateConfirmPasswordId].value;
    var summary = this.refs[this.candidateSummaryId].value;
    // var resume = this.refs[this.candidateResumeId].value;
    var address = this.refs[this.candidateAddressId].value;
    var city = this.refs[this.candidateCityId].value;
    var state = this.refs[this.candidateStateId].value;
    var zip = this.refs[this.candidateZipId].value;
    // var role = this.refs[this.candidateRoleId].value;

    var fieldsMap = {'First Name': firstName, 'Last Name': lastName, Email: email, Password: password, 'Confirm Password': confirmPassword, Summary: summary, Address: address, City: city, State: state, Zip: zip };
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
        this.refs[this.candidateErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
      });
      return false;
    }

    if (!utils.isValidEmail(email)) {
      this.setState({
        error: true,
        errorMessage: 'Invalid Email format: ' + email,
        disabled: false
      }, () => {
        this.refs[this.candidateErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
      });
      return false;
    }

    if (password.length < 6) {
      this.setState({
        error: true,
        errorMessage: 'Password should be at least 6 characters',
        disabled: false
      }, () => {
        this.refs[this.candidateErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
      });
      return false;
    }

    var fullAddress = utils.getFullAddress(address, city, state, zip);
    var fullName = utils.getFullName(firstName, middleName, lastName);

    this.setState({
      disabled: true,
      fullName: fullName,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      fullAddress: fullAddress,
      address: address,
      city: city,
      state: state,
      zip: zip,
      summary: summary,
      role: '',
      // resume: resume
    });

    if (password != confirmPassword) {
      this.setState({
        error: true,
        errorMessage: "Confirm password doesn't equal password!",
        disabled: false
      }, () => {
        this.refs[this.candidateErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
      });
      return;
    }

    // console.log("Resume:");
    // console.log(resume);

    if (!utils.isNotNull(this.state.candidateId)) {
      this.serverRequest = restClient.createCandidate(firstName, middleName, lastName, email, password, address, city, state, zip, summary).then(res => {
        authClient.signIn(email, password, (authenticated, authorized, errorMessage) => {
          const newCandidate = res.data;
          console.log(newCandidate);
          this.setState({
            error: false,
            errorMessage: '',
            disabled: false
          });
          console.log(`Authenticated: ${authenticated}. Authorized: ${authorized}.`);
          if (authenticated && authorized) {
            this.setState({
              error: false,
              errorMessage: '',
              disabled: false
            });
            let positionId = this.state.positionId;
            if (utils.isNotNull(positionId)) {
              console.log(`Applying to positionId: ${positionId}`);
                this.serverRequest = restClient.createApplication(newCandidate['id'], positionId).then(res => {
                  const newApplication = res.data;
                  console.log(newApplication);
                  {this.props.history.push('/my_jobs')}
                }).catch(error => {
                  console.log(error.response);  
                  var errorMessage = ''
                  if (error.response.status == 401) {
                    errorMessage = 'Issue creating candidate record.'
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
            } else {
              {this.props.history.push('/')}
            }
          } else {
            this.setState({
              error: true,
              errorMessage: errorMessage,
              disabled: false
            }, () => {
              this.refs[this.candidateErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
            });
          }
        });
      }).catch(error => {
        console.log(error.response);  
        var errorMessage = ''
        if (error.response.status == 400) {
          errorMessage = error.response.data.errorMessage;
        } else if (error.response.status == 500) {
          errorMessage = error.response.data.sqlMessage;
          if (errorMessage.includes("Duplicate entry")) {
            errorMessage = email + " already registered. Use another email.";
          }
        }
        this.setState({
          error: true,
          errorMessage: errorMessage,
          disabled: false
        }, () => {
          this.refs[this.candidateErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
        });
      });
    } else {
      this.serverRequest = restClient.updateCandidate(this.state.candidateId, firstName, middleName, lastName, email, password, address, city, state, zip, summary).then(res => {
        const updatedCandidate = res.data;
        console.log(updatedCandidate);
        this.setState({
          error: false,
          errorMessage: '',
          disabled: false
        });
        this.props.history.push('/candidates/' + this.state.candidateId);
      }).catch(error => {
        console.log(error.response);  
        var errorMessage = ''
        if (error.response.status == 401) {
          errorMessage = 'You have to login to update candidate!'
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
  }

  componentDidMount () {
    // Below would click on Submit when Enter is clicked
    const script = document.createElement("script");
    script.type = 'text/javascript';
    script.async = true;
    script.text = `document.onkeydown = function(e){
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == '13'){
        document.getElementById('${this.candidateSubmitId}').click();
        return false;
      }
    };`;
    document.head.appendChild(script);

    let positionId = this.state.positionId;
    if (utils.isNotNull(positionId)) {
      this.serverRequest = restClient.getPositionById(positionId).then(res => {
        const position = res.data;
        this.setState({
          position: position,
          applicationWidth: 'col-lg-8'
        });
        console.log(position);
      }).catch(error => {
        console.log(error.response);
      });
    }

    var candidateId = this.getCandidateIdFromPath();
    if (utils.isNotNull(candidateId)) {
      this.getCandidateById(candidateId);
    }
  }

  getCandidateById(candidateId) {
    this.serverRequest = restClient.getCandidateById(candidateId).then(res => {
      const candidate = res.data;
      this.setState({ candidate });
      console.log("Candidate from REST");
      console.log(candidate);

      this.refs[this.candidateFirstNameId].value = candidate.firstName;
      this.refs[this.candidateMiddleNameId].value = candidate.middleName;
      this.refs[this.candidateLastNameId].value = candidate.lastName;
      this.refs[this.candidateEmailId].value = candidate.email;
      this.refs[this.candidatePasswordId].value = '•••••••••••••••••';
      this.refs[this.candidateConfirmPasswordId].value = '•••••••••••••••••';
      this.refs[this.candidateSummaryId].value = candidate.summary;
      // this.refs[this.candidateResumeId].value = candidate.resume;
      this.refs[this.candidateAddressId].value = candidate.address;
      this.refs[this.candidateCityId].value = candidate.city;
      this.refs[this.candidateStateId].value = candidate.state;
      this.refs[this.candidateZipId].value = candidate.zip;
    }).catch(error => {
      console.log(error.response);
    });
  }

  renderCandidate() {
    const {position, positionId, applicationWidth, candidate, candidateId} = this.state;
    console.log(`PositionId: ${positionId}`);
    if (utils.isNotNull(candidateId) && candidate === null) return <p></p>;
    return (
      <div className="container container-full" ref={this.candidateFormId}>
        <div className="row">
         { position !== null &&
          <div className="col-lg-4 col-md-12 col-sm-12">
           <div className="well form-summary">
              <div className="jumbotron jumbo-box col-12">
                <h4 className="jumbo-header">{position.title}</h4>
                <span className="lead jumbo-label">Full Address</span>
                <p className="lead">{utils.getFullAddress(position.address, position.city, position.state, position.zip)}</p>
                <span className="lead jumbo-label">Date Open</span>
                <p className="lead">{utils.getLocalizedDate(position.dateOpen)}</p>
                <span className="lead jumbo-label">Description</span>
                <p className="lead">{position.description}</p>
              </div>
            </div>
          </div>
         }
          <div className={applicationWidth + " col-md-12 col-sm-12"}>
            <div className="card border-primary">
                <div className="card-header">
                  <span>Profile Details</span>
                  {
                      utils.isNotNull(candidateId) && candidate !== null && 
                      <button
                        type="submit"
                        ref={this.candidateCancelEditId} 
                        disabled={this.state.disabled}
                        className="btn btn-secondary top-right-button"
                        onClick={() => {this.props.history.push(`/candidates/${candidateId}`)}}>
                        Cancel
                      </button>
                  }
                </div>
                <div className="card-body text-left">
                {this.state.error &&
                <div ref={this.candidateErrorId} className="alert alert-danger">{this.state.errorMessage}</div>
                }
                <div className="form-row">
                  <div className="form-group required col-md-4">
                      <label className="control-label" htmlFor={this.candidateFirstNameId}>First Name</label>
                      <input
                        ref={this.candidateFirstNameId}
                        maxLength="255"
                        disabled={this.state.disabled}
                        type="text"
                        onBlur={(e) => {this.updateFirstName(e.target.value)}}
                        className="form-control"
                        placeholder="Enter First Name"
                        // defaultValue="Gretchen"
                      />
                  </div>
                  <div className="form-group col-md-4">
                      <label className="control-label" htmlFor={this.candidateMiddleNameId}>Middle Name</label>
                      <input
                        ref={this.candidateMiddleNameId}
                        maxLength="255"
                        disabled={this.state.disabled}
                        type="text"
                        onBlur={(e) => {this.updateMiddleName(e.target.value)}}
                        className="form-control"
                        placeholder="Optional"
                      />
                  </div>
                  <div className="form-group required col-md-4">
                      <label className="control-label" htmlFor={this.candidateLastNameId}>Last Name</label>
                      <input
                        ref={this.candidateLastNameId}
                        maxLength="255"
                        disabled={this.state.disabled}
                        type="text"
                        onBlur={(e) => {this.updateLastName(e.target.value)}}
                        className="form-control"
                        placeholder="Enter Last Name"
                        // defaultValue="Adams"
                      />
                  </div>
                </div>
                <div className="form-row">
                <div className="form-group required col-md-4">
                    <label className="control-label" htmlFor={this.candidateEmailId}>Email</label>
                    <input
                        ref={this.candidateEmailId}
                        maxLength="255"
                        rows="2"
                        disabled={this.state.disabled}
                        type="text"
                        onBlur={(e) => {this.updateEmail(e.target.value)}}
                        className="form-control"
                        placeholder="Enter Email"
                        // defaultValue="gretchen@example.com"
                      />
                  </div>
                  <div className="form-group required col-md-4">
                      <label className="control-label" htmlFor={this.candidatePasswordId}>Password</label>
                      <input
                        ref={this.candidatePasswordId}
                        maxLength="255"
                        disabled={this.state.disabled}
                        type="password"
                        onBlur={(e) => {this.updatePassword(e.target.value)}}
                        className="form-control"
                        placeholder="Enter Password"
                        // defaultValue="welcome"
                      />
                  </div>
                  <div className="form-group required col-md-4">
                    <label className="control-label" htmlFor={this.candidateConfirmPasswordId}>Confirm Password</label>
                    <input
                        ref={this.candidateConfirmPasswordId}
                        maxLength="255"
                        rows="2"
                        disabled={this.state.disabled}
                        type="password"
                        onBlur={(e) => {this.updateConfirmPassword(e.target.value)}}
                        className="form-control"
                        placeholder="Confirm Password"
                        // defaultValue="welcome"
                      />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group required col-md-12">
                      <label className="control-label" htmlFor={this.candidateSummaryId}>Summary</label>
                      <textarea
                          ref={this.candidateSummaryId}
                          maxLength="65535"
                          rows="2"
                          disabled={this.state.disabled}
                          type="text"
                          onBlur={(e) => {this.updateSummary(e.target.value)}}
                          className="form-control"
                          placeholder="Enter detailed Summary"
                          // defaultValue="Proven work experience as a Talent Acquisition Specialist or similar role. Hands-on experience with full-cycle recruiting using various interview techniques and evaluation methods"
                        />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group required col-md-6">
                    <label className="control-label" htmlFor={this.candidateAddressId}>Address</label>
                    <input
                      ref={this.candidateAddressId}
                      disabled={this.state.disabled}
                      type="text"
                      onBlur={(e) => {this.updateAddress(e.target.value)}}
                      className="form-control"
                      placeholder="123 Main st"
                      // defaultValue="123 Main st"
                    />
                  </div>
                  <div className="form-group required col-md-6">
                    <label className="control-label" htmlFor={this.candidateCityId}>City</label>
                    <input
                      ref={this.candidateCityId}
                      disabled={this.state.disabled}
                      type="text"
                      onBlur={(e) => {this.updateCity(e.target.value)}}
                      className="form-control"
                      placeholder="City"
                      // defaultValue="Los Altos"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="required form-group col-md-6">
                    <label className="control-label" htmlFor={this.candidateStateId}>State</label>
                    <select
                      ref={this.candidateStateId}
                      disabled={this.state.disabled}
                      onBlur={(e) => {this.updateState(e.target.value)}}
                      className="form-control"
                      // defaultValue="CA"
                    >
                      <option value="">Choose...</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="DC">District Of Columbia</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                  </div>
                  <div className="form-group required col-md-6">
                    <label className="control-label" htmlFor={this.candidateZipId}>Zip code</label>
                    <input
                      ref={this.candidateZipId}
                      disabled={this.state.disabled}
                      type="text"
                      onBlur={(e) => {this.updateZip(e.target.value)}}
                      className="form-control"
                      placeholder="Zip code. Zip plus"
                      // defaultValue="94022"
                    />
                  </div>
                  {/* <div className="form-group col-md-3">
                    <label htmlFor={this.candidateResumeId}>Resume</label>
                    <div>
                      <input 
                        type="file"
                        onBlur={(e) => {this.updateResume(e.target.value)}}
                        ref={this.candidateResumeId}
                        className="form-control no-border"
                      />
                    </div>
                  </div> */}
                </div>
                <button
                  type="submit"
                  id={this.candidateSubmitId} 
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
            headerTitle = {utils.isNotNull(this.state.candidateId)? 'Edit Profile' : 'Apply'}
            />
        { this.renderCandidate() }
    </div>
    )
  }
}

export default withRouter(UpsertCandidate);