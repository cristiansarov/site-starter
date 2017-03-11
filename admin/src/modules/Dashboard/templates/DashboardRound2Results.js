import React from 'react';
import { imageUrl } from 'filters';
import { Collapse } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';

export default React.createClass({

  getInitialState: ()=>({}),

  renderItem(person, winner, role) {
    const openClass = `open${role+person.id}`;
    return (
      <div>
        <div className="rl-item">
          <div>
            <div className="image" style={{backgroundImage: 'url("'+imageUrl(person.avatar, 'thumb')+'")'}}></div>
          </div>
          <div>
            <h4>
              {person.fullName}
            </h4>
            {person.percentage} % | {person.totalVotes} voturi { winner == person.id && <i className="icon-checked"/> }
          </div>
          <div>
            { role && person.votes && (
              <button type="button" onClick={()=>this.setState({[openClass]: !this.state[openClass]})} disabled={!person.votes.length}>
                <i className={this.state[openClass] ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} />
              </button>
            ) }
          </div>
        </div>
        { role && person.votes && (
          <Collapse in={this.state[openClass]}>
            <div>
              { person.votes.length > 10 ? (
                person.votes.map(i=>i.username).join(', ')
              ) : (
                person.votes.map((i,k)=><div key={k}>{i.username}</div>)
              ) }
            </div>
          </Collapse>
        ) }
      </div>
    )
  },

  renderChallenge(challenge, k, role) {
    return (
      <li key={k} className="col-md-12 ">
        <div className="row">
          { this.renderItem(challenge.candidate1, challenge.winner, role) }
          { this.renderItem(challenge.candidate2, challenge.winner, role) }
        </div>
      </li>
    )
  },

  render() {
    const { results } = this.props;
    return (
      <div className="row result-list">
        { results.byRole.map((role, k) => (
          <div key={k} className="col-md-3">
            <h3>Rezultate <strong>{I18n.t(`role.${role.role}`)}</strong> <small>(~{Math.round(role.totalVotes / (results.defaultChallengeNo))} pers.)</small></h3>
            <ul>
              { role.candidates.map((p, k) => this.renderChallenge(p, k, role.role)) }
            </ul>
          </div>
        )) }
        <div className="col-md-3">
          <h3><strong>Rezultate Finale</strong></h3>
          <ul>
            { results.final.map((p, k) => this.renderChallenge(p, k)) }
          </ul>
        </div>
      </div>
    );
  }

});
