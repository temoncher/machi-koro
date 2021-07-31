import * as React from 'react';

import { ReactComponent as Logo } from './logo.svg';
import { greet, initializeSocket } from './socket';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = React.useState(false);

  const connect = () => {
    initializeSocket();
    setIsConnected(true);
  };

  return (
    <div style={{ backgroundColor: 'grey' }}>
      <Logo width="75" height="75" />
      {isConnected
        ? <button type="button" onClick={greet} data-test-id="greet_button">Greet the server!</button>
        : <button type="button" onClick={connect} data-test-id="connect_button" className={'font-lithos font-black'}>CONNECT</button>}
    </div>
  );
};

export default App;
