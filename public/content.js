// const checkBackendConnection = () => {
//     const content = document.body.innerText;
//     const num_words = 100
  
//     fetch('http://127.0.0.1:5000/summarize', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ content, num_words })
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log('Fetched response:', data); // Log the fetched data to the console
//     })
//     .catch(error => {
//       window.alert('There was a problem with the fetch operation: ' + error.message);
//     });
//   };
  
//   checkBackendConnection();

const messagesFromReactAppListener = (message, sender, response) => {

    console.log('[content.js]. Message received', {
      message,
      sender,
    })
  
    if (sender.id === chrome.runtime.id && message.from === "react" && message.message === 'Get page text') {
      const pageText = document.body.innerText;
      response(pageText);
    }
};
  
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

// const messagesFromReactAppListener = (message, sender, response) => {

//     console.log('[content.js]. Message received', {

//         message,

//         sender,

//     })

//     if (

//         sender.id === chrome.runtime.id &&

//         message.from === "react" &&

//         message.message === 'Hello from React') {

//         response('Hello from content.js');

//     }

//     if (

//         sender.id === chrome.runtime.id &&

//         message.from === "react" &&

//         message.message === "delete logo") {

//         console.log("DELETE Message RECIEB")

//     }

// }

// chrome.runtime.onMessage.addListener(messagesFromReactAppListener);