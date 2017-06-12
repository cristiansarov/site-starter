import React from 'react';
import PropTypes from 'prop-types';

export default class ArticleItemImage extends React.Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    straight: PropTypes.bool
  }

  render() {
    const {} = this.props;
    return (
      <div className="article-image-container">
        <canvas className="article-image" ref="image"/>
        <canvas className="ai-shadow" ref="shadow"/>
      </div>
    )
  }

  componentDidMount() {
    const {src, straight} = this.props;

    const img = new Image,
      imageCanvas = this.refs.image,
      imageCtx = imageCanvas.getContext('2d'),
      shadowCanvas = this.refs.shadow,
      shadowCtx = shadowCanvas.getContext('2d');

    img.onload = straight !== undefined ? drawStraight : draw;
    img.src = src;

    function draw() {
      const w = imageCanvas.width = shadowCanvas.width = this.naturalWidth;
      const h = imageCanvas.height = shadowCanvas.height = this.naturalHeight;
      imageCtx.moveTo(0, 0);
      imageCtx.lineTo(w, 0);
      imageCtx.lineTo(w * 0.9, h);
      imageCtx.lineTo(0, h);
      imageCtx.fill();
      imageCtx.globalCompositeOperation = 'source-in';
      imageCtx.drawImage(this, 0, 0);

      shadowCtx.moveTo(0, 0);
      shadowCtx.lineTo(w, 0);
      shadowCtx.lineTo(w * 0.9, h);
      shadowCtx.lineTo(0, h);
      shadowCtx.fillStyle = '#428bca'
      shadowCtx.fill();
      imageCtx.globalCompositeOperation = 'source-in';
    }

    function drawStraight() {
      const w = imageCanvas.width = shadowCanvas.width = this.naturalWidth;
      const h = imageCanvas.height = shadowCanvas.height = this.naturalHeight;
      imageCtx.drawImage(this, 0, 0);

      shadowCtx.moveTo(0, 0);
      shadowCtx.lineTo(w, 0);
      shadowCtx.lineTo(w, h);
      shadowCtx.lineTo(0, h);
      shadowCtx.fillStyle = '#428bca';
      shadowCtx.fill();
    }

  }

}