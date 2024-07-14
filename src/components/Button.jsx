// Button.js
// import React, { useRef, useEffect } from 'react';
// import "../App.css"

// function Button({ text, fn }) {

//   const buttonRef = useRef(null);

//   useEffect(() => {
//     const button = buttonRef.current;
//     const height = button.clientHeight;
//     const width = button.clientWidth;

//     const handleMove = (e) => {
//       const xVal = e.layerX;
//       const yVal = e.layerY;
//       const yRotation = 20 * ((xVal - width / 2) / width);
//       const xRotation = -20 * ((yVal - height / 2) / height);
//       const string = `perspective(500px) scale(1.1) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
//       button.style.transform = string;
//     };

//     const resetTransform = () => {
//       button.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)';
//     };

//     button.addEventListener('mousemove', handleMove);
//     button.addEventListener('mouseout', resetTransform);
//     button.addEventListener('mousedown', () => {
//       button.style.transform = 'perspective(500px) scale(0.9) rotateX(0) rotateY(0)';
//     });
//     button.addEventListener('mouseup', () => {
//       button.style.transform = 'perspective(500px) scale(1.1) rotateX(0) rotateY(0)';
//     });

//     return () => {
//       button.removeEventListener('mousemove', handleMove);
//       button.removeEventListener('mouseout', resetTransform);
//       button.removeEventListener('mousedown', resetTransform);
//       button.removeEventListener('mouseup', resetTransform);
//     };
//   }, []);
  


//   return (
//       <button ref={buttonRef}
//         className="bg-slate-100 text-gray-900 p-4 m-2 w-[280px] h-[75px] font-extrabold font-mono text-lg rounded-lg tilt-button"
//         onClick={fn}>
//           {text}
//       </button>
//   );
// }

// export default Button;


import React, { useRef, useEffect } from 'react';
import "../App.css";

function Button({ text, fn }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;

    const handleMouseOver = () => {
      button.style.transform = 'scale(1.1)';
    };

    const handleMouseOut = () => {
      button.style.transform = 'scale(1)';
    };

    const handleMouseDown = () => {
      button.style.transform = 'scale(0.95)';
    };

    const handleMouseUp = () => {
      button.style.transform = 'scale(1.1)';
    };

    button.addEventListener('mouseover', handleMouseOver);
    button.addEventListener('mouseout', handleMouseOut);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mouseover', handleMouseOver);
      button.removeEventListener('mouseout', handleMouseOut);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className="bg-slate-100 text-gray-900 p-4 m-2 w-[260px] h-[60px] font-extrabold font-mono text-lg rounded-lg transition-transform"
      onClick={fn}
    >
      {text}
    </button>
  );
}

export default Button;