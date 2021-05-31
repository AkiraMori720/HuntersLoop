import React from 'react';

import Navigator from './src/Navigator';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <>
      <Navigator />
      </>
    );
  }
};
