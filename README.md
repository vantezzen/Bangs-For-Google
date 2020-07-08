<p align="center">
    <img src="icons/icon-500.png" height="300"><br />
    <a href="https://addons.mozilla.org/en-US/firefox/addon/bangs-for-google/">
        <img src="icons/firefox.png" alt="Availible on Firefox Add-Ons" width="150">
    </a>
    <a href="https://chrome.google.com/webstore/detail/bangs-for-google/emidbfgmfdphfdldbmehojiocmljfonj">
        <img src="icons/chrome.png" alt="Availible on chrome web store" width="150">
    </a>
</p>

# Bangs for Google

Automatically use DuckDuckGo for [Bangs](https://duckduckgo.com/bang), keeping Google for all other searches.

## Installation
"Quick Copy URL" is availible through the [Firefox Add-On Platform](https://addons.mozilla.org/en-US/firefox/addon/bangs-for-google/) and [chrome web store](https://chrome.google.com/webstore/detail/bangs-for-google/emidbfgmfdphfdldbmehojiocmljfonj).

## How does it work? How is the performance?

"Bangs for Google" uses the `webRequest` API, commonly also used in AdBlockers, to catch your Google Search queries before Google even loads. Due to this, the redirects to DuckDuckGo will happen very quickly.

The extension simply checks if you are currently on Google and your search query begins with a "!" - if so, it will redirect you to DuckDuckGo using the same search query.

## Contributing
Please fork this repository and create a new pull request to contribute to it.

If you notice any errors, please create a new issue on GitHub.

# License
The extension is licensed under the MIT License.