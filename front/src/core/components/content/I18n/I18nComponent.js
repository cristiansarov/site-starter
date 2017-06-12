import React from 'react';
import PropTypes from 'prop-types';
import {I18n} from 'react-redux-i18n';
import {Link} from 'react-router';

function element(Element) {
  return class Translation extends React.Component {

    static propTypes = {
      value: PropTypes.string.isRequired,
      params: PropTypes.object
    };

    render() {
      const {value, params, ...props} = this.props;
      return (
        <Element dangerouslySetInnerHTML={{__html: I18n.t(value, params)}} {...props}/>
      )
    }
  }
}

export default {
  div:        element('div'),
  span:       element('span'),
  h1:         element('h1'),
  h2:         element('h2'),
  h3:         element('h3'),
  h4:         element('h4'),
  h5:         element('h5'),
  h6:         element('h6'),
  a:          element('a'),
  p:          element('p'),
  blockquote: element('blockquote'),
  cite:       element('cite'),
  Link:       element(Link),
  t:          (...params)=>I18n.t(...params)
}