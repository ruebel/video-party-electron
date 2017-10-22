import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Video from './Video';
import actions from '../actions.json';

const { ipcRenderer: ipc } = window.require('electron');

const Id = styled.div`
  height: 100%;
  width: 100%;
  font-size: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

class Player extends React.Component {
  state = {
    playing: false,
    ready: false,
    src: null,
    startTime: 0
  };

  componentDidMount() {
    if (this.props.id) {
      this.register(this.props.id);
    }

    ipc.on(actions.STATE_UPDATE, (e, args) => {
      this.setState({
        playing: args.playing,
        ...args.windows.find(w => w.id === this.props.id)
      });
    });
  }

  componentWillReceiveProps(next) {
    if (next.id !== this.props.id) {
      this.register(next.id);
    }
  }

  componentWillUnmount() {
    ipc.removeAllListeners(actions.STATE_UPDATE);
  }

  handleDuration = duration => {
    if (!this.state.ready && this.props.startTime) {
      this.player.seekTo(duration * this.props.startTime);
      this.setState({
        ready: true
      });
    }
  };

  register = id => {
    setTimeout(() => ipc.send(actions.REGISTER, { id }), 250);
  };

  render() {
    return (
      <Wrapper>
        {this.state.src ? (
          <Video
            playing={this.state.playing}
            src={this.state.src}
            startTime={this.state.startTime}
          />
        ) : (
          <Id>{this.props.id}</Id>
        )}
      </Wrapper>
    );
  }
}

Player.propsTypes = {
  id: PropTypes.string.isRequired
};

export default Player;
