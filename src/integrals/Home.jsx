import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

function Home() {
  const placeholderFn = () => {
    console.log('Button clicked!');
  };

  return (
    <div className="w-[350px] h-[400px] flex-col">
      <Button text="TLDR" fn={placeholderFn} />
      <Button text="Skim" fn={placeholderFn} />
      <Button text="Text to Speech" fn={placeholderFn} />
      <Link to={"/chatbot"}>
      <Button text="Ask me a question" fn={placeholderFn} />
      </Link>
      <Link to={"/Flashcards"}>
      <Button text="Generate Flashcards" fn={placeholderFn} />
      </Link>
    </div>
  );
}

export default Home;
