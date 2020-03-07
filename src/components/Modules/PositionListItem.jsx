// import React, { PropTypes } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import ShowMore from 'react-show-more';
import {Link} from 'react-router-dom';
import utils from '../Utils';

const propTypes = {
  view: PropTypes.string.isRequired,
  id: PropTypes.number,
  title: PropTypes.string,
  address: PropTypes.string,
  description: PropTypes.string,
  applyClickHandler: PropTypes.func,
  removeClickHandler: PropTypes.func,
  applyButton: PropTypes.bool,
  removeButton: PropTypes.bool,
  itemClass: PropTypes.string
};

const defaultProps = {
  itemClass: ''
};

class PositionListItem extends React.Component {

  render() {
    const { view, id, title, address, city, state, zip, dateOpen, description, itemClass } = this.props;
    const listClass = `list-item card ${view} ${itemClass}`;
    const style = { zIndex: 100 - this.props.index};
    const fullAddress = utils.getFullAddress(address, city, state, zip);
    const date = utils.getLocalizedDate(dateOpen);

    return (
      <li id={id} className={listClass} style={style}>
        <span>
          <Link to={`/positions/${id}`}>
            <div className="position-front">
              <h4 className="position-name">{title}</h4>                                   
            </div>   
          </Link> 
          <div className="position-info">            
            <div className="position-item-detail">{fullAddress}</div>            
            <div className="position-item-detail-middle">{date}</div>
            <div className="position-item-detail">{id}</div>
          </div>
          <div className="position-other">
            <h4 className="position-bottom">
              <ShowMore
                  lines={4}
                  more='more'
                  less='less'
                  anchorClass=''
              >{description}
              </ShowMore>
            </h4>   
          </div>
          {
            this.props.applyButton &&
            <button onClick={this.props.applyClickHandler}>
              <i className="fa fa-check"/>
            </button>
          }
          {
            this.props.removeButton &&
            <button onClick={this.props.removeClickHandler}>
              <i className="fa fa-close"/>
            </button>
          }
          <div className="clearfix"/>
        </span>
      </li>
    );
  }
}

PositionListItem.propTypes = propTypes;
PositionListItem.defaultProps = defaultProps;

export default PositionListItem;
