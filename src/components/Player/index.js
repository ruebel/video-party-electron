import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Video from './Video';

import actions from '../../actions.json';
import { colorModes, getVideoName } from '../utils';

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

const Colorize = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  mix-blend-mode: ${p =>
    p.mode === colorModes.blackAndWhite ? 'color' : 'darken'};
  background: ${p =>
    p.mode === colorModes.blackAndWhite ? '#000000' : p.color};
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
        {this.state.colorMode !== colorModes.regular && (
          <Colorize color={this.state.color} mode={this.state.colorMode} />
        )}
      </Wrapper>
    );
  }
}

Player.propTypes = {
  id: PropTypes.string
};

export default Player;
