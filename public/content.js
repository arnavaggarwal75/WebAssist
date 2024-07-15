// To reset extension's state on new session
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
chrome.storage.local.set({ highlightedWords: [], availableColors: initialColors, 
            chatInputValue: "", chatResponseValue: "", chatWasSubmitted: false,
            summaryInputValue: "", summaryResponseValue:"", summaryWasSubmitted: false});

const messagesFromReactAppListener = (message, sender, response) => {

    console.log('[content.js]. Message received', {
      message,
      sender,
    })
  
    if (sender.id === chrome.runtime.id && message.from === "react" && message.message === 'Get page text') {
      const pageText = document.body.innerText;
      response(pageText);
    }


    if (sender.id === chrome.runtime.id && message.from === "react" && message.message.startsWith("highlight")) {
      let splits = message.message.split(" ");
      const searchTerm = splits[1];
      const className = "highColor" + splits[2].charAt(0).toUpperCase() + splits[2].slice(1);
      const searchTermRegex = new RegExp(searchTerm, 'gi'); // 'g' for global match and 'i' for case insensitive
      
      // Function to recursively traverse and highlight text nodes
      function highlightTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const matches = node.nodeValue.match(searchTermRegex);
          if (matches) {
            const span = document.createElement('span');
            span.innerHTML = node.nodeValue.replace(searchTermRegex, (match) => `<span class=${className}>${match}</span>`);
            node.parentNode.replaceChild(span, node);
          }
        } else {
          for (let child of node.childNodes) {
            highlightTextNodes(child);
          }
        }
      }
    
      highlightTextNodes(document.body);
      response("Done")
    }

    if (sender.id === chrome.runtime.id && message.from === "react" && message.message.startsWith("unhighlight")) {
      let splits = message.message.split(" ");
      const className = "highColor" + splits[1].charAt(0).toUpperCase() + splits[1].slice(1);
      const highlightedElements = document.querySelectorAll(`span.${className}`);
      
      highlightedElements.forEach(element => {
        const parent = element.parentNode;
        parent.replaceChild(document.createTextNode(element.innerText), element);
        parent.normalize(); // Merge adjacent text nodes
      });

      response("Done")
    }
}
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);