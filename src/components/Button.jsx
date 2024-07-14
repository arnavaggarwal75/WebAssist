// Button.js
import React, { useRef, useEffect } from 'react';
import "../App.css"

function Button({ text, fn }) {

  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const height = button.clientHeight;
    const width = button.clientWidth;

    const handleMove = (e) => {
      const xVal = e.layerX;
      const yVal = e.layerY;
      const yRotation = 20 * ((xVal - width / 2) / width);
      const xRotation = -20 * ((yVal - height / 2) / height);
      const string = `perspective(500px) scale(1.1) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
      button.style.transform = string;
    };

    const resetTransform = () => {
      button.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)';
    };

    button.addEventListener('mousemove', handleMove);
    button.addEventListener('mouseout', resetTransform);
    button.addEventListener('mousedown', () => {
      button.style.transform = 'perspective(500px) scale(0.9) rotateX(0) rotateY(0)';
    });
    button.addEventListener('mouseup', () => {
      button.style.transform = 'perspective(500px) scale(1.1) rotateX(0) rotateY(0)';
    });

    return () => {
      button.removeEventListener('mousemove', handleMove);
      button.removeEventListener('mouseout', resetTransform);
      button.removeEventListener('mousedown', resetTransform);
      button.removeEventListener('mouseup', resetTransform);
    };
  }, []);
  


  return (
      <button ref={buttonRef}
        className="bg-slate-100 text-gray-900 p-4 m-2 w-[280px] h-[75px] font-extrabold font-mono text-lg rounded-lg tilt-button"
        onClick={fn}>
          {text}
      </button>
  );
}

export default Button;