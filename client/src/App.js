import './App.css';
import { Component } from 'react';
import RouterComp from './Router';

import img from './Images/2C.jpg';

class App extends Component {
  render(){
    return (
      <div className="App">
        <RouterComp />
      </div>
    );
  }
}

export default App;
