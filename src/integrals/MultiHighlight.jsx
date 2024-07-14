import { getColorClass, sendMsg, saveStateToStorage, loadStateFromStorage } from "../utils";
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";

const MultiHighlight = () => {
  const initialColors = [
    "yellow",
    "green",
    "cyan",
    "gray",
    "orange",
    "pink",
    "blue",
    "purple",
    "rose",
    "teal",
  ];

  const [inputValue, setInputValue] = useState("");
  const [words, setWords] = useState([]);
  const [availableColors, setAvailableColors] = useState(initialColors);
  
  useEffect(() => {
    loadStateFromStorage('highlightedWords', (savedWords) => {
      if (savedWords) setWords(savedWords);
    });
    loadStateFromStorage('availableColors', (savedColors) => {
      if (savedColors) setAvailableColors(savedColors);
    });
  }, []);

  useEffect(() => {
    saveStateToStorage('highlightedWords', words);
    saveStateToStorage('availableColors', availableColors);
  }, [words, availableColors]);


  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    if (error) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        setError("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);


  const addWord = () => {
    if (words.some((word) => word.text.toLowerCase() === inputValue.trim().toLowerCase())) {
      setError("This Word is already being highlighted!");
    } else if (availableColors.length <= 0) {
      setError("Sorry, you can only add 10 words at once!");
    } else if (inputValue.trim() !== "") {
      const newColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      const newWords = [...words, { text: inputValue.trim(), color: newColor }];
      const newColors = availableColors.filter((color) => color !== newColor);

      setWords(newWords);
      setAvailableColors(newColors);
      setInputValue("");
      setError("");
      sendMsg(`highlight ${inputValue.trim()} ${newColor}`);
    }
  };

  const removeWord = (wordToRemove) => {
    const newWords = words.filter((word) => word.text !== wordToRemove.text);
    const newColors = [...availableColors, wordToRemove.color];

    setWords(newWords);
    setAvailableColors(newColors);
    sendMsg(`unhighlight ${wordToRemove.color}`);
  };

  return (
    <>
      <Navbar />

      <div className="w-[305px] h-[230px] bg-black bg-opacity-80 p-2 flex flex-col">
        <div className="flex w-full mt-1 mb-4">
          <input
            type="text"
            placeholder="Please enter the word to highlight.."
            className="flex-grow p-2 rounded-l-lg bg-white text-gray-900"
            value={inputValue}
            onChange={(e) => {
                setInputValue(e.target.value);
                setError(""); 
              }}  
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                    addWord();
                }
              }}
          />
          <button
            className="p-2 rounded-r-lg bg-white text-blue-700 font-extrabold text-xl"
            onClick={addWord}
          >
            +
          </button>
        </div>

        <div className="flex flex-wrap flex-grow ">
          {words.map((word) => (
            <span
              key={word.text}
              className={`m-1 p-1 font-bold font-Quicksand rounded ${getColorClass(word.color)} flex items-center justify-center cursor-pointer`}
              onClick={() => removeWord(word)}>
              {word.text}
            </span>
          ))}
        </div>

        <div className="text-center text-white italic font-bold font-Quicksand mb-1 mt-1">Click on word to unhighlight</div>

        {/* {showPopup && (
          <div className="absolute font-Quicksand top-6 text-xs left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 text-center font-bold flex items-center">
            {error}
          </div>
        )} */}

        {showPopup && (
        <div className="fixed top-6 left-0 right-0 mx-auto w-3/4 bg-red-600 text-white p-1 text-center font-bold text-xs">
            {error}
        </div>
        )}

      </div>
    </>
  );
};

export default MultiHighlight;