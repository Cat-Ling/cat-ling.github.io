// ==UserScript==
// @name         Search Suggestions for Cat-Ling
// @namespace    -
// @version      0.1
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
            let doRequest;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                doRequest = GM_xmlhttpRequest;
            } else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined') {
                doRequest = GM.xmlHttpRequest;
            } else {
                reject(new Error('XMLHttpRequest is not supported.'));
                return;
            }

            doRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } else {
                        reject(new Error('Failed to fetch suggestions'));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    let activeSuggestionIndex = -1;
    const urlInput = document.getElementById('urlInput');
    const suggestionsContainer = document.createElement('div');
    document.body.appendChild(suggestionsContainer);

    function displaySuggestions(suggestions) {
        if (!suggestionsContainer) {
            return;
        }

        suggestionsContainer.id = 'suggestionsContainer';
        suggestionsContainer.style.position = 'fixed';
        suggestionsContainer.style.backgroundColor = '#fff';
        suggestionsContainer.style.color = '#000';
        suggestionsContainer.style.border = '1px solid #ccc';
        suggestionsContainer.style.padding = '0px';
        suggestionsContainer.style.zIndex = '9999';
        suggestionsContainer.style.display = 'none';
        suggestionsContainer.style.maxHeight = 'fit-content';
        suggestionsContainer.style.overflowY = 'auto';
        suggestionsContainer.style.borderRadius = '20px';
        suggestionsContainer.style.width = '200px';

        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            suggestionsContainer.style.backgroundColor = '#666';
            suggestionsContainer.style.color = '#fff';
            suggestionsContainer.style.borderColor = '#888';
        }

        suggestionsContainer.innerHTML = '';
        suggestions.forEach((suggestion, index) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.textContent = suggestion.phrase;
            suggestionElement.style.cursor = 'pointer';
            suggestionElement.style.padding = '5px';
            suggestionElement.addEventListener('click', () => {
                urlInput.value = suggestion.phrase;
                document.getElementById('submitBtn').click();
            });
            suggestionElement.addEventListener('mouseover', () => {
                suggestionElement.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#888' : '#cce';
                urlInput.value = suggestion.phrase;
            });
            suggestionElement.addEventListener('mouseout', () => {
                suggestionElement.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#fff';
            });
            suggestionsContainer.appendChild(suggestionElement);
        });
        suggestionsContainer.style.display = suggestions.length ? 'block' : 'none';

        if (suggestionsContainer) {
            updateSuggestionsPosition();
        }
    }

    function setActiveSuggestion(index) {
        const suggestions = suggestionsContainer.querySelectorAll('div');
        if (index < 0 || index >= suggestions.length) {
            return;
        }

        if (activeSuggestionIndex !== -1) {
            suggestions[activeSuggestionIndex].classList.remove('active');
        }

        activeSuggestionIndex = index;
        suggestions[activeSuggestionIndex].classList.add('active');
    }

    function handleKeyboardNavigation(event) {
        const suggestions = suggestionsContainer.querySelectorAll('div');
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                setActiveSuggestion(activeSuggestionIndex - 1);
                break;
            case 'ArrowDown':
                event.preventDefault();
                setActiveSuggestion(activeSuggestionIndex + 1);
                break;
            case 'Enter':
                event.preventDefault();
                if (activeSuggestionIndex !== -1) {
                    urlInput.value = suggestions[activeSuggestionIndex].textContent;
                    document.getElementById('submitBtn').click();
                }
                break;
        }

        suggestions.forEach((suggestion, index) => {
            if (index === activeSuggestionIndex) {
                suggestion.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#888' : '#cce';
                urlInput.value = suggestion.textContent;
            } else {
                suggestion.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#fff';
            }
        });
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
        if (!event.target.closest('#suggestionsContainer') && suggestionsContainer.style.display === 'block') {
            suggestionsContainer.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
        }
    });

    function updateSuggestionsPosition() {
        suggestionsContainer.style.top = `${urlInput.offsetTop + urlInput.offsetHeight}px`;
        suggestionsContainer.style.left = `${urlInput.offsetLeft}px`;
        suggestionsContainer.style.width = `${urlInput.offsetWidth}px`;
    }

    window.addEventListener('resize', () => {
        updateSuggestionsPosition();
    });

    document.addEventListener('keydown', handleKeyboardNavigation);
})();
