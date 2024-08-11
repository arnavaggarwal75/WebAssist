import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { ArrowCircleDownIcon } from '@heroicons/react/outline';
import TextDisplay from '../components/TextDisplay';
import { getWebPageContent, saveStateToStorage, loadStateFromStorage } from '../utils';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const ChatBot = () => {
  const [inputValue, setInputValue] = useState(""); // To store user input
  const [responseData, setResponseData] = useState(""); // To store response data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSubmitted, setSubmitted] = useState(false);
  const [isLoadedFromStorage, setLoadedFromStorage] = useState(false);

  // To preserve state of extension during session
  useEffect(() => {
    loadStateFromStorage('chatInputValue', (savedInputVal) => {
      if (savedInputVal) setInputValue(savedInputVal);
    });
    loadStateFromStorage('chatResponseValue', (savedResponseVal) => {
      if (savedResponseVal){
        setResponseData(savedResponseVal);
        setLoadedFromStorage(true);
      }  
    });
    loadStateFromStorage('chatWasSubmitted', (chatWasSubmitted) => {
      if (chatWasSubmitted) setSubmitted(chatWasSubmitted);
    });
  }, []);

  useEffect(() => {
    saveStateToStorage('chatInputValue', inputValue);
    saveStateToStorage('chatResponseValue', responseData);
    saveStateToStorage('chatWasSubmitted', isSubmitted);
  }, [inputValue, responseData, isSubmitted]);

  const handleUserInput = async () => {
    setLoadedFromStorage(false);
    setSubmitted(true);
    setIsLoading(true);

    const content = await getWebPageContent();
    const data = {
      content: content,
      question: inputValue
    };
  
    axios.post('http://127.0.0.1:5000/answer', data)
      .then(response => {
        setResponseData(response.data);  // With axios, the JSON is already parsed
        setIsLoading(false);
      })
      .catch(error => {
        window.alert('Error:', error);
        setIsLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className="w-[305px] h-[330px] bg-black bg-opacity-80 p-3 flex flex-col">
        <div className="flex w-full mt-1 mb-4">
          <textarea
            placeholder="Please enter your question.."
            className="flex-grow p-2 rounded-l-lg bg-white text-gray-900 resize-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUserInput();
              }
            }}
          />
          <button
            className="p-2 rounded-r-lg bg-white text-blue-700 font-extrabold text-xl"
            onClick={handleUserInput}
          >
            <ArrowCircleDownIcon className='h-5 w-5'/>
          </button>
        </div>
        
        {
          isSubmitted && (
            isLoading ? (
              <div className="flex justify-center items-center">
                <ThreeDots width = "40" height = "40" color = '#ffffff'/>
              </div>
            ) : (
              <TextDisplay content={responseData} animate={!isLoadedFromStorage} />
            )
          )
        }
      </div>
    </>
  );
}

export default ChatBot;
