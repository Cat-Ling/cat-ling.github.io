function setUrlInputAndSubmit(query) {
    document.getElementById('urlInput').value = query;
    submitUrl(query);
}

// Check both ?q= and #query
const urlParams = new URLSearchParams(window.location.search);
let query = urlParams.get('q');

// If no query in ?q=, check #
if (!query) {
    query = window.location.hash.substring(1);
}

// Handle popstate event to prevent logging
window.addEventListener('popstate', function(event) {
    if (event.state === null) {
        // User navigated back, do nothing
    }
});

if (!query) {
    document.getElementById('errorMessage').innerText = "A search query is required.";
    setTimeout(() => window.location.href = "../index.html", 3000);
} else {
    setUrlInputAndSubmit(query);

    // Ensure query is not stored in history
    history.replaceState({}, document.title, "/search#" + encodeURIComponent(query));
}
