import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getVideoName } from '../../utils';

const Id = styled.div`
  background: ${p => p.theme.color.primary};
  padding: 10px;
  height: 100%;
  width: 60px;
`;

const Name = styled.div`
  flex: 1;
  padding: 10px;
`;

const Wrapper = styled.div`
  border: 2px solid ${p => p.theme.color.primary};
  display: flex;
  flex-direction: row;
  font-size: 1.2em;
  align-items: center;
  margin: 5px;
`;

const WindowRow = ({ id, src, startTime }) => {
  return (
    <Wrapper>
      <Id>{id}</Id>
      <Name>{getVideoName(src) || 'No Source'}</Name>
      {startTime && <Id>{Math.floor(startTime * 100)}%</Id>}
    </Wrapper>
  );
};

WindowRow.propTypes = {
  id: PropTypes.string,
  src: PropTypes.string,
  startTime: PropTypes.number
};

export default WindowRow;
