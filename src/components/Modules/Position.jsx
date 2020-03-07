import React, {Component} from 'react';
import restClient from '../RestClient.js'
import {withRouter} from 'react-router-dom';
import HeaderButtonsTop from './HeaderButtonsTop'
import utils from '../Utils';
import authClient from '../Auth';

class Position extends Component {
  constructor(props) {
    super(props);

    this.positionFormId = 'positionForm';
    this.positionTitleId = 'positionTitle';
    this.positionDescriptionId = 'positionDescription';
    this.positionAddressId = 'positionAddress';
    this.positionCityId = 'positionCity';
    this.positionStateId = 'positionState';
    this.positionZipId = 'positionZip';
    this.positionDateOpenId = 'positionDateOpen';
    this.positionErrorId = 'positionError';
    this.positionEditId = 'positionEdit';
    this.positionWithdrawId = 'positionWithdraw';
    this.positionApplyId = 'positionApply';

    this.state = {
      positionId: this.getPositionIdFromPath(),
      position: null,
      disabled: false,
      error: false,
      errorMessage: '',
      appliedPositions: []
    };
  }

  getPositionIdFromPath() {
    const { match: { params } } = this.props;
    console.log('Position Id from path: ' + params.positionId);
    return params.positionId;
  }

  applyToPosition() {
    if (authClient.isAuthenticated()) {
      this.serverRequest = restClient.createApplication(authClient.profile['id'], this.state.positionId).then(res => {
        const newApplication = res.data;
        console.log(newApplication);
        this.props.history.push('/my_jobs');
      }).catch(error => {
        console.log(error.response);  
        var errorMessage = ''
        if (error.response.status == 401) {
          errorMessage = 'You have to login to apply to position!'
        } else if (error.response.status == 500) {
          errorMessage = error.response.data.sqlMessage;
          if (errorMessage.includes("Duplicate entry")){
            errorMessage = "You've already applied to this position!";
          } 
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
      this.props.history.push('/new_candidate?positionId=' + this.state.positionId);
    }
  }

  removePosition() {
    this.serverRequest = restClient.deleteApplication(authClient.profile['id'], this.state.positionId).then(res => {
      console.log(res);
      this.props.history.push('/');
    }).catch(error => {
      console.log(error.response);
      var errorMessage = ''
      if (error.response.status == 401) {
        errorMessage = 'You have to login to cancel application!'
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

  editPosition() {
    this.props.history.push('/positions/' + this.state.positionId + '/edit')
  }

  componentDidMount() {
    var positionId = this.getPositionIdFromPath();
    this.getPositionById(positionId);
    this.getAppliedPositions();
  }

  getPositionById(positionId) {
    this.serverRequest = restClient.getPositionById(positionId).then(res => {
      const position = res.data;
      this.setState({ position });
      console.log(position);
    }).catch(error => {
      console.log(error.response);
    });
  }

  getAppliedPositions() {
    if (authClient.isAuthenticated()) {
      this.serverRequest = restClient.getPositionsByCandidateId(authClient.profile['id']).then(res => {
        let appliedPositions = res.data;
        console.log('Applied positions:');
        console.log(appliedPositions);
        if (!utils.isNotNull(appliedPositions)) {
          appliedPositions = [];
        }
        this.setState({
          appliedPositions: appliedPositions
        });
      }).catch(error => {
        console.log(error.response);
      });
    }
  }

  renderPosition() {
    const {position} = this.state;
    // if (position === null) return <p>Loading...</p>;
    if (position === null) return <p></p>;
    return (
      <div className="container" ref={this.positionFormId}>
      <div className="row">
        <div className="col-12">
          <div className="card border-primary">
            <div className="card-header">
              <span>Position Details</span>
              {
                  authClient.isAuthenticated() && authClient.isAdmin() && 
                  <button
                    type="submit"
                    ref={this.positionEditId} 
                    disabled={this.state.disabled}
                    className="btn btn-secondary top-right-button"
                    onClick={() => {this.editPosition()}}>
                    Edit
                  </button>
              }
            </div>
              <div className="card-body text-left">
              {this.state.error &&
              <div ref={this.positionErrorId} className="alert alert-danger">{this.state.errorMessage}</div>
              }
              <div className="form-group">
                  <label htmlFor={this.positionTitleId}>Title</label>
                  <span
                    ref={this.positionTitleId}
                    maxLength="255"
                    disabled={this.state.disabled}
                    type="text"
                    className="form-control no-border bold auto-height"
                  >{position.title}</span>
              </div>
              <div className="form-group">
                <label htmlFor={this.positionDescriptionId}>Description</label>
                <span
                    ref={this.positionDescriptionId}
                    maxLength="65535"
                    rows="2"
                    disabled={this.state.disabled}
                    type="text"
                    className="form-control no-border bold auto-height"
                  >{position.description}</span>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor={this.positionAddressId}>Address</label>
                  <span
                    ref={this.positionAddressId}
                    disabled={this.state.disabled}
                    type="text"
                    className="form-control no-border bold auto-height"
                  >{position.address}</span>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor={this.positionCityId}>City</label>
                  <span
                    ref={this.positionCityId}
                    disabled={this.state.disabled}
                    type="text"
                    className="form-control no-border bold auto-height"
                  >{position.city}</span>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor={this.positionStateId}>State</label>
                  <span
                    ref={this.positionStateId}
                    disabled={this.state.disabled}
                    type="text"
                    className="form-control no-border bold auto-height"
                    defaultValue={position.state}
                  >{utils.getStateByValue(position.state)}</span>
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor={this.positionZipId}>Zip</label>
                  <span
                    ref={this.positionZipId}
                    disabled={this.state.disabled}
                    type="text"
                    className="form-control no-border bold auto-height"
                  >{position.zip}</span>
                </div>
                <div className="form-group col-md-3">
                    <label htmlFor={this.positionDateOpenId}>Date Open</label>
                    <div>
                      <span
                        ref={this.positionDateOpenId}
                        disabled={this.state.disabled}
                        type="text"
                        className="form-control no-border bold auto-height"
                      >{utils.getLocalizedDate(position.dateOpen)}</span>
                    </div>
                  </div>
              </div>
              { !this.state.appliedPositions.map(item => item.id).includes(position.id) &&
              <button
                type="submit"
                ref={this.positionApplyId} 
                disabled={this.state.disabled}
                className="btn btn-primary"
                onClick={() => {this.applyToPosition()}}>
                Apply
              </button>
              }
              { this.state.appliedPositions.map(item => item.id).includes(position.id) &&
              <button
                type="submit"
                ref={this.positionWithdrawId} 
                disabled={this.state.disabled}
                className="btn btn-primary"
                onClick={() => {this.removePosition()}}>
                Withdraw Application
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
          headerTitle = 'Position'
        />
        { this.renderPosition() }
      </div>
    )
  }
}

export default withRouter(Position);