import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './TitleStack.scss';


//component for applying a special css class for the first letter of a text block
export default class TitleStackComponent extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
  };
  render() {
    const {title, subtitle, small} = this.props;
    return (
      <span className={classnames('first-letter-hexagon title-stack', {'flh-sm': small})}>
        <span className="flh-letter">{title.charAt(0)}</span>
        <span dangerouslySetInnerHTML={{__html: title.slice(1)}} />
        {subtitle && <small>{subtitle}</small>}
      </span>
    );
  }
}