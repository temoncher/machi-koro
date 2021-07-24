
import * as React from 'react';
import { ReactComponent as Logo } from './logo.svg';
import { greet, initializeSocket } from './socket';

export function App() {
  const [isConnected, setIsConnected] = React.useState(false);

  return (
    <div style={{ backgroundColor: 'grey' }}>
      <Logo width="75" height="75" />
      {isConnected
        ? <button onClick={greet}>Greet the server!</button>
        : <button onClick={() => {initializeSocket(); setIsConnected(true)}}>CONNECT</button>}

    </div>
  );
}

export default App;
