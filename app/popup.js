let log; // Input from user
const myURLsRedirect = []; // List of websites add by user

document.querySelector('#inputVal').addEventListener('keyup', updateValue);

function updateValue(e) {
  log = e.target.value;
}

// When user click on "Add"
function setWebsite() {
  chrome.storage.local.get(function (result) {
    if (
      typeof result['websites'] !== 'undefined' &&
      result['websites'] instanceof Array
    ) {
      result['websites'].push(log);
      for (r in result['websites']) {
        myURLsRedirect.push('*://*.' + result['websites'][r] + '/*');
      }
      updateList(result['websites']);
    } else {
      result['websites'] = [log];
      updateList(result['websites']);
    }
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

function reload() {
  chrome.storage.local.set({ time: 0 }, () => {
    chrome.runtime.reload();
  });
}

// Remove elements from list when clicked
document.getElementById('itemlist').addEventListener('click', function (e) {
  // Remove element from local storage
  removeFromLocal(e.target.id);
  var tgt = e.target;
  if (tgt.tagName.toUpperCase() == 'LI') {
    tgt.parentNode.removeChild(tgt); // or tgt.remove();
  }
});

// Reload the extension
document.getElementById('reload').addEventListener('click', reload);
