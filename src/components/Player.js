import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

class Player extends React.Component {
  render() {
    return (
      <ReactPlayer controls playing={this.props.playing} url={this.props.src} />
    );
  }
}

Player.propsTypes = {
  playing: PropTypes.bool,
  src: PropTypes.string
};

export default Player;
