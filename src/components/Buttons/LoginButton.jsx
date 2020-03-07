import React from 'react';
import PropTypes from 'prop-types';
import Toggle from './Toggle';

const propTypes = {
  clickHandler: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.string,
  active: PropTypes.bool,
};

const defaultProps = {
  text: 'Login',
  icon: 'sign-in',
};

class LoginButton extends React.Component {
  render() {
    return <Toggle {...this.props} />;
  }
}

LoginButton.propTypes = propTypes;
LoginButton.defaultProps = defaultProps;

export default LoginButton;
