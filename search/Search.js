function setUrlInputAndSubmit(url) {
    document.getElementById('urlInput').value = url;
    submitUrl(url);
}

function getQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromParam = urlParams.get('q');
    const queryFromHash = window.location.hash.substring(1);

    if (queryFromParam) {
        return queryFromParam;
    } else if (queryFromHash) {
        return decodeURIComponent(queryFromHash);
    }
    return null;
}

window.addEventListener('popstate', function(event) {
    if (event.state === null) {
        // User navigated back, do nothing
    }
});

const query = getQuery();

if (!window.history.state && (query === null || query === "")) {
    document.getElementById('errorMessage').innerText = "A search query is required.";
    setTimeout(function() {
        window.location.href = "../index.html";
    }, 3000);
} else if (!window.history.state && query !== null && query !== "") {
    setUrlInputAndSubmit(query);

    // Clear both query parameter and hash from URL
    history.replaceState({}, document.title, "/search");
}

// Optional: Intercept form submission to always use hash
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('urlInput').value;
    window.location.href = "/search#" + encodeURIComponent(query);
});
