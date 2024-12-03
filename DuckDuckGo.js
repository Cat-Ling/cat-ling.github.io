/*
 Weird extension makers, stay away please. I'll come hunt you
 down if I find you using this script. https://tinyurl.com/34eusjmt
 This script handles the submission of search queries and sends them
 to DuckDuckGo while including some additional parameters whcih improve
 functionality.
*/
function submitDuckDuckGoSearch(query) {
    const form = document.createElement('form');
    form.action = 'https://duckduckgo.com/';
    form.method = 'POST'; // Set the submit method to POST to prevent your searches from being visible in the URL and tracked by your browser.

    const Query = document.createElement('input');
    Query.type = 'hidden';
    Query.name = 'q';
    Query.value = query;

    const SafeSearch = document.createElement('input');
    SafeSearch.type = 'hidden';
    SafeSearch.name = 'kp';
    SafeSearch.value = '-2'; // Disables safesearch.

    const method = document.createElement('input');
    method.type = 'hidden';
    method.name = 'kg';
    method.value = 'p'; // Tells DuckDuckGo to use POST instead of GET.

    const theme = document.createElement('input');
    theme.type = 'hidden';
    theme.name = 'kae';
    theme.value = 'd'; // Theme. Default is d=Dark

    const header = document.createElement('input');
    header.type = 'hidden';
    header.name = 'ko';
    header.value = '1'; // Floating navbar.

    const advertisements = document.createElement('input');
    advertisements.type = 'hidden';
    advertisements.name = 'k1';
    advertisements.value = '-1'; // Tells DuckDuckGo to disable ads.

    const videoPrefs = document.createElement('input');
    videoPrefs.type = 'hidden';
    videoPrefs.name = 'k5';
    videoPrefs.value = '-1'; // This will prompt you whether you want to play any video fromr results directly on DuckDuckGo or go to that video's page.

    const https = document.createElement('input');
    https.type = 'hidden';
    https.name = 'kh';
    https.value = '1'; // Tells DuckDuckGo that you prefer https. We're already doing that in our modern browsers, but this value makes sure of it, so why not.

    const hideRef = document.createElement('input');
    hideRef.type = 'hidden';
    hideRef.name = 'kd';
    hideRef.value = '1'; // It's probably not needed but anything that increases privacy is good right? It hides where you came from, in simple terms, sites won't know the search page you came from (which would reveal your search term) but we don't have to worry anyway because we're using POST to do searches.

    const autoLR = document.createElement('input');
    autoLR.type = 'hidden';
    autoLR.name = 'kav';
    autoLR.value = '1'; // Auto loads results as you scroll.

    const region = document.createElement('input');
    region.type = 'hidden';
    region.name = 'kl';
    region.value = 'us-en'; // Default search region. Default is United States, English.

    form.appendChild(Query); // Search query. (The thing you type to search :p)
    form.appendChild(SafeSearch); // If you're thinking of using this script for your site, remove this to set safesearch to default.
    form.appendChild(theme); // Remove this to set theme to default.
    form.appendChild(header); // Remove this if you want the navbar to not be persistently floating.
    form.appendChild(advertisements); // Remove this if you want advertisements on DuckDuckGo.
    form.appendChild(method); // Remove if you want your search queries to be tracked by your browser. (Use GET instead of POST requests)
    form.appendChild(videoPrefs); // Always shows video Preferences.
    form.appendChild(https); // Tells DuckDuckGo to only use https.
    form.appendChild(hideRef); // Hides referrers.
    form.appendChild(autoLR); // Automatically loads results as you scroll instead of using the paging system.
    form.appendChild(region); // Sets your search region.

    document.body.appendChild(form);

    form.submit();
}
