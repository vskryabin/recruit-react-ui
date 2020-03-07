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
  text: 'Apply',
  icon: 'check',
};

class ApplyButton extends React.Component {
  render() {
    return <Toggle {...this.props} />;
  }
}

ApplyButton.propTypes = propTypes;
ApplyButton.defaultProps = defaultProps;

export default ApplyButton;
