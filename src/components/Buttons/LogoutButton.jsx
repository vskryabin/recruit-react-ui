import React from 'react';
import PropTypes from 'prop-types';
import Toggle from './Toggle';
import {Link} from 'react-router-dom';
import authClient from '../Auth';
import {withRouter} from 'react-router-dom';

const propTypes = {
  clickHandler: PropTypes.func.isRequired,
  userName: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.string,
  active: PropTypes.bool,
};

const defaultProps = {
  text: 'Logout',
  icon: 'sign-out',
  userName: '',
};

class LogoutButton extends React.Component {
  render() {
    let profileLink = `/candidates/${authClient.profile['id']}`;
    if (this.props.history.location.pathname === profileLink || this.props.history.location.pathname === (profileLink + '/edit')) {
      profileLink = '/';
    }
    return (
      <span className="logout-box">
        <Link className="mr-2 text-white text-decoration-none" to={profileLink}>
          {this.props.userName}
        </Link>
        <Toggle {...this.props} />
      </span>
    )
  }
}

LogoutButton.propTypes = propTypes;
LogoutButton.defaultProps = defaultProps;

export default withRouter(LogoutButton);
