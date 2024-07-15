import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';

function Home() {
  return (
    <>
    <Navbar />
    <div className="w-[305px] h-[330px] bg-black bg-opacity-80 p-2 flex flex-col justify-center items-center" >
      <Link to={"/Summary"}>
      <Button text={"Generate Summary"} />
      </Link>
      <Link to={"/Flashcards"}>
      <Button text="Generate Flashcards"/>
      </Link>
      <Link to={"/chatbot"}>
      <Button text="Ask me a question" />
      </Link>
      <Link to={"/multiHighlight"}>
      <Button text="Multi Highlight" />
      </Link>
    </div>
    </>
  );
}

export default Home;
