// ==UserScript==
// @name         Search Suggestions for Cat-Ling
// @namespace    -
// @version      0.2
// @description  Shows search suggestions fetched from the DuckDuckGo API.
// @author       Cat-Ling
// @match        https://cat-ling.github.io/*
// @updateURL    https://cdn.jsdelivr.net/gh/Cat-Ling/cat-ling.github.io@master/Search_Suggestions.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/Cat-Ling/cat-ling.github.io@master/Search_Suggestions.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-idle
// ==/UserScript==

(function() {
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
    suggestionsContainer.style.position = 'absolute';
    suggestionsContainer.style.backgroundColor = '#fff';
    suggestionsContainer.style.color = '#000';
    suggestionsContainer.style.border = '1px solid #ccc';
    suggestionsContainer.style.borderRadius = '5px';
    suggestionsContainer.style.zIndex = '9999';
    suggestionsContainer.style.maxHeight = '200px';
    suggestionsContainer.style.overflowY = 'auto';
    suggestionsContainer.style.display = 'none';
    suggestionsContainer.style.width = `${urlInput.offsetWidth}px`;

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        suggestionsContainer.style.backgroundColor = '#666';
        suggestionsContainer.style.color = '#fff';
        suggestionsContainer.style.borderColor = '#888';
    }

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
            suggestionElement.style.padding = '5px';
            suggestionElement.style.cursor = 'pointer';

            suggestionElement.addEventListener('click', () => {
                urlInput.value = phrase;
                document.getElementById('submitBtn').click();
            });

            suggestionElement.addEventListener('mouseover', () => {
                suggestionElement.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#888' : '#cce';
            });

            suggestionElement.addEventListener('mouseout', () => {
                suggestionElement.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#fff';
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
})();
