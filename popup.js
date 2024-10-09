document.getElementById('analyzeButton').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: getPageContent
    }, (results) => {
      if (results && results[0] && results[0].result) {
        sendToOpenAI(results[0].result);
      }
    });
  });
});

function sendToOpenAI(content) {
  const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key
  const url = 'https://api.openai.com/v1/chat/completions';

  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: content }]
    })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('response').innerText = data.choices[0].message.content;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('response').innerText = 'Error occurred!';
  });
}

