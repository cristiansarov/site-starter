import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import classnames from 'classnames';
import { getResults, clearResults } from '../DashboardActions'
import { I18n } from 'react-redux-i18n';
import Round1Results from './DashboardRound1Results';
import Round2Results from './DashboardRound2Results';
import Round3Results from './DashboardRound3Results';

const DashboardResultsComponent = React.createClass({

  updateParams: function(key, value) {
    if(!(key && typeof value != 'undefined')) return;
    var query = { ...this.props.location.query, [key]: value };
    if(!query[key]) delete query[key];
    if(['session', 'round'].includes(key)) this.props.clearResults();
    this.props.router.push({name: 'Dashboard', query});
  },

  getResults(location) {
    location = location || this.props.location;
    if(!location.query.session || !location.query.round) return;
    this.props.getResults(location.query);
  },

  render() {
    const { sessionList, location, results, error } = this.props;
    const selectedSession = sessionList.filter(i=>i.id==location.query.session)[0];
    const selectedRound = location.query.round;
    return (
      <div className="dashboard-panel results-panel">
        <h2>Rezultate sesiuni per runda</h2>
        <div className="rp-header">
          <div>
            <Select options={sessionList} labelKey="edition" value={selectedSession} onChange={i=>this.updateParams('session', i ? i.id : null)} />
          </div>
          <div>
            <span>Runda</span>
            { [1,2,3].map(k => <button type="button" key={k} className={classnames('button', {'active': selectedRound==k})} onClick={()=>this.updateParams('round', k)}>{k}</button>) }
          </div>
          <div>
            <button type="button" className="button" onClick={()=>this.getResults()}>Generează</button>
          </div>
          <div>
            <label>
              <input type="checkbox" checked={location.query.autoGenerate} onChange={e=>this.updateParams('autoGenerate', e.target.checked)} />
              Auto-generare (5 sec.)
            </label>
          </div>
        </div>
        <div className="rp-content">

          { location.query.session && selectedRound && results ? (
            <div>

              { selectedRound == 1 && <Round1Results results={results} /> }
              { selectedRound == 2 && <Round2Results results={results} /> }
              { selectedRound == 3 && <Round3Results results={results} /> }

            </div>
          ) : (error || null) }


        </div>
      </div>
    )
  },

  componentWillUnmount() {
    clearInterval(this.autoGenerateCheck);
  }

});

export default connect(state=>({
  results: state.dashboard.results,
  error: state.dashboard.error
}), {
  getResults,
  clearResults
})(DashboardResultsComponent);
