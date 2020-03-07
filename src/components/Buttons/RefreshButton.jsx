import React from 'react';
import PropTypes from 'prop-types';
import Toggle from './Toggle';

const propTypes = {
  clickHandler: PropTypes.func.isRequired,
  text: PropTypes.string,
  icon: PropTypes.string,
};

const defaultProps = {
  text: 'Refresh',
  icon: 'refresh',
};

class RefreshButton extends React.Component {
  render() {
    return <Toggle {...this.props} />;
  }
}

RefreshButton.propTypes = propTypes;
RefreshButton.defaultProps = defaultProps;

export default RefreshButton;
