import React from 'react';
import { imageUrl } from 'filters';
import { Collapse } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';

export default React.createClass({

  getInitialState: ()=>({}),

  renderItem(person, k, role) {
    const { results } = this.props;
    return (
      <li key={k} style={{opacity: 1-0.04*k}}>
        <div className="rl-item">
          <div>
            <div className="image" style={{backgroundImage: 'url("'+imageUrl(person.avatar, 'thumb')+'")'}}></div>
          </div>
          <div>
            <h4>
              {person.fullName}
              { !role && k < results.defaultChallengeNo*2 && <i className="icon-checked" /> }
            </h4>
            Loc {k+1} | {person.percentage} % | {person.totalVotes} voturi
          </div>
          <div>
            { role && person.votes && (
              <button type="button" onClick={()=>this.setState({[`open${role+k}`]: !this.state[`open${role+k}`]})} disabled={!person.votes.length}>
                <i className={this.state[`open${role+k}`] ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} />
              </button>
            ) }
          </div>
        </div>
        { role && person.votes && (
          <Collapse in={this.state[`open${role+k}`]}>
            <div>
              { person.votes.length > 10 ? (
                person.votes.map(i=>i.username).join(', ')
              ) : (
                person.votes.map((i,k)=><div key={k}>{i.username}</div>)
              ) }
            </div>
          </Collapse>
        ) }
      </li>
    )
  },

  render() {
    const { results } = this.props;
    return (
      <div className="row result-list">
        { results.byRole.map((role, k) => (
          <div key={k} className="col-md-3">
            <h3>Rezultate <strong>{I18n.t(`role.${role.role}`)}</strong> <small>(~{Math.round(role.totalVotes / (results.defaultChallengeNo*2))} pers.)</small></h3>
            <ul>
              { role.candidates.map((p, k) => this.renderItem(p, k, role.role)) }
            </ul>
          </div>
        )) }
        <div className="col-md-3">
          <h3><strong>Rezultate Finale</strong></h3>
          <ul>
            { results.final.map((p, k) => this.renderItem(p, k)) }
          </ul>
        </div>
      </div>
    );
  }

});
