import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Flashcard from "../components/flashcard";
import { ThreeDots } from "react-loader-spinner";
import { getWebPageContent } from "../utils";


const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFlashcards = async () => {
      // setTimeout(() => {
      //   setFlashcards(['hello i am arav aggarwal and i am a very good boy hiw do you do perosnlay ,kgh', 'vsiuvnefiouwnvioewvnuiewnrvnewuivnriuevbiquribqiurvb', 'vsiuvnefiouwnvioewvnuiewnrvnewuivnriuevbiquribqiurvb'])
      // }, 1000);

      const content = await getWebPageContent();
      const data = {
        content: content
      };
    
      axios.post('http://127.0.0.1:5000/flashcards', data)
        .then(response => {
          setFlashcards(response.data);  // With axios, the JSON is already parsed
        })
        .catch(error => {
          window.alert('Error:', error);
        });
    };
    fetchFlashcards();
  }, []);

  const nextFlashcard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const prevFlashcard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <>
      <Navbar/>
      <div className="w-[450px] h-[300px] bg-black bg-opacity-80 p-3 flex justify-center items-center">
        {flashcards.length > 0 ? (
          <>
            <Flashcard 
              text={flashcards[currentIndex]} 
              progress={(currentIndex + 1) / flashcards.length} 
              onNext={nextFlashcard} 
              onPrev={prevFlashcard} 
            />
          </>
        ) : (
          <div className="flex justify-center items-center">
                <ThreeDots width = "40" height = "40" color = '#ffffff'/>
          </div>
        )}
      </div>
    </>
  );
};

export default Flashcards;
