import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from './Button';
const { dialog } = window.require('electron').remote;

const Input = styled.input`
  flex: 1;
  height: 25px;
`;

const InputWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const Label = styled.div`margin-right: 25px;`;

const Wrapper = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
`;

class OpenFolder extends React.Component {
  state = {
    folder: ''
  };

  openFolder = () => {
    const folder = dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    this.props.onFolderSelect(folder);
    this.setState({ folder: folder || '' });
  };

  render() {
    return (
      <Wrapper>
        <Label>Select Folder</Label>
        <InputWrapper>
          <Input value={this.state.folder} />
          <Button onClick={this.openFolder}>...</Button>
        </InputWrapper>
      </Wrapper>
    );
  }
}

OpenFolder.propTypes = {
  onFolderSelect: PropTypes.func.isRequired
};

export default OpenFolder;
