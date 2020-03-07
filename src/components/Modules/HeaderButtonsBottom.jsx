import React from 'react';
import PropTypes from 'prop-types';
import ListButton from '../Buttons/ListButton';
import GridButton from '../Buttons/GridButton';
import SortButton from '../Buttons/SortButton';
import ShuffleButton from '../Buttons/ShuffleButton';
import RefreshButton from '../Buttons/RefreshButton';

const propTypes = {
  view: PropTypes.string,
  order: PropTypes.string,
  sortingMethod: PropTypes.string,
  listClickHandler: PropTypes.func,
  gridClickHandler: PropTypes.func,
  sortClickHandler: PropTypes.func,
  shuffleClickHandler: PropTypes.func,
  refreshClickHandlder: PropTypes.func,
};

class HeaderButtonsBottom extends React.Component {
  render() {
    const { view, listClickHandler, gridClickHandler } = this.props;
    const { order, sortingMethod, sortClickHandler, shuffleClickHandler } = this.props;
    const { refreshClickHandlder } = this.props;

    return (
      <nav className="navbar navbar-dark bg-primary fixed-bottom nav-buttons">
        <div className="navbar-buttons">
          <div className = "abs-left">
            <ListButton
              clickHandler = {listClickHandler}
              active = {view === 'list'}
            />
            <GridButton
              clickHandler = {gridClickHandler}
              active = {view === 'grid'}
            />
          </div>
          <div className = "abs-right">
            <SortButton
              clickHandler = {sortClickHandler}
              order = {order}
              active = {sortingMethod === 'chronological'}
            />
            <ShuffleButton
              clickHandler = {shuffleClickHandler}
              active = {sortingMethod === 'shuffle'}
            />
            <RefreshButton clickHandler = {refreshClickHandlder} />
          </div>
        </div>
      </nav>
    );
  }
}

HeaderButtonsBottom.propTypes = propTypes;

export default HeaderButtonsBottom;
