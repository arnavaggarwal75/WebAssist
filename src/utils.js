export const getWebPageContent = () => {
    return new Promise((resolve, reject) => {
      const message = {
        from: 'react',
        message: 'Get page text'
      };
  
      const queryInfo = {
        active: true,
        currentWindow: true
      };
  
      chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        const currentTabId = tabs[0].id;
        chrome.tabs.sendMessage(currentTabId, message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    });
  };