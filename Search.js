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

if (!window.history.state && query !== null && query !== "") {
    // This is the initial page load or a forward navigation
    setUrlInputAndSubmit(query);
}