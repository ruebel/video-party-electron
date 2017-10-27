import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import styled from 'styled-components';
import Styler from './RangeStyler';

const Title = styled.div`margin-top: 25px;`;

const Range = ({ onChange, title, value }) => {
  return (
    <Styler>
      {title && <Title>{title}</Title>}
      <InputRange
        maxValue={120}
        minValue={1}
        onChange={onChange}
        step={0.5}
        value={value}
      />
    </Styler>
  );
};

Range.propTypes = {
  onChange: PropTypes.func,
  title: PropTypes.string,
  value: PropTypes.shape({
    max: PropTypes.number,
    min: PropTypes.number
  })
};

export default Range;
