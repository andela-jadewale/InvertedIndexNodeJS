function Index(){
  'use strict';
  var _this = this;
  this.jsonDocument = { jsonFile:[] };
  this.emptyDatasource = { isEmpty: true };
  this.indexCreated = { isCreated: false };
  this.documentLength = 0;
  this.indexArray = [];
  this.indexObject = { data:[] };

  this.getHostAddress = function () {
    return location.protocol + '//' + location.host;
    };

  this.file = function (fileName) {
    return fileName;
  };

  this.getIndex = function (key) {
    if(key !== undefined){
    // initiateRequest(key);
      return this.indexObject.data[key];
    }

    return this.indexObject.data;
  };

  this.searchIndex = function (word) {
    return isValidData(word)?
    getIndexPosition(replaceNonWord(word), this.indexObject.data) : '';
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
    _this.jsonDocument.jsonFile.push(jsonData);
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
      isIndexCreated();
      _this.indexObject.data = createIndex(_this.indexArray);
    }
  }

  /**
   * @param  {Object} books.json object
   * populates the unique elements from jsonData and sorts them
   * elimanates duplicate words and replaces non words
   * re-initialises unique elements to sorted and unique words
   * @return {void}
   */
  function processAsyncData(jsonData) {
    jsonData.forEach(function(value) {
      var sorted = transformAsyncData(value.title+' '+value.text);
      var uniqueWords = eliminateDuplicateWords(replaceNonWord(sorted));
      _this.indexArray.push(uniqueWords);
    });

  }

  function transformAsyncData(data){
    return lowerCase(data).split(' ').sort();
  }

  // sets iscreated to true
  function isIndexCreated() {
    if (_this.indexArray.length > 0) {
      _this.indexCreated.isCreated = true;
    }
  }

  /**
   * @param  {Array} The unique elements
   * loops through all elements and gets the document location from the index
   * @return {Object} the Indexed object
   */
  function createIndex(document) {
    var indexedObject = {};
    document.forEach(function (docData,docIndex){
     docData.filter(function (words){
       (indexedObject[words] !== undefined)? indexedObject[words].push(docIndex)
        : indexedObject[words] = [docIndex];
     });
    });

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
  function eliminateDuplicateWords(value) {
    var seperateWords = value.split(' ');
    var uniqueWords = [];

    return processWords(seperateWords, uniqueWords);
  }

  /**
   * @param  {String} The words in the array
   * @param  {Array}  The unique words in the array
   * Checks if a word exist in the unique arrray
   * If it exists it skips it or else pushes it
   *  @return {Array} the unique words
   */
  function processWords(seperateWords, uniqueWords) {
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
      var searchArray = [];
      for(var word = 0; word < tokens.length; word++){
        // pushes the returned position to an array
        searchArray.push(getIndexPosition(tokens[word], indexobject));
      }
      // returns the final array with elements
      return searchArray;
    }
  }

  // validates a data is truthy
  function isValidData(data) {
    return ( ['',undefined,null,isNaN].indexOf(data) === -1)? true:false ;
  }

}
