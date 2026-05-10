chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'VET_IMAGES') {
        fetch('https://your-api-endpoint.com/vet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: request.urls })
        })
            .then(response => response.json())
            .then(data => {
                // Expected API response format: { "url1": true, "url2": false }
                sendResponse(data);
            })
            .catch(error => {
                console.error('API Error:', error);
                sendResponse(null);
            });

        return true; // Keeps the message channel open for async response
    }
});