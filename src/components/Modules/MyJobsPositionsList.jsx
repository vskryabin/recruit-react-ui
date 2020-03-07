import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import authClient from '../Auth';
import PositionsList from './PositionsList'
import utils from '../Utils';

class MyJobsPositionsList extends Component {

    renderMyJobs() {
        var id;
            if (utils.isNotNull(authClient.getProfile())) {
                id = authClient.getProfile().id;
            }
        // console.log("My Jobs Id = " + id)
        return (
            <PositionsList
              headerTitle='My Jobs'
              candidateId={id}
              searchEnabled={false}
              removeButton={true}
              applyButton={false}
            />
        )
    }

    render() {
      return this.renderMyJobs();
    }
  }
  
  export default withRouter(MyJobsPositionsList);