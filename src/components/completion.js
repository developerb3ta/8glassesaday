import React from 'react';

const Completion = ({ totalGlasses, glassesDrank }) => (
  <div>
    <h2>Congratulations!</h2>
    <p>You drank {glassesDrank} out of {totalGlasses} glasses today!</p>
  </div>
);

export default Completion;
