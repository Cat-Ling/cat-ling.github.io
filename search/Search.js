function setUrlInputAndSubmit(url) {
    document.getElementById('urlInput').value = url;
    submitUrl();
}

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');

window.addEventListener('popstate', function (event) {
    // Check if the event state is null, indicating a backward navigation
    if (event.state === null) {
        // User has navigated back, do nothing
    }
});

if (!window.history.state && (query === null || query === "")) {
    document.getElementById('errorMessage').innerText = "A search query is required.";
    setTimeout(function () {
        window.location.href = "../index.html";
    }, 3000); // Go back to homepage if the query is not provided.
} else if (!window.history.state && query !== null && query !== "") {
    if (window.handleBang && window.handleBang(query)) {
        return;
    }

    if (query.startsWith('http://') || query.startsWith('https://')) {
        window.location.href = query;
    } else {
        // This is the initial page load or a forward navigation
        setUrlInputAndSubmit(query);
    }
}
