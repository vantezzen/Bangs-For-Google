let bangs = [];

// Get current list of Bangs from DuckDuckGo
(async () => {
  const res = await fetch("https://duckduckgo.com/bang.js");
  bangs = await res.json();
})();

// Omnibox Auto-Complete
chrome.omnibox.onInputChanged.addListener((text, addSuggestions) => {
  let filterText = text.trim();
  if (filterText.indexOf("!") === 0) {
      filterText = filterText.substr(1)
  }

  chrome.omnibox.setDefaultSuggestion({
    description: 'Use Bang'
  });

  let results = [];

  for (let bang of bangs) {
    if (
      bang.t.startsWith(filterText) ||
      bang.s.includes(filterText) ||
      bang.d.includes(filterText)
    ) {
      // Shorter Bang => More relevant
      let lengthRelevance = (10 - bang.t.length);
      if (lengthRelevance > 0){
        lengthRelevance = 0;
      }

      // Relevance based on the type of match
      let typeRelevance = 0;
      if (bang.t === filterText) {
        // Exact match - set as default suggestion
        chrome.omnibox.setDefaultSuggestion({
          description: `!${bang.t} (${bang.s})`
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
  results = results.sort((a, b) => b.relevance - a.relevance).slice(0, 10).map((item) => {
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
      bang = bang.substr(1)
  }

  const url = `https://www.duckduckgo.com/?q=${encodeURIComponent(`!${bang}`)}`;

  switch (disposition) {
    case "currentTab":
      chrome.tabs.update({url});
      break;
    case "newForegroundTab":
      chrome.tabs.create({url});
      break;
    case "newBackgroundTab":
      chrome.tabs.create({url, active: false});
      break;
  }
});