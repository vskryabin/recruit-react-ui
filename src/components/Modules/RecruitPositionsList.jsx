import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import FlipMove from 'react-flip-move';
import {withRouter} from 'react-router-dom';
import restClient from '../RestClient'
import HeaderButtonsTop from './HeaderButtonsTop'
import PropTypes from 'prop-types';
import ShowMore from 'react-show-more';
import authClient from '../Auth'

const propTypes = {
    searchEnabled: PropTypes.bool
};
  
const defaultProps = {
    searchEnabled: true
};

class RecruitPositionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      removedPositions: [],
      positions: [],
      searchQuery: '',
      inProgress: false,
    };

    this.setSearchQuery = this.setSearchQuery.bind(this);
  }

  setSearchQuery(query) {
    if (this.state.searchQuery !== query) {
      this.setState({
        searchQuery: query,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchQuery !== prevState.searchQuery) {
      this.getData();
    }
  }

  getData() {
    this.serverRequest = restClient.getPositions(this.state.searchQuery).then(res => {
        const positions = res.data;
        this.setState({ positions });
        console.log(positions);
      }).catch(error => {
        console.log(error.response);
      });
  }

  removePosition(source, dest, index = 0, id) {
    this.serverRequest = restClient.deletePosition(id).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error.response);
    });

    if (this.state.inProgress) return;

    let positions = this.state[source].slice();
    let removedPositions = this.state[dest].slice();

    if (!positions.length) return;

    removedPositions = [].concat(positions.splice(index, 1), removedPositions);

    this.setState({
      [source]: positions,
      [dest]:   removedPositions,
      inProgress: true,
    });
  }

  componentDidMount() {
    this.getData();
  }

  renderPositions() {
    // if (this.state.positions === null) return <h4 className="text-center">Loading...</h4>;
    if (!this.state.positions) return (
        <div className="col-sm-12 col-md-4 col-lg-3">
            <div className="card text-black bg-white mb-3">
            <div className="card-body">
            <span className='text-blue'>
                <h4 className="card-title">No open positions found</h4>
            </span>
                <p className="card-text"></p>
            </div>
            </div>
        </div>
      );
    return (
      this.state.positions && this.state.positions.map((position, i) => (
        <div key={position.id} className="col-sm-12 col-md-4 col-lg-3">
            <div className="card bg-white mb-3">
              <div className="card-header text-bold">
                <Link to={`/positions/${position.id}/candidates`} className='text-black text-decoration-none'>
                  <span>Candidates: {position.candidatesCount}</span>
                </Link>
                {
                  authClient.isAuthenticated() && authClient.isAdmin() && 
                  <button className="style-close" onClick={() => this.removePosition('positions', 'removedPositions', i, position.id)}>
                    <i className="fa fa-close"/>
                  </button>
                }
              </div>
              <div className="card-body">
              <Link to={`/positions/${position.id}`} className='text-blue text-decoration-none'>
                <h4 className="card-title">{position.title}</h4>
              </Link>
                <div className="card-text">
                  <ShowMore
                    lines={4}
                    more='more'
                    less='less'
                    anchorClass=''
                  >{position.description}
                  </ShowMore>
                </div>
              </div>
            </div>
        </div>
      ))
    )
  }

  render() {
    return (
      <div className="container">
      <FlipMove
        className="row"
        // staggerDurationBy="30"
        duration={350}
        onFinishAll={() => {
          setTimeout(() => this.setState({ inProgress: false }), 1);
        }}>
        <HeaderButtonsTop
            headerTitle = 'Recruit'
            quickSearchHandler = {this.setSearchQuery}
            searchEnabled = {this.props.searchEnabled}
        />
        <div className="col-sm-12 col-md-4 col-lg-3">
            <div className="card bg-light mb-3">
              <div className="card-header text-bold">
                <Link to="/new_position" className='text-black text-decoration-none'>
                  <span>Recruit Controls</span>
                </Link>
              </div>
              <div className="card-body">
              <Link to="/candidates"  className='text-blue text-decoration-none'>
                <h4 className="card-title">All candidates</h4>
              </Link>
                <p className="card-text">List all candidates</p>
                <hr/>
              <Link to="/new_position"  className='text-blue text-decoration-none'>
                <h4 className="card-title">New Position</h4>
              </Link>
                <p className="card-text">Open new position</p>
              </div>
            </div>
        </div>
        { this.renderPositions() }
      </FlipMove>
      </div>
    )
  }
}

RecruitPositionsList.propTypes = propTypes;
RecruitPositionsList.defaultProps = defaultProps;

export default withRouter(RecruitPositionsList);