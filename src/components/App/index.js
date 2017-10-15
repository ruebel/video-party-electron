import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '../Button';
import H1 from '../typography/H1';
import OpenFolder from '../OpenFolder';
import Player from '../Player';

import { getFilesInFolder } from '../utils';

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
  width: 100%;
`;

class App extends Component {
  state = {
    files: [],
    folder: '',
    playing: false
  };

  handleFolderChange = folder => {
    const files = getFilesInFolder(folder);
    this.setState({
      files,
      folder
    });
  };

  togglePlay = () => {
    this.setState(state => ({
      playing: !state.playing
    }));
  };

  render() {
    const { files, playing } = this.state;
    return (
      <Wrapper>
        <Inner>
          <H1>Video Party</H1>
          <OpenFolder onFolderSelect={this.handleFolderChange} />
          <Button disabled={!files || !files.length} onClick={this.togglePlay}>
            {playing ? 'Stop' : 'Start'}
          </Button>
          {files && <Player playing={playing} src={files[0]} />}
        </Inner>
      </Wrapper>
    );
  }
}

export default App;
