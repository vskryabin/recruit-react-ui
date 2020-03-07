import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Input extends React.Component {

  render() {
    const { id, clickHandler, placeholderText, active } = this.props;
    const inputClass = classNames({
      'button-toggle': true,
      active
    });

    return (
      <input id={id} className={inputClass} onClick={clickHandler} placeholder={placeholderText}/>
    );
  }
}
