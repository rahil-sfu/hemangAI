import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import logo from './logo.svg';
import logo from './settings-gear-2.svg';
import './App.css';
import './Components/IntialSetting.js';
import IntialSetting from './Components/IntialSetting.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img 
          src={logo} 
          className="App-logo" 
          alt="logo" 
          onClick={() => setShowSettings(true)}
          style={{ cursor: 'pointer' }}
        />

        <p>
          Tap the spinner to enter the settings
        </p>

        <IntialSetting trigger={showSettings} setTrigger={setShowSettings}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3>Settings</h3>

          <div className="form-group">
            <label htmlFor="model-provider">Model Provider</label>
            <select id="model-provider">
              <option>OpenAI</option>
              <option>Google</option>
              <option>Anthropic</option>
              <option>XAI</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="brave-api">Brave Search API Key</label>
            <input type="text" id="brave-api" placeholder="Enter API Key" />
          </div>

          <div className="form-group">
            <label htmlFor="proxy-list">Proxy List</label>
            <textarea id="proxy-list" placeholder="Enter proxies, one per line"></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="neo4j-url">Neo4j URL</label>
            <input type="text" id="neo4j-url" placeholder="Enter Neo4j URL" />
          </div>

          <div className="form-group">
            <label htmlFor="neo4j-username">Neo4j Username</label>
            <input type="text" id="neo4j-username" placeholder="Enter Username" />
          </div>

          <div className="form-group">
            <label htmlFor="neo4j-password">Neo4j Password</label>
            <input type="password" id="neo4j-password" placeholder="Enter Password" />
          </div>

        </div>

        </IntialSetting>

      </header>
    </div>
  );
}


export default App;
