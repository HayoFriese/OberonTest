import React, { Component } from 'react';
import MapContainer from './components/Map';
import SearchContainer from './components/Search';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <section className="map-wrapper">
          <MapContainer />
        </section>
        <SearchContainer />
      </div>
    );
  }
}

export default App;
