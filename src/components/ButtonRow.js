import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & > * {
    flex: 1;
  }
`;
