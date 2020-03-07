import React from 'react';
import PropTypes from 'prop-types';
import LoginButton from '../Buttons/LoginButton';
import CareersButton from '../Buttons/CareersButton';
import ApplyButton from '../Buttons/ApplyButton';
import LogoutButton from '../Buttons/LogoutButton';
import MyJobsButton from '../Buttons/MyJobsButton';
import RecruitButton from '../Buttons/RecruitButton'
import QuickSearchSet from '../Buttons/QuickSearchSet';
import {Link} from 'react-router-dom';
import authClient from '../Auth'
import {withRouter} from 'react-router-dom';

const propTypes = {
  headerTitle: PropTypes.string,
  quickSearchPlaceholder: PropTypes.string,
  seachEnabled: PropTypes.bool,
  quickSearchHandler: PropTypes.func,
  loginStateHandler: PropTypes.func
};

const defaultProps = {
  headerTitle: 'Careers',
  quickSearchPlaceholder: 'Position Title',
  searchEnabled: true
};

class HeaderButtonsTop extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.toggleLoginState = this.toggleLoginState.bind(this);
  }

  toggleLoginState() {
    this.props.loginStateHandler();
  }

  logout() {
    authClient.signOut((loggedOut) => {
      if (loggedOut) {
        this.forceUpdate();
        if (this.props.history.location.pathname !== '/') {
          this.props.history.push('/');
        }
        console.log(`LoggedOut: ${loggedOut}`)
        this.toggleLoginState();
      }
    });
  }

  render() {
    const { quickSearchHandler, quickSearchPlaceholder, searchEnabled, headerTitle } = this.props;

    return (
      <nav className="navbar navbar-dark bg-primary fixed-top nav-buttons text-center">
        {/* <Link className="navbar-brand position-center" to="/"> */}
        <span className="navbar-brand position-center">
          {headerTitle}
        </span>
        {/* </Link> */}
        <div className="navbar-buttons">
          <div className = "abs-left">
            {
              !authClient.isAuthenticated() && this.props.history.location.pathname !== '/login' &&
              <Link to="/login">
                <LoginButton/>
              </Link>
            }
            {
              this.props.history.location.pathname === '/login' &&
              <Link to="/">
                <CareersButton/>
              </Link>
            }

            {
              !authClient.isAuthenticated() && this.props.history.location.pathname !== '/new_candidate' &&
              <Link to="/new_candidate">
                <ApplyButton/>
              </Link>
            }
            {
              this.props.history.location.pathname === '/new_candidate' &&
              <Link to="/">
                <CareersButton/>
              </Link>
            }

            {
              authClient.isAuthenticated() &&
              <LogoutButton
                clickHandler = {this.logout}
                userName = {authClient.getFullName()}
              />
            }

            {
              authClient.isAuthenticated() && this.props.history.location.pathname !== '/my_jobs' &&
              <Link to="/my_jobs">
                <MyJobsButton/>
              </Link>
            }
            {
              this.props.history.location.pathname === '/my_jobs' &&
              <Link to="/">
                <CareersButton/>
              </Link>
            }

            {
              authClient.isAuthenticated() && authClient.isRecruiter() && this.props.history.location.pathname !== '/recruit' &&
              <Link to="/recruit">
                <RecruitButton/>
              </Link>
            }
            {
              this.props.history.location.pathname === '/recruit' &&
              <Link to="/">
                <CareersButton/>
              </Link>
            }
          </div>
          {
            quickSearchHandler && searchEnabled &&
            <div className = "abs-right">
              <QuickSearchSet 
              clickHandler = {quickSearchHandler}
              placeholderText = {quickSearchPlaceholder}
              />
            </div>
          }
        </div>
      </nav>
    );
  }
}

HeaderButtonsTop.propTypes = propTypes;
HeaderButtonsTop.defaultProps = defaultProps;

export default withRouter(HeaderButtonsTop);
