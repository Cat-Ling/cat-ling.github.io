/*
This script handles the execution of checking whether the search query was a search or a url and treats it accordingly.
I switched from a massive tld list to a smarter regex approach +dorking support.
It still has its flaws, but works generally well for most use cases.
*/
function submitUrl() {
    let urlInput = document.getElementById('urlInput').value.trim();
    if (!urlInput) {
        return;
    }
    const containsSpace = /\s/.test(urlInput);

    // Handle !bangs locally for common sites
    if (handleBang(urlInput)) {
        return;
    }

    const dorkRegex = /^(site|rel|related|cache|info|define|stocks|weather|time|movie|map|inurl|intitle|intext|filetype|allintitle|allinurl|allintext):/i;

    if (containsSpace ||
        urlInput.startsWith('"') ||
        urlInput.startsWith("'") ||
        dorkRegex.test(urlInput) ||
        !/^(https?:\/\/)?\S+(\.\S+)+$/i.test(urlInput)) {
        submitDuckDuckGoSearch(urlInput);
    } else {
        window.location.href = urlInput.startsWith('http://') || urlInput.startsWith('https://') ? urlInput : 'https://' + urlInput;
    }
}
