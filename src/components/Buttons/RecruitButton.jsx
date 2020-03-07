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
  text: 'Recruit',
  icon: 'building',
};

class RecruitButton extends React.Component {
  render() {
    return <Toggle {...this.props} />;
  }
}

RecruitButton.propTypes = propTypes;
RecruitButton.defaultProps = defaultProps;

export default RecruitButton;
