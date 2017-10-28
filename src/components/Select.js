import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Label = styled.div``;

const SelectControl = styled.select`
  background: transparent;
  border: none;
  color: ${p => p.theme.color.light};
  font-family: inherit;
  font-size: 1.2em;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

const SelectWrapper = styled.div`
  border: 2px solid ${p => p.theme.color.light};
  margin: 0.5em;
  padding: 1px 6px 2px;

  &:hover {
    background: ${p => p.theme.color.primary};
  }
`;

const Wrapper = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
`;

const Select = ({ onChange, options, title, value }) => {
  return (
    <Wrapper>
      {title && <Label>{title}</Label>}
      <SelectWrapper>
        <SelectControl onChange={e => onChange(e.target.value)} value={value}>
          {options.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </SelectControl>
      </SelectWrapper>
    </Wrapper>
  );
};

Select.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Select;
