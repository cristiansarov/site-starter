import React from 'react';
import { connect } from 'react-redux';
import { prevRoundStatus, nextRoundStatus, resetRoundStatus, triggerGetData } from '../DashboardActions'
import { I18n } from 'react-redux-i18n';

const DashboardCurrentSessionComponent = React.createClass({
  roundStatuses: ['speeches', 'started', 'stopped', 'resultsShown'],
  renderNav(direction) {
    if(!['right', 'left'].includes(direction)) return null;
    const { currentRound: {number, status} } = this.props;
    const statusIndex = this.roundStatuses.indexOf(status);
    var statusI18n = 'invalid';
    var invalid = false;
    if(direction=='left') {
      if(number==0 && !status) invalid = true; // if is the first one
      else if(number==1 && status==this.roundStatuses[0]) statusI18n = 'notStarted';
      else if(status==this.roundStatuses[0]) statusI18n = 'prevRound';
      else statusI18n = this.roundStatuses[statusIndex-1];
    } else {
      if(!status) statusI18n = this.roundStatuses[0];
      else if(number==3 && status==this.roundStatuses[this.roundStatuses.length-1]) invalid = true;
      else if(status==this.roundStatuses[this.roundStatuses.length-1]) statusI18n = 'nextRound';
      else statusI18n = this.roundStatuses[statusIndex+1];
    }
    return !invalid ? (
      <button type="button" onClick={direction=='left' ? prevRoundStatus : nextRoundStatus}>
        <div>
          <i className={`fa fa-caret-${direction}`} />
          <span>{I18n.t(`dashboard.nav.${statusI18n}`)}</span>
        </div>
      </button>
    ) : null;
  },
  render() {
    const { currentRound } = this.props;
    if(!currentRound) return null;
    return (
      <div className="dashboard-panel current-session-manager">
        <h2>Administrare status sesiune curentă</h2>
        <div className="csm-top-left">
          { currentRound.number>0 && <button type="button" className="fa fa-backward" onClick={resetRoundStatus} title="Resetează Sesiune" /> }
          <button type="button" className="fa fa-refresh" onClick={triggerGetData} title="Declanșează aducerea datelor la votanți" />
        </div>
        <div className="csm-nav">
          {this.renderNav('left')}
        </div>
        <div className="csm-status">
          <h3>{currentRound.number ? I18n.t(`dashboard.rounds.${currentRound.number-1}`) : I18n.t('dashboard.noRoundStarted')}</h3>
          <i className={currentRound.icon} />
          <h4>{currentRound.status && I18n.t(`dashboard.nav.${currentRound.status}`)}</h4>
        </div>
        <div className="csm-nav">
          {this.renderNav('right')}
        </div>
      </div>
    )
  }

});

export default connect(state=>({
  currentRound: state.dashboard.currentRound
}))(DashboardCurrentSessionComponent);
