import logo from './logo.svg';
import './App.css';
import RouterComp from './Router';

function App() {
  const dontShow = true;

  return (
    <div className="App">
      { dontShow ? <> </> :
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
            Hello World!
          </a>
        </header>
      }
      <RouterComp />
    </div>
  );
}

export default App;
