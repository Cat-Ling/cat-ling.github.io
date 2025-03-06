function setUrlInputAndSubmit(url) {
    document.getElementById('urlInput').value = url;
    submitUrl(url);
}

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');

window.addEventListener('popstate', function(event) {
    // Check if the event state is null, indicating a backward navigation
    if (event.state === null) {
        // User has navigated back, do nothing
    }
});

if (!window.history.state && (query === null || query === "")) {
    document.getElementById('errorMessage').innerText = "A search query is required.";
    setTimeout(function() {
        window.location.href = "../index.html";
    }, 3000); // Go back to homepage if the query is not provided.
} else if (!window.history.state && query !== null && query !== "") {
    // This is the initial page load or a forward navigation
    setUrlInputAndSubmit(query);
    
    // Remove the query from the URL to prevent it from being stored in history
    history.replaceState({}, document.title, "/search");
}
