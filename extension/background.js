var ENABLE = false;

var onHeadersReceived = function (details) {
  if (!ENABLE) {
    return;
  }
  for (var i = 0; i < details.responseHeaders.length; i++) {
    if ('content-security-policy' === details.responseHeaders[i].name.toLowerCase()) {
      details.responseHeaders[i].value = '';
    }
  }

  return {
    responseHeaders: details.responseHeaders
  };
};

var updateUI = function () {
  var iconName = ENABLE ? 'on' : 'off';
  var title = ENABLE ? 'disabled' : 'enabled';

  chrome.browserAction.setIcon({ path: "images/icon38-" + iconName + ".png" });
  chrome.browserAction.setTitle({ title: 'Content-Security-Policy headers are ' + title });
};

var filter = {
  urls: ["*://*/*"],
  types: ["main_frame", "sub_frame"]
};

chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, ["blocking", "responseHeaders"]);

chrome.browserAction.onClicked.addListener(function () {
  ENABLE = !ENABLE;

  if (ENABLE) {
    chrome.browsingData.remove({}, {"serviceWorkers": true}, function () {});
  }

  updateUI()
});

updateUI();
