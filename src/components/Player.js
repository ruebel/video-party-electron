import React from 'react';
import PropTypes from 'prop-types';
import Video from './Video';

const { ipcRenderer: ipc } = window.require('electron');

class Player extends React.Component {
  state = {
    playing: false,
    ready: false,
    src: null,
    starTime: 0
  };

  componentDidMount() {
    ipc.send('window-registered', this.props.id);

    ipc.on('updated-state', (e, args) => {
      console.log('updated-state', e, args);
    });
  }

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
      <Video
        playing={this.state.playing}
        src={this.state.src}
        startTime={this.state.startTime}
      />
    );
  }
}

Player.propsTypes = {
  id: PropTypes.string.isRequired
};

export default Player;
