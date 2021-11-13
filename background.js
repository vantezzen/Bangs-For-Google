let bangs = [];

// Get current list of Bangs from DuckDuckGo
(async () => {
  const res = await fetch("https://duckduckgo.com/bang.js");
  bangs = await res.json();
})();

chrome.webRequest.onBeforeRequest.addListener(
  ({ url }) => {
    // Get search query from URL
    const urlObj = new URL(url);
    const query = urlObj.searchParams.get("q");
    const searchTerms = query.split(" ");

    // Check if searching for a bang
    if (
      (searchTerms && searchTerms[0].startsWith("!")) ||
      searchTerms[searchTerms.length - 1].startsWith("!")
    ) {
      // Redirect to DuckDuckGo
      return {
        redirectUrl: `https://www.duckduckgo.com/?q=${encodeURIComponent(
          query
        )}`,
      };
    }
  },
  {
    urls: [
      "http://www.google.com/search*",
      "http://www.google.co.jp/search*",
      "http://www.google.co.uk/search*",
      "http://www.google.es/search*",
      "http://www.google.ca/search*",
      "http://www.google.de/search*",
      "http://www.google.it/search*",
      "http://www.google.fr/search*",
      "http://www.google.com.au/search*",
      "http://www.google.com.tw/search*",
      "http://www.google.nl/search*",
      "http://www.google.com.br/search*",
      "http://www.google.com.tr/search*",
      "http://www.google.be/search*",
      "http://www.google.com.gr/search*",
      "http://www.google.co.in/search*",
      "http://www.google.com.mx/search*",
      "http://www.google.dk/search*",
      "http://www.google.com.ar/search*",
      "http://www.google.ch/search*",
      "http://www.google.cl/search*",
      "http://www.google.at/search*",
      "http://www.google.co.kr/search*",
      "http://www.google.ie/search*",
      "http://www.google.com.co/search*",
      "http://www.google.pl/search*",
      "http://www.google.pt/search*",
      "http://www.google.com.pk/search*",
      "https://www.google.com/search*",
      "https://www.google.co.jp/search*",
      "https://www.google.co.uk/search*",
      "https://www.google.es/search*",
      "https://www.google.ca/search*",
      "https://www.google.de/search*",
      "https://www.google.it/search*",
      "https://www.google.fr/search*",
      "https://www.google.com.au/search*",
      "https://www.google.com.tw/search*",
      "https://www.google.nl/search*",
      "https://www.google.com.br/search*",
      "https://www.google.com.tr/search*",
      "https://www.google.be/search*",
      "https://www.google.com.gr/search*",
      "https://www.google.co.in/search*",
      "https://www.google.com.mx/search*",
      "https://www.google.dk/search*",
      "https://www.google.com.ar/search*",
      "https://www.google.ch/search*",
      "https://www.google.cl/search*",
      "https://www.google.at/search*",
      "https://www.google.co.kr/search*",
      "https://www.google.ie/search*",
      "https://www.google.com.co/search*",
      "https://www.google.pl/search*",
      "https://www.google.pt/search*",
      "https://www.google.com.pk/search*",
    ],
  },
  [
    "blocking", // Needed so we can redirect the request to DuckDuckGo - we aren't really blocking anything
  ]
);

// Omnibox Auto-Complete
chrome.omnibox.onInputChanged.addListener((text, addSuggestions) => {
  let filterText = text.trim();
  if (filterText.indexOf("!") === 0) {
    filterText = filterText.substr(1);
  }

  chrome.omnibox.setDefaultSuggestion({
    description: "Use Bang",
  });

  let results = [];

  for (let bang of bangs) {
    if (
      bang.t.startsWith(filterText) ||
      bang.s.includes(filterText) ||
      bang.d.includes(filterText)
    ) {
      // Shorter Bang => More relevant
      let lengthRelevance = 10 - bang.t.length;
      if (lengthRelevance > 0) {
        lengthRelevance = 0;
      }

      // Relevance based on the type of match
      let typeRelevance = 0;
      if (bang.t === filterText) {
        // Exact match - set as default suggestion
        chrome.omnibox.setDefaultSuggestion({
          description: `!${bang.t} (${bang.s})`,
        });
        continue;
      } else if (bang.t.startsWith(filterText)) {
        typeRelevance = 100;
      } else if (bang.s.includes(filterText)) {
        typeRelevance = 2;
      }

      const relevance = lengthRelevance + typeRelevance + bang.r;

      results.push({
        content: bang.t,
        description: `!${bang.t} (${bang.s}), Rel: ${relevance}`,
        relevance,
      });
    }
  }

  // Sort based on relevance
  results = results
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10)
    .map((item) => {
      return {
        content: item.content,
        description: item.description,
      };
    });

  addSuggestions(results);
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  let bang = text.trim();
  if (bang.indexOf("!") === 0) {
    bang = bang.substr(1);
  }

  const url = `https://www.duckduckgo.com/?q=${encodeURIComponent(`!${bang}`)}`;

  switch (disposition) {
    case "currentTab":
      chrome.tabs.update({ url });
      break;
    case "newForegroundTab":
      chrome.tabs.create({ url });
      break;
    case "newBackgroundTab":
      chrome.tabs.create({ url, active: false });
      break;
  }
});
