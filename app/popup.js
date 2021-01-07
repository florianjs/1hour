import { getColorLevels } from '/helpers/get-color-levels.js';
import { getTimeLeft } from '/helpers/get-time-left.js';
import { displayErrorMessage } from '/helpers/displayErrorMessage.js';

let log; // Input from user
const myURLsRedirect = []; // List of websites add by user

document.querySelector('#inputVal').addEventListener('keyup', (e) => {
  updateValue(e);
  const key = e.which || e.keyCode;
  const symbol = e.key;
  if (key === 13 || symbol === 'Enter') {
    setWebsite();
  }
});

function updateValue(e) {
  log = e.target.value;
}

// When user click on "Add"
function setWebsite() {
  let error = false;
  chrome.storage.local.get(function (result) {
    if (
      typeof result['websites'] !== 'undefined' &&
      result['websites'] instanceof Array
    ) {
      // Check if website is already in list
      if (result['websites'].includes(log) === true) {
        // If already in list, display error message
        displayErrorMessage('Already in your list !');
        document.getElementById('inputVal').focus();
        error = true; // prevents closing popup
      } else {
        result['websites'].push(log);
        for (const r in result['websites']) {
          myURLsRedirect.push('*://*.' + result['websites'][r] + '/*');
        }
        updateList(result['websites']);
      }
    } else {
      result['websites'] = [log];
      updateList(result['websites']);
    }
    chrome.storage.local.set({ websites: result['websites'] });
    // Everytime we update the list, we block the elements
    chrome.webRequest.onBeforeRequest.addListener(
      function (details) {
        return {
          redirectUrl: 'https://one-hour-long.glitch.me/'
        };
      },
      {
        urls: [...myURLsRedirect],
        types: [
          'main_frame',
          'sub_frame',
          'stylesheet',
          'script',
          'image',
          'object',
          'xmlhttprequest',
          'other'
        ]
      },
      ['blocking']
    );
    if (error === false) {
      reload();
    }
  });
}

function updateList(list) {
  // Update DOM
  document.querySelectorAll('.list').forEach((e) => e.remove());
  for (var c in list) {
    let ul = document.getElementById('itemlist');
    var newElement = document.createElement('li');
    newElement.id = c;
    newElement.className = `list text-center text-lg font-light text-gray-800 cursor-pointer hover:text-red-400`;
    list[c] != ' '
      ? (newElement.innerHTML = `${list[c]} <span class='font-bold'>x</span>`)
      : '';
    ul.appendChild(newElement);
  }
}

document.getElementById('save').addEventListener('click', setWebsite);

// Create list in DOM on launch
function setListOnLaunch() {
  chrome.storage.local.get(function (result) {
    if (
      typeof result['websites'] !== 'undefined' &&
      result['websites'] instanceof Array
    ) {
      for (var c in result['websites']) {
        let ul = document.getElementById('itemlist');
        var newElement = document.createElement('li');
        newElement.id = c;
        newElement.className = `list text-center text-lg font-light text-gray-800 cursor-pointer hover:text-red-400`;
        result['websites'][c] != ' '
          ? (newElement.innerHTML =
              result['websites'][c] + " <span class='font-bold'>x</span>")
          : '';
        ul.appendChild(newElement);
      }
    }
  });
}
setListOnLaunch();

function removeFromLocal(e) {
  chrome.storage.local.get(function (result) {
    if (
      typeof result['websites'] !== 'undefined' &&
      result['websites'] instanceof Array
    ) {
      result['websites'].splice(e, 1, ' ');
      let newArray = result;
      for (r in result['websites']) {
        myURLsRedirect.splice(e, 1);
      }
      updateList(result['websites']);
    }
    result['websites'].splice(e, 1, ' ');
    chrome.storage.local.set({ websites: result['websites'] });
    // Everytime we updagte the list, we block the elements
    chrome.webRequest.onBeforeRequest.addListener(
      function (details) {
        return {
          redirectUrl: 'https://one-hour-long.glitch.me/'
        };
      },
      {
        urls: [...myURLsRedirect],
        types: [
          'main_frame',
          'sub_frame',
          'stylesheet',
          'script',
          'image',
          'object',
          'xmlhttprequest',
          'other'
        ]
      },
      ['blocking']
    );
  });
}

function reload(resetTimer = false) {
  if (resetTimer) {
    chrome.storage.local.set({ time: 0 }, () => {
      chrome.runtime.reload();
    });
  } else {
    chrome.storage.local.get((data) => {
      // Get the current timer
      const timer = data['time'];
      // On reload, set the timer back to its value instead of 0
      chrome.storage.local.set({ time: timer }, () => {
        chrome.runtime.reload();
      });
    });
  }
}

// Remove elements from list when clicked
document.getElementById('itemlist').addEventListener('click', function (e) {
  // Remove element from local storage
  removeFromLocal(e.target.id);
  var tgt = e.target;
  if (tgt.tagName.toUpperCase() == 'LI') {
    tgt.parentNode.removeChild(tgt); // or tgt.remove();
  }
  reload();
});

// Reload the extension
document.getElementById('reset').addEventListener('click', () => reload(true));

// Handle Timer

const timerCount = document.querySelector('#time-counter');
let timerCountInterval;

/*
  each time the popup is opened,
  it asks background.js to send informations
*/
chrome.runtime.sendMessage({ status: 'ready' }, (response) => {
  if (response.status === 'received')
    chrome.runtime.onMessage.addListener(handleListenMessage);
});

function updateTimerUI(timeStamp) {
  if (timeStamp === 3600) {
    clearInterval(timerCountInterval);
  }

  const colorLevels = getColorLevels(timeStamp);
  if (timerCount.classList.contains(colorLevels.delete))
    timerCount.classList.remove(colorLevels.delete);
  if (!timerCount.classList.contains(colorLevels.add))
    timerCount.classList.add(colorLevels.add);
  const timeLeft = getTimeLeft(timeStamp, 3600);
  timerCount.innerHTML = timeLeft;
}

function handleListenMessage(request) {
  if (request.counter === 'start') {
    let timeStamp = request.time;
    timerCountInterval = setInterval(() => {
      updateTimerUI(timeStamp);
      timeStamp++;
    }, 1000);
  } else if (request.counter === 'stop') {
    clearInterval(timerCountInterval);
    timerCount.innerHTML = '';
  }
}
