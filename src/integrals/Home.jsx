import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import {getWebPageContent, sendMsg} from "../utils"
import { useState } from 'react';
import Navbar from '../components/navbar';

function Home() {

  const summaryClick = async () => {
    try {
      let response = await getWebPageContent()
      setStoredText(response)
    } catch (e) {
      window.alert("some issue")
    }
    // fetch('http://localhost:3000/api/v1/contacts')
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     setContacts(data);
    //   })
    //   .catch(error => {
    //     window.alert('There was a problem with the fetch operation');
    //   });
  };
    
  const placeholderFn = () => {
    window.alert('Not taken care of yet');
  };

  const highTry = () => {
    console.log("Hello")
    // const message = {
    //   from: 'react',
    //   message: 'highlight yellow'
    // };

    // const queryInfo = {
    //   active: true,
    //   currentWindow: true
    // };

    // chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
    //   const currentTabId = tabs[0].id;
    //   chrome.tabs.sendMessage(currentTabId, message, (response) => {
    //     if (chrome.runtime.lastError) {
    //       reject(new Error(chrome.runtime.lastError.message));
    //     } else {
    //       resolve(response);
    //     }
    //   });
    // });
  }

  const UnhighTry = () => {
    const message = {
      from: 'react',
      message: 'unhighlight yellow'
    };

    const queryInfo = {
      active: true,
      currentWindow: true
    };

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const currentTabId = tabs[0].id;
      chrome.tabs.sendMessage(currentTabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  return (
    <>
    <Navbar />
    <div className="w-[305px] h-[330px] bg-black bg-opacity-80 p-2 flex flex-col justify-center items-center" >
      <Button text={"Generate Summary"} fn={summaryClick} />
      <Link to={"/Flashcards"}>
      <Button text="Generate Flashcards" fn={placeholderFn} />
      </Link>
      <Link to={"/chatbot"}>
      <Button text="Ask me a question" fn={placeholderFn} />
      </Link>
      <Link to={"/multiHighlight"}>
      <Button text="Multi Highlight" fn={highTry} />
      </Link>
    </div>
    </>
  );
}

export default Home;
