import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '../Button';
import H1 from '../typography/H1';
import H2 from '../typography/H2';
import OpenFolder from '../OpenFolder';
import WindowDetails from './WindowDetails';

import actions from '../../actions.json';
import { getFilesInFolder, getNextVideos, getRandomInRange } from './utils';

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
    timeout: null,
    windows: []
  };

  componentDidMount() {
    ipc.on(actions.REGISTER, (e, newWindow) => {
      this.setState(state => ({
        windows: [...state.windows, newWindow]
      }));
    });
    ipc.on(actions.CLOSE_WINDOW, (e, id) => {
      this.setState(state => ({
        // eslint-disable-next-line
        windows: state.windows.filter(w => w.id != id)
      }));
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners(actions.STATE_UPDATE);
    ipc.removeAllListeners(actions.REGISTER);
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
  }

  addWindow = () => {
    ipc.send(actions.ADD_WINDOW);
  };

  handleFolderChange = folder => {
    const files = getFilesInFolder(folder[0]);
    this.setState({
      files,
      folder
    });
  };

  handleTogglePlay = () => {
    if (this.state.playing && this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
    this.setState(
      state => ({
        playing: !state.playing,
        timeout: null
      }),
      () => {
        this.sendStateUpdate();
        this.next();
      }
    );
  };

  next = () => {
    if (this.state.playing) {
      const timeout = setTimeout(this.next, getRandomInRange(5000, 30000));
      const windows = getNextVideos(this.state.windows, this.state.files);
      this.setState({ timeout, windows }, this.sendStateUpdate);
    }
  };

  sendStateUpdate = () => {
    ipc.send(actions.STATE_UPDATE, this.state);
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
          <Button onClick={this.addWindow}>Add Window</Button>
          <div>
            <H2>Windows</H2>
            {windows.length > 0 ? (
              windows.map((w, i) => <WindowDetails key={i} {...w} />)
            ) : (
              <div>No Windows Registered</div>
            )}
          </div>
        </Inner>
      </Wrapper>
    );
  }
}

export default Dashboard;
