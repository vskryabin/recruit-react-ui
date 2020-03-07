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
  text: 'Careers',
  icon: 'home',
};

class CareersButton extends React.Component {
  render() {
    return <Toggle {...this.props} />;
  }
}

CareersButton.propTypes = propTypes;
CareersButton.defaultProps = defaultProps;

export default CareersButton;
