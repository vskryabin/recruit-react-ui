import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import restClient from '../RestClient';
import HeaderButtonsTop from './HeaderButtonsTop';
import utils from '../Utils';
import authClient from '../Auth';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class UpsertPosition extends Component {
  constructor(props) {
    super(props);

    this.positionFormId = 'positionForm';
    this.positionTitleId = 'positionTitle';
    this.positionDescriptionId = 'positionDescription';
    this.positionAddressId ='positionAddress';
    this.positionCityId = 'positionCity';
    this.positionStateId = 'positionState';
    this.positionZipId = 'positionZip';
    this.positionDateOpenId = 'positionDateOpen';
    this.positionErrorId = 'positionError';
    this.positionCancelEditId = 'positionCancelEdit';
    this.positionSubmitId = 'positionSubmit';

    this.state = {
      disabled: false,
      title: '',
      description: '',
      fullAddress: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      error: false,
      errorMessage: '',
      positionId: this.getPositionIdFromPath(),
      position: null,
      dateOpen: ''
    };

    this.handleDateOpenChange = this.handleDateOpenChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  getPositionIdFromPath() {
    const { match: { params } } = this.props;
    console.log('Position Id from path: ' + params.positionId);
    return params.positionId;
  }

  handleDateOpenChange(date) {
    this.setState({
      dateOpen: date
    });
  }

  updateTitle(value) {
    this.setState({
      username: value,
    });
  }

  updateDescription(value) {
    this.setState({
      description: value,
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

  submit() {
    var title = this.refs[this.positionTitleId].value;
    var address = this.refs[this.positionAddressId].value;
    var city = this.refs[this.positionCityId].value;
    var state = this.refs[this.positionStateId].value;
    var zip = this.refs[this.positionZipId].value;
    var fullAddress = utils.getFullAddress(address, city, state, zip);
    // let dateOpen = this.state.dateOpen;
    let dateOpen = document.getElementById(this.positionDateOpenId).value;
    var description = this.refs[this.positionDescriptionId].value;

    var fieldsMap = {Title: title, Address: address, City: city, State: state, Zip: zip, 'Date Open': dateOpen, Description: description };
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
        this.refs[this.positionErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
      });
      return false;
    }

    try {
      dateOpen = utils.getISODate(dateOpen);;
    } catch (err) {
      var errorMessage = 'Incorrect date format!';
      this.setState({
        error: true,
        errorMessage: errorMessage,
        disabled: false
      }, () => {
        this.refs[this.positionErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
      });
      return false;
    }

    this.setState({
      disabled: true,
      title: title,
      address: address,
      city: city,
      state: state,
      zip: zip,
      fullAddress: fullAddress,
      dateOpen: dateOpen,
      description: description
    });
    if (!utils.isNotNull(this.state.positionId)) {
      this.serverRequest = restClient.createPosition(title, address, city, state, zip, dateOpen, description).then(res => {
        const newPosition = res.data;
        console.log(newPosition);
        this.setState({
          error: false,
          errorMessage: '',
          disabled: false
        });
        this.props.history.push('/recruit');
      }).catch(error => {
        console.log(error.response);  
        var errorMessage = ''
        if (error.response.status == 401) {
          errorMessage = 'You have to login to create position!'
        } else if (error.response.status == 500) {
          errorMessage = error.response.data.sqlMessage;
        }
        this.setState({
          error: true,
          errorMessage: errorMessage,
          disabled: false
        }, () => {
          this.refs[this.positionErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
        });
      });
    } else {
      this.serverRequest = restClient.updatePosition(this.state.positionId, title, address, city, state, zip, dateOpen, description).then(res => {
        const updatedPosition = res.data;
        console.log(updatedPosition);
        this.setState({
          error: false,
          errorMessage: '',
          disabled: false
        });
        this.props.history.push('/positions/' + this.state.positionId);
      }).catch(error => {
        console.log(error.response);  
        var errorMessage = ''
        if (error.response.status == 401) {
          errorMessage = 'You have to login to update position!'
        } else if (error.response.status == 500) {
          errorMessage = error.response.data.sqlMessage;
        }
        this.setState({
          error: true,
          errorMessage: errorMessage,
          disabled: false
        }, () => {
          this.refs[this.positionErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
        });
      });
    }
  }

  componentDidMount () {
    // Below would click on a Submit when Enter is clicked
    const script = document.createElement("script");
    script.type = 'text/javascript';
    script.async = true;
    script.text = `document.onkeydown = function(e){
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == '13'){
        document.getElementById('${this.positionSubmitId}').click();
        return false;
      }
    };`;
    document.head.appendChild(script);
    var positionId = this.getPositionIdFromPath();
    if (utils.isNotNull(positionId)) {
      this.getPositionById(positionId);
    }
  }

  getPositionById(positionId) {
    this.serverRequest = restClient.getPositionById(positionId).then(res => {
      const position = res.data;
      this.setState({ position });
      console.log("Position from REST");
      console.log(position);

      this.refs[this.positionTitleId].value = position.title;
      this.refs[this.positionDescriptionId].value = position.description;
      this.refs[this.positionAddressId].value = position.address;
      this.refs[this.positionCityId].value = position.city;
      this.refs[this.positionStateId].value = position.state;
      this.refs[this.positionZipId].value = position.zip;
      var dateOpen = utils.getLocalizedDate(position.dateOpen);
      document.getElementById(this.positionDateOpenId).value = dateOpen;
    }).catch(error => {
      console.log(error.response);
    });
  }

  renderPosition() {
    const {position, positionId} = this.state;
    console.log("Current Position Render:");
    console.log(position);
    if (utils.isNotNull(positionId) && position === null) return <p></p>;
    return (
      <div className="container" ref={this.positionFormId}>
        <div className="row">
          <div className="col-12">
            <div className="card border-primary">
                <div className="card-header">
                  <span>Position Details</span>
                  {
                      utils.isNotNull(positionId) && position !== null && 
                      <button
                        type="submit"
                        ref={this.positionCancelEditId} 
                        disabled={this.state.disabled}
                        className="btn btn-secondary top-right-button"
                        onClick={() => {this.props.history.push(`/positions/${positionId}`)}}>
                        Cancel
                      </button>
                  }
                </div>
                <div className="card-body text-left">
                {this.state.error &&
                <div ref={this.positionErrorId} className="alert alert-danger">{this.state.errorMessage}</div>
                }
                <div className="form-group required">
                    <label className="control-label" htmlFor={this.positionTitleId}>Title</label>
                    <input
                      ref={this.positionTitleId}
                      maxLength="255"
                      disabled={this.state.disabled}
                      type="text"
                      onBlur={(e) => {this.updateTitle(e.target.value)}}
                      className="form-control"
                      placeholder="Enter position Title"
                      // defaultValue="VP, Development"
                    />
                </div>
                <div className="form-group required">
                  <label className="control-label" htmlFor={this.positionDescriptionId}>Description</label>
                  <textarea
                      ref={this.positionDescriptionId}
                      maxLength="65535"
                      rows="2"
                      disabled={this.state.disabled}
                      type="text"
                      onBlur={(e) => {this.updateDescription(e.target.value)}}
                      className="form-control"
                      placeholder="Enter detailed Description"
                      // defaultValue="Vice President (VP), Development serves as a key leadership team member and an active participant in making strategic decisions. This position is responsible for all business and development activities. The successful candidate will help forge new relationships to build visibility of the organization."
                    />
                </div>
                <div className="form-row">
                  <div className="form-group required col-md-6">
                    <label className="control-label" htmlFor={this.positionAddressId}>Address</label>
                    <input
                      ref={this.positionAddressId}
                      disabled={this.state.disabled}
                      type="text"
                      onBlur={(e) => {this.updateAddress(e.target.value)}}
                      className="form-control"
                      placeholder="123 Main st"
                      // defaultValue="123 Main st"
                    />
                  </div>
                  <div className="form-group required col-md-6">
                    <label className="control-label" htmlFor={this.positionCityId}>City</label>
                    <input
                      ref={this.positionCityId}
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
                  <div className="form-group required col-md-6">
                    <label className="control-label" htmlFor={this.positionStateId}>State</label>
                    <select
                      ref={this.positionStateId}
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
                  <div className="form-group required col-md-3">
                    <label className="control-label" htmlFor={this.positionZipId}>Zip code</label>
                    <input
                      ref={this.positionZipId}
                      disabled={this.state.disabled}
                      type="text"
                      onBlur={(e) => {this.updateZip(e.target.value)}}
                      className="form-control"
                      placeholder="Zip code. Zip plus"
                      // defaultValue="94022"
                    />
                  </div>
                  <div className="form-group required col-md-3">
                    <label className="control-label" htmlFor={this.positionDateOpenId}>Date Open</label>
                    <div>
                      <DatePicker
                        id={this.positionDateOpenId}
                        className="form-control"
                        // selected={position != null? utils.getLocalizedDate(position.dateOpen) : this.state.initialDateOpen}
                        selected={this.state.dateOpen}
                        onChange={this.handleDateOpenChange}
                        todayButton={"Today"}
                        showMonthDropdown
                        showYearDropdown
                        placeholderText="Select a date"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  id={this.positionSubmitId} 
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
            headerTitle = {utils.isNotNull(this.state.positionId)? 'Edit Position' : 'Open Position'}
        />
        { this.renderPosition() }
    </div>
    )
  }
}

export default withRouter(UpsertPosition);