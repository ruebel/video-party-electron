import styled from 'styled-components';

export default styled.div`
  .input-range__slider {
    appearance: none;
    background: ${p => p.theme.color.primary};
    border: 1px solid ${p => p.theme.color.primary};
    border-radius: 100%;
    cursor: pointer;
    display: block;
    height: 1rem;
    margin: -0.5rem;
    margin-top: -0.65rem;
    outline: none;
    position: absolute;
    top: 50%;
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    width: 1rem;
  }

  .input-range__slider:active,
  .input-range__slider:hover {
    transform: scale(1.3);
  }

  .input-range__slider:focus {
    box-shadow: 0 0 0 5px rgba(63, 81, 181, 0.2);
  }

  .input-range--disabled .input-range__slider {
    background: ${p => p.theme.color.light};
    border: 1px solid ${p => p.theme.color.light};
    box-shadow: none;
    transform: none;
  }

  .input-range__slider-container {
    transition: left 0.1s ease-out;
  }

  .input-range__label {
    color: ${p => p.theme.color.light};
    font-size: 1rem;
    transform: translateZ(0);
    white-space: nowrap;
  }

  .input-range__label--min,
  .input-range__label--max {
    bottom: -1.5rem;
    position: absolute;
  }

  .input-range__label--min {
    left: 0;
  }

  .input-range__label--max {
    right: 0;
  }

  .input-range__label--value {
    position: absolute;
    top: -1.9rem;
  }

  .input-range__label-container {
    left: -50%;
    position: relative;
  }

  .input-range__label--max .input-range__label-container {
    left: 50%;
  }

  .input-range__track {
    background: ${p => p.theme.color.light};
    border-radius: 0.3rem;
    cursor: pointer;
    display: block;
    height: 0.3rem;
    position: relative;
    transition: left 0.1s ease-out, width 0.1s ease-out;
  }

  .input-range--disabled .input-range__track {
    background: ${p => p.theme.color.light};
  }

  .input-range__track--background {
    left: 0;
    margin-top: -0.15rem;
    position: absolute;
    right: 0;
    top: 50%;
  }

  .input-range__track--active {
    background: ${p => p.theme.color.primary};
  }

  .input-range {
    height: 1rem;
    position: relative;
    width: 100%;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;
