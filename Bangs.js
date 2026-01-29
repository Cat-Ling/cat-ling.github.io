const BANGS = {
    // Google Services
    '!g': 'https://www.google.com/search?q=',
    '!gimg': 'https://www.google.com/search?tbm=isch&q=',
    '!gmaps': 'https://www.google.com/maps/search/',
    '!gnews': 'https://news.google.com/search?q=',
    '!gvid': 'https://www.google.com/search?tbm=vid&q=',
    '!gdrive': 'https://drive.google.com/drive/search?q=',
    '!gmail': 'https://mail.google.com/mail/u/0/#search/',
    '!gplay': 'https://play.google.com/store/search?c=apps&q=',
    '!gscholar': 'https://scholar.google.com/scholar?q=',
    '!gtranslate': 'https://translate.google.com/?text=',

    // Search Engines (Competitors & Privacy)
    '!b': 'https://www.bing.com/search?q=',
    '!ddg': 'https://duckduckgo.com/?q=',
    '!eco': 'https://www.ecosia.org/search?q=',
    '!s': 'https://www.startpage.com/do/dsearch?query=',
    '!brave': 'https://search.brave.com/search?q=',
    '!qw': 'https://www.qwant.com/?q=',
    '!yx': 'https://yandex.com/search/?text=',
    '!sc': 'https://swisscows.com/web?query=',
    '!mojeek': 'https://www.mojeek.com/search?q=',
    '!yahoo': 'https://search.yahoo.com/search?p=',

    // Video & Audio
    '!yt': 'https://www.youtube.com/results?search_query=',
    '!tw': 'https://www.twitch.tv/search?term=',
    '!nf': 'https://www.netflix.com/search?q=',
    '!sp': 'https://open.spotify.com/search/',
    '!scloud': 'https://soundcloud.com/search?q=',
    '!vimeo': 'https://vimeo.com/search?q=',
    '!hulu': 'https://www.hulu.com/search?q=',
    '!amp': 'https://music.apple.com/us/search?term=',

    // Social Media
    '!fb': 'https://www.facebook.com/search/top/?q=',
    '!ig': 'https://www.instagram.com/explore/tags/',
    '!t': 'https://twitter.com/search?q=',
    '!r': 'https://www.reddit.com/search?q=',
    '!tt': 'https://www.tiktok.com/search?q=',
    '!li': 'https://www.linkedin.com/search/results/all/?keywords=',
    '!pi': 'https://www.pinterest.com/search/pins/?q=',
    '!tm': 'https://www.tumblr.com/search/',
    '!bs': 'https://bsky.app/search?q=',
    '!th': 'https://www.threads.net/search?q=',
    '!qu': 'https://www.quora.com/search?q=',
    '!mas': 'https://mastodon.social/search?q=',

    // Development & Tech
    '!gh': 'https://github.com/search?q=',
    '!gl': 'https://gitlab.com/search?search=',
    '!bb': 'https://bitbucket.org/repo/all?name=',
    '!so': 'https://stackoverflow.com/search?q=',
    '!npm': 'https://www.npmjs.com/search?q=',
    '!pypi': 'https://pypi.org/search/?q=',
    '!dn': 'https://hub.docker.com/search?q=',
    '!mdn': 'https://developer.mozilla.org/search?q=',
    '!caniuse': 'https://caniuse.com/?search=',
    '!arch': 'https://wiki.archlinux.org/index.php?search=',
    '!gentoo': 'https://wiki.gentoo.org/index.php?search=',

    // Knowledge & Reference
    '!w': 'https://en.wikipedia.org/wiki/Special:Search?search=',
    '!wa': 'https://www.wolframalpha.com/input/?i=',
    '!urb': 'https://www.urbandictionary.com/define.php?term=',
    '!dict': 'https://www.dictionary.com/browse/',
    '!thes': 'https://www.thesaurus.com/browse/',
    '!imdb': 'https://www.imdb.com/find?q=',
    '!rt': 'https://www.rottentomatoes.com/search?search=',
    '!mal': 'https://myanimelist.net/search/all?q=',
    '!ani': 'https://anilist.co/search/anime?search=',
    '!genius': 'https://genius.com/search?q=',

    // Shopping
    '!a': 'https://www.amazon.com/s?k=',
    '!eb': 'https://www.ebay.com/sch/i.html?_nkw=',
    '!ali': 'https://www.aliexpress.com/wholesale?SearchText=',
    '!wmt': 'https://www.walmart.com/search?q=',
    '!tg': 'https://www.target.com/s?searchTerm=',
    '!etsy': 'https://www.etsy.com/search?q=',
    '!ikea': 'https://www.ikea.com/us/en/search/products/?q=',
    '!ne': 'https://www.newegg.com/p/pl?d=',
    '!steam': 'https://store.steampowered.com/search/?term=',

    // Microsoft / Other
    '!ms': 'https://www.microsoft.com/en-us/search/explore?q=',
    '!od': 'https://onedrive.live.com/search?q=',
};

function handleBang(query) {
    const parts = query.trim().split(/\s+/);
    if (parts.length > 0) {
        const firstPart = parts[0].toLowerCase();
        if (BANGS[firstPart]) {
            const searchTerm = parts.slice(1).join(' ');
            if (searchTerm) {
                window.location.href = BANGS[firstPart] + encodeURIComponent(searchTerm);
                return true;
            } else {
                // If only the bang is typed, go to the site's home or search root
                window.location.href = BANGS[firstPart].split('?')[0].split('/search')[0];
                return true;
            }
        }
    }
    return false;
}

(function () {
    const urlInput = document.getElementById('urlInput');

    function getSuggestionsContainer() {
        let container = document.getElementById('suggestionsContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'suggestionsContainer';
            document.body.appendChild(container);
        }
        return container;
    }

    function getDomain(url) {
        try {
            return new URL(url).hostname.replace(/^www\./, '');
        } catch (e) {
            return 'External Link';
        }
    }

    function showBangSuggestions(query) {
        const container = getSuggestionsContainer();
        const prefix = query.toLowerCase().split(' ')[0];

        // Filter bangs that start with the query
        const matches = Object.entries(BANGS).filter(([bang, url]) =>
            bang.startsWith(prefix)
        );

        container.innerHTML = '';

        if (matches.length === 0) {
            container.style.display = 'none';
            return;
        }

        matches.slice(0, 10).forEach(([bang, url]) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';

            const keySpan = document.createElement('span');
            keySpan.textContent = bang;
            keySpan.style.fontWeight = 'bold';

            const descSpan = document.createElement('span');
            descSpan.textContent = getDomain(url);
            descSpan.style.opacity = '0.7';

            item.appendChild(keySpan);
            item.appendChild(descSpan);

            item.addEventListener('click', () => {
                urlInput.value = bang + ' ';
                urlInput.focus();
                container.style.display = 'none';
            });

            container.appendChild(item);
        });

        container.style.display = 'block';
        updatePosition(container);
    }

    function updatePosition(container) {
        const rect = urlInput.getBoundingClientRect();
        container.style.top = `${rect.bottom + window.scrollY}px`;
        container.style.left = `${rect.left + window.scrollX}px`;
        container.style.width = `${rect.width}px`;
    }

    urlInput.addEventListener('input', () => {
        const val = urlInput.value.trim();
        if (val.startsWith('!')) {
            showBangSuggestions(val);
        } else if (val === '') {
            const container = document.getElementById('suggestionsContainer');
            if (container) container.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        const container = document.getElementById('suggestionsContainer');
        if (container && !container.contains(e.target) && e.target !== urlInput) {
            container.style.display = 'none';
        }
    });

})();
