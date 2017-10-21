import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Video from './Video';

const { ipcRenderer: ipc } = window.require('electron');

const Id = styled.div`
  height: 100%;
  width: 100%;
  font-size: 100vh;
`;

class Player extends React.Component {
  state = {
    playing: false,
    ready: false,
    src: null,
    startTime: 0
  };

  componentDidMount() {
    ipc.send('window-registered', this.props.id);

    ipc.on('updated-state', (e, args) => {
      this.setState(...args.windows.find(w => w.id === this.props.id));
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
    return this.state.src ? (
      <Video
        playing={this.state.playing}
        src={this.state.src}
        startTime={this.state.startTime}
      />
    ) : (
      <Id>{this.props.id}</Id>
    );
  }
}

Player.propsTypes = {
  id: PropTypes.string.isRequired
};

export default Player;
