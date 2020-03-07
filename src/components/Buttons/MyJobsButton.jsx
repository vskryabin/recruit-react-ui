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
  text: 'My Jobs',
  icon: 'briefcase',
};

class MyJobsButton extends React.Component {
  render() {
    return <Toggle {...this.props} />;
  }
}

MyJobsButton.propTypes = propTypes;
MyJobsButton.defaultProps = defaultProps;

export default MyJobsButton;
