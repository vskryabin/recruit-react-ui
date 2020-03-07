import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import PositionsList from './Modules/PositionsList';
import Position from './Modules/Position';
import Login from './Modules/Login';
import UpsertCandidate from './Modules/UpsertCandidate';
import MyJobsPositionsList from './Modules/MyJobsPositionsList'
import RecruitPositionsList from './Modules/RecruitPositionsList'
import UpsertPosition from './Modules/UpsertPosition'
import authClient from './Auth'
import SecuredRoute from './SecuredRoute';
import CandidatesList from './Modules/CandidatesList';
import Candidate from './Modules/Candidate';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
    }
  }

  componentDidMount() {
    authClient.silentAuth((authorized) => {
      console.log("silentAuth result: " + authorized);
      this.forceUpdate();
      this.setState({checkingSession:false});
    });
  }

  render() {
    return (
      <div>
        <Route exact path='/' 
               render={(props) => <PositionsList {...props} checkingSession={this.state.checkingSession} />}
        />
        <Route exact path='/login' component={Login}/>
        <Route exact path='/new_candidate' component={UpsertCandidate}/>
        <Route exact path='/positions/:positionId' component={Position}/>
        {/* <Route exact path='/candidates/:candidateId' component={Candidate}/> */}
        <SecuredRoute exact path='/candidates/:candidateId/edit' 
                      component={UpsertCandidate}
                      checkingSession={this.state.checkingSession}
                      recruiterRequired={false} />
        <SecuredRoute exact path='/candidates/:candidateId' 
                      component={Candidate}
                      checkingSession={this.state.checkingSession}
                      recruiterRequired={false} />
        <SecuredRoute exact path='/positions/:positionId/edit' 
                      component={UpsertPosition}
                      checkingSession={this.state.checkingSession}
                      recruiterRequired={true} />
        <SecuredRoute exact path='/positions/:positionId/candidates' 
                      component={CandidatesList}
                      checkingSession={this.state.checkingSession}
                      recruiterRequired={true} />
        <SecuredRoute exact path='/candidates' 
                      component={CandidatesList}
                      checkingSession={this.state.checkingSession}
                      recruiterRequired={true} />
        <SecuredRoute exact path='/my_jobs' 
                      component={MyJobsPositionsList}
                      checkingSession={this.state.checkingSession} />
        <SecuredRoute exact path='/recruit' 
                      component={RecruitPositionsList}
                      checkingSession={this.state.checkingSession}
                      recruiterRequired={true} />
        <SecuredRoute exact path='/new_position' 
                      component={UpsertPosition}
                      checkingSession={this.state.checkingSession}
                      recruiterRequired={true} />
      </div>
    );
  }
}

export default withRouter(App);