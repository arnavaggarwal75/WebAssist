import React from 'react'

const ChatBot = () => {
  return (
    <div className="w-[350px] h-[400px]">
      <input type="text" className="w-[320px] h-[100px] border-solid border-black border-4"/>
      <input type="text" disabled className='w-[320px] h-[250px] border-solid border-black border-4'/>
    </div>
  )
}

export default ChatBot