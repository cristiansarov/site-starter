import PropTypes from 'prop-types';


export default function (metaTags) {
  console.log('metaTags', metaTags);
  return function setMetaTags(Component) {
    Component.contextTypes = {
      store: PropTypes.object.isRequired
    };
    Component.prototype.componentWillUpdate = props => {
      console.log('props', props);
    };
  }
};