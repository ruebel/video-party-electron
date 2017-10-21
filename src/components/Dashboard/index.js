import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '../Button';
import H1 from '../typography/H1';
import H2 from '../typography/H2';
import OpenFolder from '../OpenFolder';
import WindowDetails from './WindowDetails';

import { getFilesInFolder } from '../utils';

const { ipcRenderer: ipc } = window.require('electron');

const Inner = styled.div`
  max-width: 600px;
  width: 100%;
`;

const Wrapper = styled.div`
  background: ${p => p.theme.color.dark};
  color: ${p => p.theme.color.light};
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  text-align: center;
  position: absolute;
  width: 100%;
`;

class Dashboard extends Component {
  state = {
    files: [],
    folder: '',
    playing: false,
    windows: []
  };

  componentDidMount() {
    ipc.on('window-registered', (e, args) => {
      this.setState(state => ({
        windows: [...state.windows, args]
      }));
    });
  }

  handleFolderChange = folder => {
    const files = getFilesInFolder(folder[0]);
    this.setState({
      files,
      folder
    });
  };

  handleTogglePlay = () => {
    console.log('toggle play');
    this.setState(
      state => ({
        playing: !state.playing
      }),
      this.sendStateUpdate
    );
  };

  sendStateUpdate = () => {
    ipc.send('updated-state', this.state);
  };

  render() {
    const { files, playing, windows } = this.state;
    return (
      <Wrapper>
        <Inner>
          <H1>Video Party</H1>
          <OpenFolder onFolderSelect={this.handleFolderChange} />
          <Button
            disabled={!files || !files.length}
            onClick={this.handleTogglePlay}
          >
            {playing ? 'Stop' : 'Start'}
          </Button>
          {windows.length > 0 ? (
            windows.map((w, i) => <WindowDetails key={i} {...w} />)
          ) : (
            <H2>No Windows Registered</H2>
          )}
        </Inner>
      </Wrapper>
    );
  }
}

export default Dashboard;
