import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import {getWebPageContent} from "../utils"
import { useState } from 'react';

function Home() {
  const [storedText, setStoredText] = useState('placeholder');

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

  return (
    <div className="w-[350px] h-[400px] flex-col">
      
      <Button text={"pls work"} fn={summaryClick} />
      <Button text="Skim" fn={placeholderFn} />
      <Button text="Text to Speech" fn={placeholderFn} />
      <Link to={"/chatbot"}>
      <Button text="Ask me a question" fn={placeholderFn} />
      </Link>
      <Link to={"/Flashcards"}>
      <Button text="Generate Flashcards" fn={placeholderFn} />
      </Link>

      <div>
        Page Content:
        {storedText}
      </div>
    </div>
  );
}

export default Home;
