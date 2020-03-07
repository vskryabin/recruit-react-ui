import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import authClient from './Auth';

function SecuredRoute(props) {
  const {component: Component, path, checkingSession, history, recruiterRequired} = props;
//   console.log(`Checking session: ${checkingSession}`);
  return (
    <Route exact path={path} render={() => {
        if (checkingSession) return <h4 className="text-center">Validating session...</h4>;
        if (!authClient.isAuthenticated()) {
            //authClient.signIn();
            history.push('/login');
            return <div></div>;
        }
        if (typeof recruiterRequired !== "undefined" && recruiterRequired && !authClient.isRecruiter()) {
            console.log(`Recruiter role required!`);
            history.push('/');
            return <div></div>;
        }
        return <Component />
    }} />
  );
}

export default withRouter(SecuredRoute);
