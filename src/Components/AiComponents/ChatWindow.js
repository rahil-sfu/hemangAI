import React, { useRef } from 'react';
import './ChatWindow.css';
import { FaUser, FaBilibili, FaSistrix, FaRegClone, FaLink } from "react-icons/fa6";

function ChatWindow({ openRightSidebar }) {
  // Create a ref for the answer paragraph so we can copy its text.
  const answerRef = useRef(null);

  // Handler for copying the answer text
  const handleCopy = () => {
    if (answerRef.current) {
      const textToCopy = answerRef.current.innerText || answerRef.current.textContent;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Optional: You can notify the user that the text was copied.
          console.log('Copied to clipboard:', textToCopy);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  return (
    <>
      <hr className="hr-line" />
      <div className="answer-container">
        {/* User Message */}
        <div className="message-row user-message">
          <div className="message-bubble user-bubble">
            <p className="question">Who is the founder of OpenAi?</p>
          </div>
          <div className="user-icon">
            <FaUser />
          </div>
        </div>

        {/* Bot Message */}
        <div className="message-row bot-message">
          <div className="bot-icon">
            <FaBilibili />
          </div>
          <div className="bot-container">
            <div className="message-bubble bot-bubble">
              <p 
                className="thought" 
                onClick={openRightSidebar} 
                style={{ cursor: 'pointer' }}>
                Thought for 3 seconds...
              </p>
              <p className="answer" ref={answerRef}>
                OpenAI was founded in December 2015 by a group of 11 individuals, with key founders including:
                Sam Altman (co-chair and current CEO)
                Elon Musk (co-chair, who left the board in 2018)
                Greg Brockman
                Ilya Sutskever
                Wojciech Zaremba
                The company was initially established as a nonprofit with an ambitious goal of developing artificial intelligence that would benefit humanity. The founding team also included other notable members such as Trevor Blackwell, Vicki Cheung, Andrej Karpathy, Durk Kingma, John Schulman, Pamela Vagata, and others123.
                The founders committed an initial $1 billion in funding, though only $130 million was actually collected by 2019. Elon Musk was reportedly the largest donor during the early stages3. The organization was originally run from Greg Brockman's living room before being headquartered in San Francisco's Mission District3.
                Interestingly, as of 2024, only four of the original 11 founding members remain with the company, with Sam Altman serving as the primary public face and CEO of OpenAI2.
              </p>
            </div>
            <div className="post-icons">
              <div className="icon" onClick={handleCopy}>
                <FaRegClone />
              </div>
              <div className="icon" onClick={openRightSidebar}>
                <FaSistrix />
              </div>
              <div className="icon">
                <FaLink />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;




// import React from 'react';
// import './ChatWindow.css';
// import { FaBilibili, FaUser } from "react-icons/fa6";

// function ChatWindow() {
//   return (
//     <>
//       <hr className="hr-line" />
//       <div className="answer-container">
//         {/* User Message Row: Question with user icon on the right */}
//         <div className="message-row user-message">
//           <p className="question">Who is the founder of OpenAi?</p>
//           <div className="user-icon">
//             <FaUser />
//           </div>
//         </div>

//         {/* Bot Message Row: Bot icon on the left with answer text */}
//         <div className="message-row bot-message">
//           <div className="bot-icon">
//             <FaBilibili />
//           </div>
//           <p className="answer">
              // OpenAI was founded in December 2015 by a group of 11 individuals, with key founders including:
              // Sam Altman (co-chair and current CEO)
              // Elon Musk (co-chair, who left the board in 2018)
              // Greg Brockman
              // Ilya Sutskever
              // Wojciech Zaremba
              // The company was initially established as a nonprofit with an ambitious goal of developing artificial intelligence that would benefit humanity. The founding team also included other notable members such as Trevor Blackwell, Vicki Cheung, Andrej Karpathy, Durk Kingma, John Schulman, Pamela Vagata, and others123.
              // The founders committed an initial $1 billion in funding, though only $130 million was actually collected by 2019. Elon Musk was reportedly the largest donor during the early stages3. The organization was originally run from Greg Brockman's living room before being headquartered in San Francisco's Mission District3.
              // Interestingly, as of 2024, only four of the original 11 founding members remain with the company, with Sam Altman serving as the primary public face and CEO of OpenAI2.

//           </p>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ChatWindow;
