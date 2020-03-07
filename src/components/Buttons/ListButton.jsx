import React from 'react';
import PropTypes from 'prop-types';
import Toggle from './Toggle';

const propTypes = {
  clickHandler: PropTypes.func.isRequired,
  text: PropTypes.string,
  icon: PropTypes.string,
  active: PropTypes.bool,
};

const defaultProps = {
  text: 'List',
  icon: 'list',
};

class ListButton extends React.Component {
  render() {
    return <Toggle {...this.props} />;
  }
}

ListButton.propTypes = propTypes;
ListButton.defaultProps = defaultProps;

export default ListButton;
