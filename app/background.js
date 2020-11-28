let time = 0;
let interval;
// myURLs contains the websites where you want your content script to run
const myURLs = [];
const myURLsRedirect = [];

// GET Local Storage and update myURLs & myURLsRedirect
// myURLs from google.com to google.com & www.google.com
// myURLsRedirect from google.com to *://*.google.com/* & *://*.www.google.com/*
chrome.storage.local.get(function (result) {
  if (
    typeof result["websites"] !== "undefined" &&
    result["websites"] instanceof Array
  ) {
    for (r in result["websites"]) {
      myURLs.push("www." + result["websites"][r]);
      myURLs.push(result["websites"][r]);
      myURLsRedirect.push("*://*." + result["websites"][r] + "/*");
    }

    console.log(myURLs);
    // Redirect websites
    chrome.webRequest.onBeforeRequest.addListener(
      function (details) {
        if (time > 3600) {
          return {
            redirectUrl: "https://one-hour-long.glitch.me/"
          };
        }
      },
      {
        urls: [...myURLsRedirect],
        types: [
          "main_frame",
          "sub_frame",
          "stylesheet",
          "script",
          "image",
          "object",
          "xmlhttprequest",
          "other"
        ]
      },
      ["blocking"]
    );
  } else {
    myURLs = ["tailwindcss.com", "www.google.com"];
    myURLsRedirect = ["*://*.tailwindcss.com/*", "*://*.google.com/*"];
  }
});

// Background script
var tabToUrl = {};
let currentlyCounting = false;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status == "complete" &&
    myURLs.some((url) => tab.url.includes(url)) &&
    currentlyCounting == false
  ) {
    currentlyCounting = true;
    tabToUrl[tabId] = tab.url;
    interval = setInterval(() => {
      time++;
    }, 1000);
  }
  if (
    changeInfo.status == "complete" &&
    myURLs.some((url) => tab.url.includes(url)) &&
    currentlyCounting == true
  ) {
    tabToUrl[tabId] = tab.url;
  }
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  if (tabToUrl[tabId] === undefined) return;
  if (myURLs.some((url) => tabToUrl[tabId].includes(url))) {
    currentlyCounting = false;
  }

  // Remove information for non-existent tab
  delete tabToUrl[tabId];

  if (Object.entries(tabToUrl).length === 0) {
    clearInterval(interval);
  }
});
