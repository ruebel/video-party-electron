import styled from 'styled-components';

export default styled.button`
  background: ${p => p.theme.color.primary};
  border: 2px solid ${p => p.theme.color.light};
  color: ${p => p.theme.color.light};
  cursor: pointer;
  margin: 0.5em;
  font-family: inherit;
  font-size: 1.2em;
  transition: background 200ms ease-in-out;

  &:hover {
    background: ${p => p.theme.color.tertiary};
  }

  &:disabled {
    background: ${p => p.theme.color.dark};
  }
`;
