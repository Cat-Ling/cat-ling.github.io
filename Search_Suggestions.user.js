// ==UserScript==
// @name         Search Suggestions for Cat-Ling
// @namespace    -
// @version      0.1
// @description  Shows search suggestions fetched from the DuckDuckGo API.
// @author       Cat-Ling
// @match        https://cat-ling.github.io/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function displaySuggestions(suggestions) {
        let suggestionsContainer = document.getElementById('suggestionsContainer');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
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
            document.body.appendChild(suggestionsContainer);
        }

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
                document.getElementById('urlInput').value = suggestion.phrase;
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
        suggestionsContainer.style.display = suggestions.length ? 'block' : 'none';

        if (suggestionsContainer) {
            updateSuggestionsPosition();
        }
    }

    async function getSuggestions(query) {
        const url = `https://duckduckgo.com/ac/?kl=wt-wt&q=${query}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
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

    function setActiveSuggestion(index) {
        const suggestions = document.querySelectorAll('#suggestionsContainer > div');
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
        const suggestions = document.querySelectorAll('#suggestionsContainer > div');
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
                    const suggestionText = suggestions[activeSuggestionIndex].textContent;
                    document.getElementById('urlInput').value = suggestionText;
                    document.getElementById('submitBtn').click();
                }
                break;
        }

        suggestions.forEach((suggestion, index) => {
            if (index === activeSuggestionIndex) {
                suggestion.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#888' : '#cce';
            } else {
                suggestion.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#666' : '#fff';
            }
        });
    }

    const urlInput = document.getElementById('urlInput');

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
            document.getElementById('suggestionsContainer').style.display = 'none';
        }
    });

    document.body.addEventListener('click', (event) => {
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        if (!event.target.closest('#suggestionsContainer') && suggestionsContainer.style.display === 'block') {
            suggestionsContainer.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.getElementById('suggestionsContainer').style.display = 'none';
        }
    });

    function updateSuggestionsPosition() {
        const suggestionsContainer = document.getElementById('suggestionsContainer');

        suggestionsContainer.style.top = `${urlInput.offsetTop + urlInput.offsetHeight}px`;
        suggestionsContainer.style.left = `${urlInput.offsetLeft}px`;
        suggestionsContainer.style.width = `${urlInput.offsetWidth}px`;
    }

    window.addEventListener('resize', () => {
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        if (suggestionsContainer) {
            updateSuggestionsPosition();
        }
    });

    document.addEventListener('keydown', handleKeyboardNavigation);
})();
