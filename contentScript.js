var Vigenere = require("vigenere");
var key = "my passphrase";
var activeElement;
var selection;
var hasStarted = false;
var hasEnded = false;

function searchTextNodes(n, range) {
  if (n.nodeType !== 3) {
    if (n.childNodes)
      for (var i = 0; i < n.childNodes.length; ++i)
        searchTextNodes(n.childNodes[i], range);
  } else {
    if (n === range.startContainer) {
      hasStarted = true;
      n.nodeValue =
        n.nodeValue.slice(0, range.startOffset) +
        Vigenere.encode(
          n.nodeValue.slice(range.startOffset, n.nodeValue.length),
          key
        );
    } else if (n === range.endContainer) {
      hasEnded = true;
      n.nodeValue =
        Vigenere.encode(n.nodeValue.slice(0, range.endOffset), key) +
        n.nodeValue.slice(range.endOffset, n.nodeValue.length);
    } else {
      if (hasStarted && !hasEnded) {
        n.nodeValue = Vigenere.encode(n.nodeValue, key);
      }
    }
  }
}

function encode() {
  if (activeElement.isContentEditable) {
    var range = selection.getRangeAt(0);
    hasEnded = false;
    hasStarted = false;

    if (range.startContainer === range.endContainer) {
      range.startContainer.nodeValue =
        range.startContainer.nodeValue.slice(0, range.startOffset) +
        Vigenere.encode(
          range.startContainer.nodeValue.slice(
            range.startOffset,
            range.endOffset
          ),
          key
        ) +
        range.startContainer.nodeValue.slice(
          range.endOffset,
          range.startContainer.nodeValue.length
        );
    } else {
      searchTextNodes(range.commonAncestorContainer, range);
    }
  }

  if (
    activeElement.tagName === "TEXTAREA" ||
    activeElement.tagName === "INPUT"
  ) {
    activeElement.value =
      activeElement.value.slice(0, activeElement.selectionStart) +
      Vigenere.encode(
        activeElement.value.slice(
          activeElement.selectionStart,
          activeElement.selectionEnd
        ),
        key
      ) +
      activeElement.value.slice(
        activeElement.selectionEnd,
        activeElement.value.length
      );
  }

  selection.removeAllRanges();
  selection.empty();
}

function initContentScript() {
  document.addEventListener(
    "mouseup",
    function() {
      activeElement = document.activeElement;
      selection = window.getSelection();
    },
    false
  );

  chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === "encode") {
      encode();
    }
  });
}

initContentScript();
