import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '../Button';
import ButtonRow from '../ButtonRow';
import H1 from '../typography/H1';
import OpenFolder from '../OpenFolder';
import Range from '../Range';
import Select from '../Select';
import Toggle from '../Toggle';
import WindowDetails from './WindowDetails';

import actions from '../../actions.json';
import { getFilesInFolder, getNextVideos, getRandomInRange } from './utils';
import { colorModes } from '../utils';

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
    colorMode: 'normal',
    files: [],
    folder: '',
    playing: false,
    showName: false,
    timeout: null,
    timeRange: {
      max: 30,
      min: 1
    },
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

  handleColorModeChange = colorMode => {
    this.setState({ colorMode }, this.sendStateUpdate);
  };

  handleFolderChange = folder => {
    if (!folder) return;
    const files = getFilesInFolder(folder[0]);
    this.setState({
      files,
      folder
    });
  };

  handleTimeRangeChange = timeRange => {
    this.setState({
      timeRange
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

  handleToggleShowName = showName => {
    this.setState({ showName }, this.sendStateUpdate);
  };

  next = () => {
    if (this.state.playing) {
      const timeout = setTimeout(
        this.next,
        getRandomInRange(
          this.state.timeRange.min * 1000,
          this.state.timeRange.max * 1000
        )
      );
      const windows = getNextVideos(this.state.windows, this.state.files, {
        colorMode: this.state.colorMode
      });
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
          <ButtonRow>
            <Button
              disabled={!files || !files.length}
              onClick={this.handleTogglePlay}
            >
              {playing ? 'Stop' : 'Start'}
            </Button>
            <Button onClick={this.addWindow}>Add Window</Button>
            <Toggle
              onChange={this.handleToggleShowName}
              title="Show Names"
              value={this.state.showName}
            />
          </ButtonRow>
          <Select
            onChange={this.handleColorModeChange}
            options={Object.values(colorModes)}
            title="Color Mode"
            value={this.state.colorMode}
          />
          <OpenFolder onFolderSelect={this.handleFolderChange} />
          <Range
            onChange={this.handleTimeRangeChange}
            title="Shuffle Time (sec)"
            value={this.state.timeRange}
          />
          <WindowDetails windows={windows} />
        </Inner>
      </Wrapper>
    );
  }
}

export default Dashboard;
