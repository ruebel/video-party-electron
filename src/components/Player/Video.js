import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

class Video extends React.Component {
  state = {
    duration: 0,
    ready: false
  };

  componentWillReceiveProps(next) {
    if (next.src !== this.props.src) {
      this.setState({
        ready: false
      });
    }
  }

  handleDuration = duration => {
    if (!this.state.ready && this.props.startTime) {
      this.player.seekTo(duration * this.props.startTime);
      this.setState({
        duration,
        ready: true
      });
    }
  };

  render() {
    return (
      <ReactPlayer
        ref={player => (this.player = player)}
        loop
        height="100%"
        muted
        onDuration={this.handleDuration}
        onError={e => console.error(e.target.error)}
        playing={this.props.playing}
        url={this.props.src ? 'file://' + this.props.src : null}
        width="100%"
      />
    );
  }
}

Video.propTypes = {
  playing: PropTypes.bool,
  src: PropTypes.string,
  // Percentage of the way through the video will start (0 - 1)
  startTime: PropTypes.number
};

export default Video;
