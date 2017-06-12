import React from 'react';
import {Carousel} from 'react-responsive-carousel';
import './Carousel.scss';


export default class CarouselComponent extends React.Component {
  render() {
    const {...props} = this.props;
    return (
      <Carousel infiniteLoop={true}
                showIndicators={false}
                showThumbs={false}
                emulateTouch={true}
                showStatus={false}
                autoPlay={true}
                {...props}
      />
    )
  }
}