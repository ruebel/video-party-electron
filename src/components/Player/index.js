import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Video from './Video';

import actions from '../../actions.json';
import { getVideoName } from '../utils';

const { ipcRenderer: ipc } = window.require('electron');

const Id = styled.div`
  height: 100%;
  width: 100%;
  font-size: 100vh;
`;

const Name = styled.div`
  position: absolute;
  bottom: 15%;
  left: 0;
  width: 100%;
  font-size: 1.5em;
`;

const Wrapper = styled.div`
  background: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

class Player extends React.Component {
  state = {
    playing: false,
    ready: false,
    showName: false,
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
        showName: args.showName,
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
        {this.state.showName && <Name>{getVideoName(this.state.src)}</Name>}
      </Wrapper>
    );
  }
}

Player.propTypes = {
  id: PropTypes.string,
  startTime: PropTypes.number
};

export default Player;
