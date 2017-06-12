import React, {Component} from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'react-google-maps/lib/GoogleMap';
import withGoogleMap from 'react-google-maps/lib/withGoogleMap';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import Marker from 'react-google-maps/lib/Marker';


const AsyncGoogleMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap {...props}>{props.markers.map(marker => <Marker {...marker} />)}</GoogleMap>
  ))
);

export default class MapComponent extends Component {
  static propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    lat: PropTypes.number,
    lng: PropTypes.number,
    markers: PropTypes.array,
    center: PropTypes.object,
    zoom: PropTypes.number,
    stylers: PropTypes.array,
    scrollWheel: PropTypes.bool
  };
  render() {
    const {
      className = 'map-field',
      height=220,
      lat,
      lng,
      markers = [{position: {lat, lng}, key: new Date().getTime()}],
      center = {lat, lng},
      zoom = 14,
      stylers,
      onMapClick = ()=>{},
      scrollWheel = true
    } = this.props;
    if(markers && !(markers.length ? (markers[0].position && markers[0].position.lat && markers[0].position.lng) : true)) return null;
    if(!(center && center.lat && center.lng)) return null;
    return (
      <AsyncGoogleMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyC9g4SyVNEOGMP7dEA893MdmxnWE1Pe-YQ"
        loadingElement={<span />}
        containerElement={<div className={className} />}
        mapElement={<div style={{height}}/>}
        markers={markers}
        center={center}
        defaultZoom={zoom}
        onMapClick={onMapClick}
        defaultOptions={{ styles: [{stylers}], scrollwheel: scrollWheel }}
      />
    )
  }
}