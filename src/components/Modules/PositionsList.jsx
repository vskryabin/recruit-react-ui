import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Dropdown from 'react-dropdown';
import FlipMove from 'react-flip-move';
import {shuffle} from 'lodash';

// import * as query from './getData';
import HeaderButtonsBottom from './HeaderButtonsBottom';
import HeaderButtonsTop from './HeaderButtonsTop';
import PositionListItem from './PositionListItem';

import Toggle from '../Buttons/Toggle';
import restClient from '../RestClient'
import {withRouter} from 'react-router-dom';
import authClient from '../Auth';
import utils from '../Utils';

const propTypes = {
  headerTitle: PropTypes.string,
  candidateId: PropTypes.number,
  searchEnabled: PropTypes.bool,
  applyButton: PropTypes.bool,
  removeButton: PropTypes.bool,
  itemClass: PropTypes.string,
  checkingSession: PropTypes.bool
};

const defaultProps = {
  searchEnabled: true,
  headerTitle: 'Careers',
  applyButton: true,
  removeButton: false,
  itemClass: '',
  checkingSession: true
};

class PositionsList extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        removedPositions: [],
        appliedPositions: [],
        foundPositions: [],
        view: 'list',
        order: 'asc',
        searchQuery: '',
        selectedSeries: '2',
        sortingMethod: 'chronological',
        enterLeaveAnimation: 'accordianHorizontal',
        inProgress: false,
      };

      this.sortShuffle = this.sortShuffle.bind(this);
      this.toggleSort  = this.toggleSort.bind(this);
      this.toggleGrid  = this.toggleGrid.bind(this);
      this.toggleList  = this.toggleList.bind(this);
      this.refresh     = this.refresh.bind(this);
      this.selectSeries = this.selectSeries.bind(this);
      this.setSearchQuery = this.setSearchQuery.bind(this);
      this.toggleLoginState = this.toggleLoginState.bind(this);
    }

    toggleLoginState() {
      if (authClient.isAuthenticated()) {
        this.getData();   
        this.getAppliedPositions();
      } else {
        this.setState({
          appliedPositions: []
        });
      }
    }

    toggleSort() {
      const sortAsc  = (a, b) => parseInt(a.id, 10) - parseInt(b.id, 10);
      const sortDesc = (a, b) => parseInt(b.id, 10) - parseInt(a.id, 10);

      this.setState({
        order: (this.state.order === 'asc' ? 'desc' : 'asc'),
        sortingMethod: 'chronological',
        foundPositions: this.state.foundPositions.sort(this.state.order === 'asc' ? sortDesc : sortAsc),
      });
    }

    setSearchQuery(query) {
      // console.log(`Current query: ${this.state.searchQuery}`);
      // console.log(`New query: ${query}`);
      // console.log(`Excluded positions: ${this.state.removedPositions.length}`)
      if (this.props.history.location.pathname !== '/') {
        this.props.history.push('/');
      }
      if (this.state.searchQuery !== query) {
        this.setState({
          searchQuery: query,
        });
      } else if (this.state.removedPositions.length > 0) {
        this.refresh();
      }
    }

    selectSeries(e) {
      if (this.state.selectedSeries === e.target.textContent) return;
      this.setState({
        selectedSeries: e.target.textContent,
      });
    }

    toggleList() {
      this.setState({
        view: 'list',
        enterLeaveAnimation: 'accordianVertical',
      });
    }

    toggleGrid() {
      this.setState({
        view: 'grid',
        enterLeaveAnimation: 'accordianHorizontal',
      });
    }

    refresh() {
      this.setState({
        removedPositions: [],
      });
      this.getData();
    }

    componentDidMount() {
      this.getData();   
      this.getAppliedPositions();
    }

    getAppliedPositions() {
      if (authClient.isAuthenticated()) {
        this.serverRequest = restClient.getPositionsByCandidateId(authClient.profile['id']).then(res => {
          let appliedPositions = res.data;
          console.log(appliedPositions);
          if (!utils.isNotNull(appliedPositions)) {
            appliedPositions = [];
          }
          this.setState({
            appliedPositions: appliedPositions
          });
          console.log('Applied positions:');
          console.log(appliedPositions);
        }).catch(error => {
          console.log(error.response);
        });
      }
    }

    getData() {
      if (this.props.candidateId == null) {
        this.serverRequest = restClient.getPositions(this.state.searchQuery).then(res => {
          const positions = res.data;
          
          this.setState({ foundPositions: positions });
          console.log('Found positions:');
          console.log(positions);
        }).catch(error => {
          console.log(error.response);
        });
      } else {
        this.serverRequest = restClient.getPositionsByCandidateId(this.props.candidateId).then(res => {
          const positions = res.data;
          this.setState({ foundPositions: positions });
          console.log('Found positions:');
          console.log(positions);
        }).catch(error => {
          console.log(error.response);
        });
      }
    }
    componentWillReceiveProps(props) {
      this.getAppliedPositions();
    }

    componentWillUnmount() {
      // this.serverRequest.abort();
    }

    componentDidUpdate(prevProps, prevState) {
      // console.log("PositionList updated");
      if (this.state.searchQuery !== prevState.searchQuery) {
        this.getData();
      }
    }

    removePosition(source, dest, positionId, index = 0) {
      if (this.state.inProgress) return;

      this.serverRequest = restClient.deleteApplication(authClient.profile['id'], positionId).then(res => {
        console.log(res);
        let sourcePositions = this.state[source].slice();
        let destPositions = this.state[dest].slice();
  
        if (!sourcePositions.length) return;
  
        destPositions = [].concat(sourcePositions.splice(index, 1), destPositions);
  
        this.setState({
          [source]: sourcePositions,
          [dest]:   destPositions,
          inProgress: true,
        });

        // {this.props.history.push('/recruit')}
      }).catch(error => {
        console.log(error.response);  
        // var errorMessage = ''
        // if (error.response.status == 401) {
        //   errorMessage = 'You have to login to apply to position!'
        // } else if (error.response.status == 500) {
        //   errorMessage = error.response.data.sqlMessage;
        // }
        // this.setState({
        //   error: true,
        //   errorMessage: errorMessage,
        //   disabled: false
        // }, () => {
        //   this.refs[this.props.positionErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
        // });
      });
    }

    applyToPosition(total, applied, positionId, index = 0) {
      if (authClient.isAuthenticated()) {
        this.serverRequest = restClient.createApplication(authClient.profile['id'], positionId).then(res => {
          const newApplication = res.data;
          console.log(newApplication);

          // if (this.state.inProgress) return;

          let totalPositions = this.state[total].slice();
          let appliedPositions = this.state[applied].slice();

          if (!totalPositions.length) return;
    
          appliedPositions = [].concat(totalPositions[index], appliedPositions);
    
          this.setState({
            [total]: totalPositions,
            [applied]:   appliedPositions,
            // inProgress: true,
          });

          console.log('Total:')
          console.log(totalPositions)
          console.log('Applied:')
          console.log(appliedPositions)

          // {this.props.history.push('/recruit')}
        }).catch(error => {
          console.log(error.response);  
          // var errorMessage = ''
          // if (error.response.status == 401) {
          //   errorMessage = 'You have to login to apply to position!'
          // } else if (error.response.status == 500) {
          //   errorMessage = error.response.data.sqlMessage;
          // }
          // this.setState({
          //   error: true,
          //   errorMessage: errorMessage,
          //   disabled: false
          // }, () => {
          //   this.refs[this.props.positionErrorId].scrollIntoView({block: 'end', behavior: 'smooth'});
          // });
        });
      } else {
        {this.props.history.push('/new_candidate?positionId=' + positionId)}
      }
    }

    renderPositions() {
      // if (this.state.foundPositions === null) return <h4 className="text-center">Loading...</h4>;
      const { foundPositions, appliedPositions, view } = this.state;
      if (!foundPositions) return (
        <li className="list-item">
          <h4 className="position-name">No positions found</h4>                                   
        </li>
      );
      let appliedPositionsIds = appliedPositions.map(item => item.id);
      return foundPositions.map((position, i) => {

        let itemClass = this.props.itemClass;;
        let isApplyButton = this.props.applyButton;
        if (appliedPositionsIds.includes(position.id)) {
          itemClass = 'li-selected';
          isApplyButton = false;
        }
        return (
          <PositionListItem
            key = {position.id}
            view = {view}
            index= {i}
            itemClass = {itemClass}
            applyButton = {isApplyButton}
            removeButton = {this.props.removeButton}
            applyClickHandler ={() => this.applyToPosition('foundPositions', 'appliedPositions', position.id, i)}
            removeClickHandler ={() => this.removePosition('foundPositions', 'removedPositions', position.id, i)}
            {...position}
          />
        );
      });
    }

    sortShuffle() {
      this.setState({
        sortingMethod: 'shuffle',
        foundPositions: shuffle(this.state.foundPositions),
      });
    }

    render() {
      const { view, order, sortingMethod, searchQuery, selectedSeries, series } = this.state;
      return (
        <div id="shuffle" className={view}>
          <HeaderButtonsTop
            headerTitle = {this.props.headerTitle}
            searchEnabled = {this.props.searchEnabled}
            quickSearchHandler = {this.setSearchQuery}
            loginStateHandler = {this.toggleLoginState}
          />
          <HeaderButtonsBottom
            view = {view}
            order = {order}
            sortingMethod = {sortingMethod}
            listClickHandler = {this.toggleList}
            gridClickHandler = {this.toggleGrid}
            sortClickHandler = {this.toggleSort}
            shuffleClickHandler = {this.sortShuffle}
            refreshClickHandlder = {this.refresh}
          />
          {/* <div className="dropdown-spacer" style={{ height: 10 }} /> */}
          {/* <h3>Careers</h3> */}
          {/* <Toggle
            text = 'Login'
            active = {this.state.selectedSeries === '2'}
            clickHandler = {this.selectSeries}
          />
          <Toggle
            text = 'My Jobs'
            active = {this.state.selectedSeries === '3'}
            clickHandler = {this.selectSeries}
          /> */}
          {/* <Toggle
            text = '4'
            active = {this.state.selectedSeries === '4'}
            clickHandler = {this.selectSeries}
          />
          <Toggle
            text = '5'
            active = {this.state.selectedSeries === '5'}
            clickHandler = {this.selectSeries}
          /> */}
          <ul>
            <FlipMove
              // staggerDurationBy="30"
              duration={350}
              onFinishAll={() => {
                setTimeout(() => this.setState({ inProgress: false }), 1);
              }}>
              { this.renderPositions() }
            </FlipMove>
          </ul>
        </div>
      );
    }
}

PositionsList.propTypes = propTypes;
PositionsList.defaultProps = defaultProps;

export default withRouter(PositionsList);