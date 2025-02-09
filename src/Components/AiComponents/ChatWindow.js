// ChatWindow.js
import React, { useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './ChatWindow.css';

import bot from '../../Icons/bot.png';
import copy from '../../Icons/copy.png';
import evalute from '../../Icons/evaluate.png';
import sourcesIcon from '../../Icons/sources.png';
import user from '../../Icons/user.png';

function ChatWindow({ userMessage, aiAnswer, thinkingTime, openRightSidebar, openLeftSidebar }) {
  const answerRef = useRef(null);

  const handleCopy = () => {
    if (answerRef.current) {
      const textToCopy = answerRef.current.innerText || answerRef.current.textContent;
      navigator.clipboard.writeText(textToCopy)
        .then(() => console.log('Copied to clipboard:', textToCopy))
        .catch((err) => console.error('Failed to copy text:', err));
    }
  };

  return (
    <div className="answer-container">
      {/* User Message */}
      <div className="message-row user-message">
        <div className="message-bubble user-bubble">
          <p className="question">{userMessage}</p>
        </div>
        <div className="user-icon">
          <img src={user} alt="user icon" />
        </div>
      </div>

      {/* Bot Message */}
      <div className="message-row bot-message">
        {aiAnswer === "Loading..." ? (
          // Loading state: show the MUI spinner with "Thinking..." text
          <div className="bot-loading">
            <CircularProgress size={30} sx={{ color: '#ccc' }} />
            <p className="loading-text">Thinking...</p>
          </div>
        ) : (
          // Finished state: show the bot icon, the thought time text,
          // then the answer and the post icons.
          <>
            <div className="bot-icon">
              <img src={bot} alt="bot icon" />
            </div>
            <div className="bot-container">
              {thinkingTime && (
                <div className="thinking-info">
                  <span className="thinking-time" onClick={() => openRightSidebar()}>Thought for {thinkingTime} seconds</span>
                </div>
              )}
              <div>
                <p className='sources-read'>Sources Read: 3 </p>
              </div>
              <div className="message-bubble bot-bubble">
                <p className="answer" ref={answerRef}>
                  {aiAnswer}
                </p>
              </div>
              <div className="post-icons">
                <div className="copy-icon" onClick={handleCopy}>
                  <img src={copy} alt="copy icon" />
                  <span className="tooltip">Copy To Clipboard</span>
                </div>
                <div className="evaluate-icon" onClick={() => openRightSidebar()}>
                  <img src={evalute} alt="evaluate icon" />
                  <span className="tooltip">Evaluate Answer</span>
                </div>
                <div className="sources-icon" onClick={() => openRightSidebar("sources")}>
                  <img src={sourcesIcon} alt="sources icon" />
                  <span className="tooltip">View Sources</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
