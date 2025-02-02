import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
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
  const [initializing, setInitializing] = useState(false);

  // Send a GET request to the backend as soon as the component mounts to initialize the chat
  useEffect(() => {
    fetch('http://127.0.0.1:8000/init-chat')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return;
      })
  }, []);

  // This callback is passed to IntialSetting and called when the user clicks Save.
  // It changes the underlying header content to the initializing state.
  const handleInitializationStart = () => {
    setInitializing(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        {initializing ? (
          <>
            <CircularProgress style={{ margin: '20px' }} />
            <p>Initializing the app. This may take a few minutes...</p>
          </>
        ) : (
          <>
            <img 
              src={logo} 
              className="App-logo" 
              alt="logo" 
              onClick={() => setShowSettings(true)}
              style={{ cursor: 'pointer' }}
            />
            <p>Enter the settings to proceed</p>
          </>
        )}

        {/* Always render the settings modal if showSettings is true */}
        {showSettings && (
          <IntialSetting 
            trigger={showSettings} 
            setTrigger={setShowSettings}
            onInitializationStart={handleInitializationStart}
          />
        )}
      </header>
    </div>
  );
}

export default App;
