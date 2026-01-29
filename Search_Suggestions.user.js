// ==UserScript==
// @name         Search Suggestions for Cat-Ling
// @namespace    -
// @version      0.3
// @description  Shows search suggestions fetched from the DuckDuckGo API.
// @author       Cat-Ling
// @match        https://cat-ling.github.io/*
// @updateURL    https://cdn.jsdelivr.net/gh/Cat-Ling/cat-ling.github.io@master/Search_Suggestions.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/Cat-Ling/cat-ling.github.io@master/Search_Suggestions.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    async function getSuggestions(query) {
        const url = `https://duckduckgo.com/ac/?kl=wt-wt&q=${query}`;
        return new Promise((resolve, reject) => {
            const doRequest = typeof GM_xmlhttpRequest !== 'undefined'
                ? GM_xmlhttpRequest
                : GM?.xmlHttpRequest;

            if (!doRequest) {
                reject(new Error('XMLHttpRequest is not supported.'));
                return;
            }

            doRequest({
                method: 'GET',
                url,
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error('Failed to fetch suggestions'));
                    }
                },
                onerror: reject
            });
        });
    }

    const urlInput = document.getElementById('urlInput');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'suggestionsContainer';
    document.body.appendChild(suggestionsContainer);

    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';
        if (!suggestions.length) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestions.forEach(({ phrase }) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.textContent = phrase;
            suggestionElement.className = 'suggestion-item';

            suggestionElement.addEventListener('click', () => {
                urlInput.value = phrase;
                document.getElementById('submitBtn').click();
            });

            suggestionsContainer.appendChild(suggestionElement);
        });

        suggestionsContainer.style.display = 'block';
        updateSuggestionsPosition();
    }

    function updateSuggestionsPosition() {
        const rect = urlInput.getBoundingClientRect();
        suggestionsContainer.style.top = `${rect.bottom + window.scrollY}px`;
        suggestionsContainer.style.left = `${rect.left + window.scrollX}px`;
        suggestionsContainer.style.width = `${rect.width}px`;
    }

    urlInput.addEventListener('input', async () => {
        const query = urlInput.value.trim();
        // Ignore bang queries (handled by Bangs.js)
        if (query.startsWith('!')) return;

        if (query) {
            try {
                const suggestions = await getSuggestions(query);
                displaySuggestions(suggestions);
            } catch (error) {
                console.error(error);
            }
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    document.body.addEventListener('click', (event) => {
        if (!event.target.closest('#suggestionsContainer')) {
            suggestionsContainer.style.display = 'none';
        }
    });

    window.addEventListener('resize', updateSuggestionsPosition);

    // Hide the installation link since the script is active
    const userscriptLink = document.getElementById('userscript-link');
    if (userscriptLink) {
        userscriptLink.style.display = 'none';
    }
})();
