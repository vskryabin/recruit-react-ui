import React from 'react';
import PropTypes from 'prop-types';
import Toggle from './Toggle';
import Input from '../Inputs/Input'

const propTypes = {
  clickHandler: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.string,
  active: PropTypes.bool,
  inputId: PropTypes.string,
  buttonId: PropTypes.string
};

const defaultProps = {
  text: 'Search',
  icon: 'search',
  inputId: 'positionsQuickSearchInput',
  buttonId: 'positionsQuickSearchButton',
  placeholderText: 'Position Title'
};

class QuickSearchButton extends React.Component {
  constructor(props) {
    super(props);
    this.passSearchString = this.passSearchString.bind(this);
  }

  passSearchString() {
    const quickSearchInputValue = document.getElementById(this.props.inputId).value;
    this.props.clickHandler(quickSearchInputValue);
  }

  componentDidMount () {
    // Below would click on a Button when Enter is clicked in Input, starting Search
    const script = document.createElement("script");
    script.type = 'text/javascript';
    script.async = true;
    script.text = `document.getElementById('${this.props.inputId}').onkeypress = function(e){
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == '13'){
        document.getElementById('${this.props.buttonId}').click();
        return false;
      }
    }`;
    document.head.appendChild(script);
}

  render() {
    return (
      <span>
        <Input
          active = {this.props.active}
          placeholderText = {this.props.placeholderText}
          id = {this.props.inputId} />
        <Toggle                 
          clickHandler = {this.passSearchString}
          active = {this.props.active}
          text = {this.props.text}
          icon = {this.props.icon}
          id = {this.props.buttonId} />
      </span>
    )
  }
}

QuickSearchButton.propTypes = propTypes;
QuickSearchButton.defaultProps = defaultProps;

export default QuickSearchButton;
