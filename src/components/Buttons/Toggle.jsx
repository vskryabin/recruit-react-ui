import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Toggle extends React.Component {
  render() {
    const { id, clickHandler, text, icon, active, large } = this.props;
    const buttonClass = classNames({
      'button-toggle': true,
      'no-icon': !icon,
      active,
      large,
    });
    const iconClass = `fa fa-fw fa-${icon}`;

    return (
      <button id={id} className={buttonClass} onClick={clickHandler}>
        <i className={iconClass} />
        {text}
      </button>
    );
  }
}
