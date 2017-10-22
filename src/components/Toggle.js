import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: ${p => (p.on ? p.theme.color.primary : p.theme.color.dark)};
  border: 2px solid ${p => p.theme.color.light};
  color: ${p => p.theme.color.light};
  cursor: pointer;
  max-width: 300px;
  margin: 0.5em;
  padding: 2px 6px 3px;
  font-family: inherit;
  font-size: 1.2em;
  transition: background 200ms ease-in-out;

  &:hover {
    background: ${p => p.theme.color.tertiary};
  }
`;

const Toggle = ({ onChange, title, value }) => {
  return (
    <Wrapper on={value} onClick={() => onChange(!value)}>
      {title}
    </Wrapper>
  );
};

Toggle.propTypes = {
  onChange: PropTypes.func,
  title: PropTypes.string,
  value: PropTypes.bool
};

export default Toggle;
