import logo from './logo.svg';
import './App.css';
import {Client} from '@stomp/stompjs'

function App() {

  const connectToSocket = () => {
    const client = new Client();
    client.configure({
      brokerURL: 'ws://localhost:8080/websocket',
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected successfully to websocket');

        //game id and player type hardcoded for test purpose TODO provide real values
        client.subscribe('/topic/2345/1', message => {
          const data = JSON.parse(message.body);
          console.log(data);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      debug: (str) => {
        console.log(new Date(), str);
      }
    });
    client.activate();
  };

  return (
    <div className="App">
      <button onClick={connectToSocket}>Connect</button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
