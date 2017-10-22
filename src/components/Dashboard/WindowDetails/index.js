import React from 'react';
import PropTypes from 'prop-types';

import H2 from '../../typography/H2';
import WindowRow from './WindowRow';

const WindowDetails = ({ windows }) => {
  return (
    <div>
      <H2>Windows</H2>
      {windows.length > 0 ? (
        windows.map((w, i) => <WindowRow key={i} {...w} />)
      ) : (
        <div>No Windows Registered</div>
      )}
    </div>
  );
};

WindowDetails.propTypes = {
  windows: PropTypes.array
};

export default WindowDetails;
