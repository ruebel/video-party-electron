import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

class Video extends React.Component {
  state = {
    ready: false
  };

  handleDuration = duration => {
    if (!this.state.ready && this.props.startTime) {
      this.player.seekTo(duration * this.props.startTime);
      this.setState({
        ready: true
      });
    }
  };

  render() {
    return (
      <ReactPlayer
        ref={player => (this.player = player)}
        loop
        muted
        onDuration={this.handleDuration}
        onError={e => console.error(e.target.error)}
        playing={this.props.playing}
        url={this.props.src ? 'file://' + this.props.src : null}
      />
    );
  }
}

Video.propsTypes = {
  playing: PropTypes.bool,
  src: PropTypes.string,
  // Percentage of the way through the video will start (0 - 1)
  startTime: PropTypes.number
};

export default Video;
