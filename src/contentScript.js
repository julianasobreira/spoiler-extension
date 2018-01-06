/******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        /******/ configurable: false,
        /******/ enumerable: true,
        /******/ get: getter
        /******/
      });
      /******/
    }
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module["default"];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 0));
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {
      var Vigenere = __webpack_require__(1);
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

      /***/
    },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
      var encode = __webpack_require__(2),
        decode = __webpack_require__(3);

      module.exports = {
        encode: encode,
        decode: decode
      };

      /***/
    },
    /* 2 */
    /***/ function(module, exports) {
      module.exports = function(message, codeword) {
        var abc = "abcdefghijklmnopqrstuvwxyz",
          result = "",
          cipher,
          x,
          y;

        if (!message || !codeword) {
          return null;
        }

        for (var i = 0; i < message.length; i++) {
          if (abc.indexOf(message[i]) === -1) {
            result += message[i];
          } else {
            cipher = codeword[i % codeword.length];
            x = abc.indexOf(cipher);
            y = abc.indexOf(message[i]);
            result += abc[(x + y) % abc.length];
          }
        }

        return result;
      };

      /***/
    },
    /* 3 */
    /***/ function(module, exports) {
      module.exports = function(message, codeword) {
        var abc = "abcdefghijklmnopqrstuvwxyz",
          result = "",
          cipher,
          x,
          y;

        if (!message || !codeword) {
          return null;
        }

        for (var i = 0; i < message.length; i++) {
          if (abc.indexOf(message[i]) === -1) {
            result += message[i];
          } else {
            cipher = codeword[i % codeword.length];
            x = abc.indexOf(cipher);
            y = abc.indexOf(message[i]);
            result += abc[(y - x + abc.length) % abc.length];
          }
        }

        return result;
      };

      /***/
    }
    /******/
  ]
);
