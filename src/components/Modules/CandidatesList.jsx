import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import FlipMove from 'react-flip-move';
import {withRouter} from 'react-router-dom';
import restClient from '../RestClient'
import HeaderButtonsTop from './HeaderButtonsTop'
import PropTypes from 'prop-types';
import ShowMore from 'react-show-more';
import authClient from '../Auth'
import utils from '../Utils';

const propTypes = {
    searchEnabled: PropTypes.bool
};
  
const defaultProps = {
    searchEnabled: true
};

class CandidatesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      removedCandidates: [],
      candidates: [],
      positionId: this.getPositionIdFromPath(),
      position: null,
      searchQuery: '',
      inProgress: false,
    };

    this.setSearchQuery = this.setSearchQuery.bind(this);
  }


  getPositionIdFromPath() {
    const { match: { params } } = this.props;
    console.log('Position Id from path: ' + params.positionId);
    return params.positionId;
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
    let positionId = this.getPositionIdFromPath();
    if (!utils.isNotNull(positionId)) {
      this.serverRequest = restClient.getCandidates(this.state.searchQuery).then(res => {
          const candidates = res.data;
          this.setState({ candidates });
          console.log(candidates);
        }).catch(error => {
          console.log(error.response);
        });
    } else {
        this.serverRequest = restClient.getCandidatesByPositionId(positionId).then(res => {
          const candidates = res.data;
          this.setState({ candidates });
          console.log(candidates);
        }).catch(error => {
          console.log(error.response);
        });
    }
  }

  removeCandidate(source, dest, index = 0, id) {
    this.serverRequest = restClient.deleteCandidate(id).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error.response);
    });

    if (this.state.inProgress) return;

    let candidates = this.state[source].slice();
    let removedCandidates = this.state[dest].slice();

    if (!candidates.length) return;

    removedCandidates = [].concat(candidates.splice(index, 1), removedCandidates);

    this.setState({
      [source]: candidates,
      [dest]:   removedCandidates,
      inProgress: true,
    });
  }

  componentDidMount() {
    this.getData();
    let positionId = this.state.positionId;
    if (utils.isNotNull(positionId)) {
      this.serverRequest = restClient.getPositionById(positionId).then(res => {
        const position = res.data;
        this.setState({
          position: position
        });
        console.log(position);
      }).catch(error => {
        console.log(error.response);
      });
    }
  }

  renderCandidates() {
    // if (this.state.candidates === null) return <h4 className="text-center">Loading...</h4>;
    if (!this.state.candidates) return (
      <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="card text-black bg-white mb-3">
          <div className="card-body">
          <span className='text-blue'>
              <h4 className="card-title">No candidates found</h4>
           </span>
               <p className="card-text"></p>
          </div>
          </div>
      </div>
      );
    return (
      this.state.candidates && this.state.candidates.map((candidate, i) => (
        <div key={candidate.id} className="col-sm-12 col-md-12 col-lg-12">
            <div className="card bg-white mb-3">
              <div className="card-body">
                <Link to={`/candidates/${candidate.id}`} className='text-blue text-decoration-none'>
                  <h4 className="card-title">{utils.getFullName(candidate.firstName, candidate.middleName, candidate.lastName)}</h4>
                </Link>
              <div className="card-text">
                {candidate.email}
              </div>
              <div className="card-text">
                {utils.getFullAddress(candidate.address, candidate.city, candidate.state, candidate.zip)}
              </div>
              <div className="card-text card-description">
                  <ShowMore
                    lines={4}
                    more='more'
                    less='less'
                    anchorClass=''
                  >{candidate.summary}
                  </ShowMore>
              </div>
            </div>
          </div>
        </div>
      ))
    )
  }

  render() {
    const {position} = this.state;
    return (
      <div className="container">
        <HeaderButtonsTop
            headerTitle = 'Candidates'
            quickSearchHandler = {this.setSearchQuery}
            quickSearchPlaceholder = 'Candidate Email'
            searchEnabled = {!utils.isNotNull(this.state.positionId)}
        />
      <div className="container container-full" ref={this.candidateFormId}>
        <div className="row">
          { position !== null &&
            <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="well form-summary">
                <div className="jumbotron jumbo-box col-12">
                  <h4 className="jumbo-header">{position.title}</h4>
                  <span className="lead jumbo-label">Full Address</span>
                  <p className="lead">{utils.getFullAddress(position.address, position.city, position.state, position.zip)}</p>
                  <span className="lead jumbo-label">Date Open</span>
                  <p className="lead">{utils.getLocalizedDate(position.dateOpen)}</p>
                </div>
              </div>
            </div>
          }
          <div className="col-lg-12 col-md-12 col-sm-12">
            <FlipMove
              className="row"
              // staggerDurationBy="30"
              duration={350}
              onFinishAll={() => {
                setTimeout(() => this.setState({ inProgress: false }), 1);
              }}>
                { this.renderCandidates() }
              </FlipMove>
          </div>
        </div>
      </div>
</div>
    )
  }
}

CandidatesList.propTypes = propTypes;
CandidatesList.defaultProps = defaultProps;

export default withRouter(CandidatesList);