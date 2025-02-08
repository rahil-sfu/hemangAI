import React, { useRef } from 'react';
import './ChatWindow.css';

import bot from '../../Icons/bot.png';
import copy from '../../Icons/copy.png';
import evalute from '../../Icons/evaluate.png';
// import graph from '../../Icons/graph.png';
// import reprocess from '../../Icons/reprocess.png';
import sources from '../../Icons/sources.png';
import user from '../../Icons/user.png';

function ChatWindow({ openRightSidebar, openLeftSidebar }) {
  // Create a ref for the answer paragraph so we can copy its text.
  const answerRef = useRef(null);

  // Handler for copying the answer text
  const handleCopy = () => {
    if (answerRef.current) {
      const textToCopy =
        answerRef.current.innerText || answerRef.current.textContent;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // Optional: You can notify the user that the text was copied.
          console.log('Copied to clipboard:', textToCopy);
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  return (
    <>
      <div className="answer-container">
        {/* User Message */}
        <div className="message-row user-message">
          <div className="message-bubble user-bubble">
            <p className="question">Who is the founder of OpenAi?</p>
          </div>
          <div className="user-icon">
            <img src={user} alt="user icon" />
          </div>
        </div>

        {/* Bot Message */}
        <div className="message-row bot-message">
          <div className="bot-icon">
            <img src={bot} alt="bot icon" />
          </div>
          <div className="bot-container">
            <div className="message-bubble bot-bubble">
              <p
                className="thought"
                onClick={openRightSidebar}
                style={{ cursor: 'pointer' }}
              >
                Thought and searched for 30 seconds...
              </p>
              <p className="sources">Sources Read: 3</p>
              <p className="answer" ref={answerRef}>
                OpenAI was founded in December 2015 by a group of 11
                individuals, with key founders including: Sam Altman (co-chair and
                current CEO), Elon Musk (co-chair, who left the board in 2018),
                Greg Brockman, Ilya Sutskever, and Wojciech Zaremba. The company was
                initially established as a nonprofit with an ambitious goal of
                developing artificial intelligence that would benefit humanity.
                Additional members of the founding team included Trevor Blackwell,
                Vicki Cheung, Andrej Karpathy, Durk Kingma, John Schulman,
                Pamela Vagata, and others123. The founders committed an initial $1
                billion in funding, though only $130 million was actually collected
                by 2019. Elon Musk was reportedly the largest donor during the early
                stages3. The organization was originally run from Greg Brockman's
                living room before being headquartered in San Francisco's Mission
                District3. Interestingly, as of 2024, only four of the original 11
                founding members remain with the company, with Sam Altman serving as
                the primary public face and CEO of OpenAI2.
              </p>
            </div>
            <div className="post-icons">
              <div className="copy-icon" onClick={handleCopy}>
                <img src={copy} alt="copy icon" />
                <span className="tooltip">Copy To Clipboard</span>
              </div>
              <div className="evaluate-icon" onClick={openRightSidebar}>
                <img src={evalute} alt="evaluate icon" />
                <span className="tooltip">Evaluate Answer</span>
              </div>
              <div className="sources-icon" onClick={openRightSidebar}>
                <img src={sources} alt="sources icon" />
                <span className="tooltip">View Sources</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
