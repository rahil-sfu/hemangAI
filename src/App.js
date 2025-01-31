import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import logo from './logo.svg';
import logo from './settings-gear-2.svg';
import './App.css';
import IntialSetting from './Components/IntialSetting.js';
import AiPage from './Components/AiPage.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/AiPage' element={<AiPage />} />
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
          Enter the settings to proceed
        </p>

        {showSettings && <IntialSetting trigger={showSettings} setTrigger={setShowSettings} />}


      </header>
    </div>
  );
}


export default App;
