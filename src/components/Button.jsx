import React from 'react';

function Button({ text, fn }) {
  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded m-2"
        onClick={fn}
      >
        {text}
      </button>
    </div>
  );
}

export default Button;
