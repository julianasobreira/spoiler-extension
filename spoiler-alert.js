console.log('spoiler-alert')


function getText(range) {
  var hasStarted = false;
  var hasEnded = false;
  function recursor(n) {
    if (n.nodeType !== 3) {
      if (n.childNodes)
        for (var i = 0; i < n.childNodes.length; ++i)
          recursor(n.childNodes[i]);
    } else {
      if(n === range.startContainer) {
        hasStarted = true;
        n.nodeValue = n.nodeValue.slice(0, range.startOffset) + 
                      n.nodeValue.slice(range.startOffset, n.nodeValue.length).toUpperCase();
      } else if(n === range.endContainer) {
        hasEnded = true;
        n.nodeValue = n.nodeValue.slice(0, range.endOffset).toUpperCase() + 
                      n.nodeValue.slice(range.endOffset, n.nodeValue.length);
      } else {
        if(hasStarted && !hasEnded) {
          n.nodeValue = n.nodeValue.toUpperCase();
        } 
      }
    }
  }

  if (range.startContainer === range.endContainer) {
    range.startContainer.nodeValue = range.startContainer.nodeValue.slice(0, range.startOffset) + 
                                     range.startContainer.nodeValue.slice(range.startOffset, range.endOffset).toUpperCase() + 
                                     range.startContainer.nodeValue.slice(range.endOffset, range.startContainer.nodeValue.length);
  } else {
    recursor(range.commonAncestorContainer);
  }
}

function replaceTxt () {
  var activeElement = document.activeElement;
  var selection = window.getSelection();
  if (selection.toString() != '') {
    if (activeElement.isContentEditable) {
      var range = selection.getRangeAt(0);
      getText(range);
    }

    if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
      activeElement.value = activeElement.value.slice(0, activeElement.selectionStart) + 
                            activeElement.value.slice(activeElement.selectionStart, activeElement.selectionEnd).toUpperCase() + 
                            activeElement.value.slice(activeElement.selectionEnd, activeElement.value.length);
    }

    selection.removeAllRanges();
    selection.empty();
    clearInterval(interval);
  }
}

replaceTxt();
var interval = setInterval(replaceTxt, 3000);