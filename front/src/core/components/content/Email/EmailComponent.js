import React from 'react';


export default class EmailComponent extends React.Component {
  state = {};
  static propTypes = {
    to: function(props, propName, componentName) {
      if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(props[propName])) {
        return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. The prop is not a valid email.`);
      }
    }
  };
  render() {
    const {to, ...props} = this.props;
    const {hovered} = this.state;
    let href, email;
    if(hovered) {
      href = `mailto:${to}`;
      email = to;
    } else {
      href = '#';
      email = to.replace('@', '[a]');
    }
    return (
      <a {...props} href={href} ref="email">{email}</a>
    )
  }
  componentDidMount() {
    this.refs.email.addEventListener('mouseover', this.hoverEventListener.bind(this));
  }
  componentWillUnmount() {
    this.refs.email.removeEventListener('mouseover', this.hoverEventListener.bind(this));
  }
  hoverEventListener() {
    if(this.state.hovered) return;
    this.setState({hovered: true});
  }
}