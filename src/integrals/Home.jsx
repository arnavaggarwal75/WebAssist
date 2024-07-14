import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import {getWebPageContent} from "../utils"
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
    const message = {
      from: 'react',
      message: 'highlight yellow'
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
    <div className="w-[350px] h-[400px] bg-black bg-opacity-80 p-2 flex flex-col justify-center items-center" >
      <Button text={"Generate Summary"} fn={summaryClick} />
      <Button text="Multi Highlight" fn={highTry} />
      <Link to={"/chatbot"}>
      <Button text="Ask me a question" fn={placeholderFn} />
      </Link>
      <Link to={"/Flashcards"}>
      <Button text="Generate Flashcards" fn={placeholderFn} />
      </Link>
    </div>
    </>
  );
}

export default Home;
