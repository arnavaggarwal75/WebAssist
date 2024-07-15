import React from "react";
import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./integrals/home";
import ChatBot from "./integrals/ChatBot";
import Flashcards from "./integrals/Flashcards";
import MultiHighlight from "./integrals/MultiHighlight";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/multiHighlight" element={<MultiHighlight />} />
      </Routes>
    </Router>
  );
}

export default App;
// import React, { useEffect, useState } from 'react';

// const App = () => {
//   const [url, setUrl] = useState('');
//   const [pageText, setPageText] = useState('');

//   // Get current URL
//   useEffect(() => {
//     const queryInfo = { active: true, lastFocusedWindow: true };
//     chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
//       const url = tabs[0].url;
//       setUrl(url);
//     });
//   }, []);

//   // Send message to the content script to get page text
//   const getPageText = () => {
//     const message = {
//       from: 'react',
//       message: 'Get page text'
//     };

//     const queryInfo = {
//       active: true,
//       currentWindow: true
//     };

//     chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
//       const currentTabId = tabs[0].id;

//       chrome.tabs.sendMessage(currentTabId, message, (response) => {
//         setPageText(response);
//       });
//     });
//   };

//   return (
//     <div>
//       <div>URL: {url}</div>
//       <button onClick={getPageText}>Get Page Text</button>
//       <div>Page Text: {pageText}</div>
//     </div>
//   );
// };

// export default App;