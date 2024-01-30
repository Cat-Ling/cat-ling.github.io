async function getSuggestions(query) {
    const url = `https://duckduckgo.com/ac/?kl=wt-wt&q=${query}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch suggestions');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    urlInput.addEventListener('input', async () => {
        const query = urlInput.value.trim();
        if (query) {
            const suggestions = await getSuggestions(query);
            displaySuggestions(suggestions);
        } else {
            clearSuggestions();
        }
    });

    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';
        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.textContent = suggestion.phrase;
            suggestionsContainer.appendChild(suggestionElement);
        });
    }

    function clearSuggestions() {
        suggestionsContainer.innerHTML = '';
    }
});
