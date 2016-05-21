



function Index(){
  'use strict';
  var _this = this;

  this.jsonDocument = { jsonfile:[] };

  this.emptyDatasource = { isEmpty: true };

  this.indexCreated = { isCreated: false };

  this.documentLength = 0;

  this.indexArray = [];

  this.indexObject = { strings:[] };

  this.getHostAddress = function () {
      return location.protocol.concat('//').concat(location.host);
    };

  this.file = function (fileName) {
    return fileName;
  };

  this.getIndex = function (key) {
    if(key !== undefined){
    // initiateRequest(key);
      return this.indexObject.strings[key];
    }
    return this.indexObject.strings;
  };

  this.searchIndex = function (word) {
    return isValidData(word)?
    getIndexPosition(replaceNonWord(word), this.indexObject.strings) : '';
  };

  this.lowerCaseTransform = function (text) {
    return lowerCase(text);
  };

  this.createIndex = function (filepath) {
    return isValidData(filepath)? initiateRequest(filepath) : '';
  };

  /**
   * @param  {String} The file path
   * calls request listener on request
   * calls send request
   * @return {void}
   */
  function initiateRequest(filepath) {
    try {
      var asyncRequest = new XMLHttpRequest();
      addRequestListener(asyncRequest);
      sendRequest(filepath, asyncRequest);
    } catch (exception) {
      console.log(exception);
    }
  }

  /**
   * @param  {Object} The request object
   * sets on readystatechange listener and registers callback
   * @return {void}
   */
  function addRequestListener(asyncRequest) {
  // adds readystatechange listener, callback
    asyncRequest.addEventListener('readystatechange',
      function () {
        callBack(asyncRequest);
      }, true);
  }

  /**
   * @param  {String} The file path
   * @param  {Object} the request object
   * Sends a get request and sets a calback function on request's response
   * sets asynchronous to true
   * sets request header and sends request
   * @return {void}
   */
  function sendRequest(filepath, asyncRequest) {
    asyncRequest.open('GET', filepath, true);
    asyncRequest.setRequestHeader('Accept', 'application/json; charset=utf-8');
    asyncRequest.send();
  }

  function callBack(asyncRequest) {
    if (asyncRequest.readyState === 4 && asyncRequest.status === 200) {
      var jsonData = JSON.parse(asyncRequest.responseText);
      saveJsonFile(jsonData);
      saveDocumentLength(jsonData);
      processAsyncResponse(jsonData);
    }
  }

  function saveJsonFile(jsonData) {
    _this.jsonDocument.jsonfile.push(jsonData);
  }

  function saveDocumentLength( jsonData) {
    _this.documentLength += jsonData.length;
  }

  /**
   * @param  {Object} books.json object
   * sets empty data source flag to false
   * processes data recieved
   * sets create Index true
   * creates Index and assings it to object
   * @return {void}
   */
  function processAsyncResponse(jsonData) {
    if (jsonData.length >= 0 && jsonData !== []) {
      _this.emptyDatasource.isEmpty = false;
      processAsyncData(jsonData);
      isIndexcreated();
      _this.indexObject.strings = createIndex(_this.indexArray);
    }
  }

  /**
   * @param  {Object} books.json object
   * populates the unique elements from jsonData and sorts them
   * elimanates duplicate words and replaces non words
   * re-initialises unique elements to sorted and unique words
   *
   * @return {void}
   */
  function processAsyncData(jsonData) {
  // loop through jsonobject
  // sorts,replace none words, and duplicate words
  // then assigns  to array
    for (var value in jsonData) {
      _this.indexArray
      .push(jsonData[value]
      .title
      .concat(' ')
      .concat(jsonData[value]
      .text)
      .toLowerCase().split(' ').sort());
      _this.indexArray[_this.indexArray.length - 1] =
      eliminateDupicateWords(replaceNonWord(_this
      .indexArray[_this.indexArray.length - 1] ));
    }
  }

  // sets iscreated to true
  function isIndexcreated() {
    if (_this.indexArray.length > 0) {
      _this.indexCreated.isCreated = true;
    }
  }

  /**
   * @param  {Array} The unique elements
   * loops through all elements and gets the document location from the index
   * @return {Object} the Indexed object
   */
  function createIndex(value) {
    var indexedObject = {};
    for (var index in value) {
      for (var indexin in value[index]) {
        if (indexedObject[value[index][indexin]] !== undefined ) {
            // if word found again push index to the former
            indexedObject[value[index][indexin]].push(parseInt(index));
          }
        else {
            //if word is found once just initialise to the index
          indexedObject[value[index][indexin]] = [parseInt(index)];
        }
      }
    }
    return indexedObject;
  }

  function lowerCase(text) {
    return text.toLowerCase();
  }

  function replaceNonWord(value) {
    return value.toString().replace(/\W+/g, ' ').toString();
  }

  /**
   * @param  {Array} The unique array to be worked on
   * calls a function which checks for duplicate words
   * @return {Array} The full unique array
   */
  function eliminateDupicateWords(value) {
    var seperateWords = value.split(' ');
    var uniqueWords = [];
    return eliminateDuplicatewordsloop(seperateWords, uniqueWords);
  }

  /**
   * @param  {String} The words in the array
   * @param  {Array}  The unique words in the array
   * Checks if a word exist in the unique arrray
   * If it exists it skips it or else pushes it
   *  @return {Array} the unique words
   */
  function eliminateDuplicatewordsloop(seperateWords, uniqueWords) {
    for (var index = 0; index < seperateWords.length; index++) {
      // if word has been put in array, continue (do not add)
      if (uniqueWords.includes(seperateWords[index])) {
        continue;
      }
      uniqueWords.push(seperateWords[index]);
    }
    return uniqueWords;
  }

  /**
   * @param  {String} The word to search
   * @param  {Object}  The object with Indexing
   * manipulates search word to return the document found
   *  @return {Array} the index o
   */
  function getIndexPosition(key, indexobject) {
    // checks if it a single word and return its position
    if ((typeof key === 'string') && key.indexOf(' ') === -1) {
      return indexobject[key.toLowerCase()];
    }
  // splits words into one word and passes it recrsively to the method above
    var tokens = key.split(' ');
    if((typeof key === 'string') && key.indexOf(' ') !== -1) {
      var searcharray = [];
      for(var word = 0; word < tokens.length; word++){
        // pushes the returned position to an array
        searcharray.push(getIndexPosition(tokens[word], indexobject));
      }
      // returns the final array with elements
      return searcharray;
    }
  }

  // validates a data is truthy
  function isValidData(data) {
    return ( data.length   && data !== undefined && data !== null &&
      data !== isNaN )? true:false ;
  }

}
