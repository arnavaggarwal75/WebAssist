import React from 'react';
import Typewriter from "typewriter-effect";
import '../App.css';

function TextDisplay({ content }) {
    return (
        <div className="typer">
            <Typewriter
                onInit={(typewriter) => {
                    typewriter
                        .typeString(content)
                        .start();
                }}
                options={{
                    delay: 0
                }}
            />
        </div>
    );
}

export default TextDisplay;
