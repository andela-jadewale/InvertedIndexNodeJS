function Index(){
  'use strict';
  var _this = this;
  this.jsonDocument = { jsonFile: [] };
  this.emptyDatasource = { isEmpty: true };
  this.indexCreated = { isCreated: false };
  this.documentLength = 0;
  this.indexArray = [];
  this.indexObject = { data: [] };

  /**
   * gets host address
   * @return {String} returns host address
   */
  this.getHostAddress = function () {
    return location.protocol + '//' + location.host;
  };

  /**
   * sets filename to retrieve document
   * @param  {String} fileName name of json file
   * @return {String}  returns fileName
   */
  this.file = function (fileName) {
    return fileName;
  };

  /**
   * gets the document located of searchword
   * @param  {String} key search word
   * @return {Array}  an array of documents located
   */
  this.getIndex = function (key) {
    if(key !== undefined) {
      // initiateRequest(key);
      return this.indexObject.data[key];
    }

    return this.indexObject.data;
  };

  /**
   * searchs object for a word and returns the document located
   * @param  {String} word search word
   * @return {Array}    an array of documents located
   */
  this.searchIndex = function (word) {
    return isValidData(word)?
    getIndexPosition(replaceNonWord(word), this.indexObject.data) : '';
  };

  this.lowerCaseTransform = function (text) {
    return lowerCase(text);
  };

  /**
   * reads json file and saves words with document location in an object
   * @param  {String} filepath a path to locate json file
   * @return {Void}
   */
  this.createIndex = function (filepath, file) {
    if(!file)
    isValidData(filepath)? initiateRequest(filepath) : '';
    else {
      callBack(true, file);
    }
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

  /**
   * @param  {Object} The request object
   * gets the response text
   * saves response to an object
   * increases document length
   * maps the response text to their documents
   * @return {void}
   */
  function callBack(asyncRequest) {
    if (asyncRequest.readyState === 4 && asyncRequest.status === 200) {
      var jsonData = JSON.parse(asyncRequest);
      saveJsonFile(jsonData);
      saveDocumentLength(jsonData);
      processAsyncResponse(jsonData);
    }
  }

  function callBack(asyncRequest, jsonData) {
      saveJsonFile(jsonData);
      saveDocumentLength(jsonData);
      processAsyncResponse(jsonData);
  }

  /**
   * @param  {Object} jsonData The response text (json object)
   * adds it to the existing documents
   * @return {void}
   */
  function saveJsonFile(jsonData) {
    _this.jsonDocument.jsonFile.push(jsonData);
  }

  /**
   * @param  {Object} jsonData The response text (json object)
   * increases the flag which saves documents length
   * @return {void}
   */
  function saveDocumentLength(jsonData) {
    _this.documentLength += jsonData.length;
  }

  /**
   * @param  {Object} jsonData json object
   * sets empty data source flag to false
   * processes data recieved
   * sets create Index true
   * creates Index and assings it to object
   * @return {void}
   */
  function processAsyncResponse(jsonData) {
    if (jsonData.length && jsonData !== []) {
      _this.emptyDatasource.isEmpty = false;
      processAsyncData(jsonData);
      isIndexCreated();
      _this.indexObject.data = createIndex(_this.indexArray);
    }
  }

  /**
   * @param  {Object} jsonData json file
   * converts to lower case and sorts jsondata
   * elimanates duplicate words and replaces non words
   * pushes unique words to array
   * @return {void}
   */
  function processAsyncData(jsonData) {
    jsonData.forEach(function(value) {
      var sorted = transformAsyncData(value.title + ' ' + value.text);
      var uniqueWords = eliminateDuplicateWords(replaceNonWord(sorted));
      _this.indexArray.push(uniqueWords);
    });
  }

  /**
   * @param  {String} data words to be transformed
   * transform data to lowercase , splits then sorts in ascending order
   * @return {String}      the sorted lowercase data
   */
  function transformAsyncData(data){
    return lowerCase(data).split(' ').sort();
  }

  /**
   * sets indexcreated flag to true
   * @return {void} [description]
   */
  function isIndexCreated() {
    if (_this.indexArray.length) {
      _this.indexCreated.isCreated = true;
    }
  }

  /**
   * @param  {Array} uniqueWords The unique elements
   * loops through all elements and gets the document location from the index
   * @return {Object} the Indexed object
   */
  function createIndex(uniqueWords) {
    var indexedObject = {};
    uniqueWords.forEach(function (docData, docIndex) {
     docData.filter(function (words) {
       (indexedObject[words] !== undefined)? indexedObject[words].push(docIndex)
        : indexedObject[words] = [docIndex];
     });
    });

    return indexedObject;
  }

  function lowerCase(text) {
    return text.toLowerCase();
  }

  /**
   * @param  {String} word words
   * replaces non alphabet characters using regex e.g ?*.,+
   * @return {String} A word with only alphabets
   */
  function replaceNonWord(word) {
    return word.toString().replace(/\W+/g, ' ').toString();
  }

  /**
   * @param  {Array} value An array with words from jsondata
   * eliminates duplicate words
   * @return {Array} uniqueWords The full unique array
   */
  function eliminateDuplicateWords(value) {
   var uniqueWords = value.split(' ').reduce(function (unique, word) {
        if (!unique.includes(word)){
            unique.push(word);
          }

        return unique;
    }, []);

    return uniqueWords;
  }

  /**
   * @param  {String} key The word to search
   * @param  {Object} indexObject The object containing words and documents
   * manipulates search word to return the document found
   *  @return {Array} searchArray the documents located
   */
  function getIndexPosition(key, indexObject) {
    // checks if it a single word and return its position
    if ((typeof key === 'string') && key.indexOf(' ') === -1) {
      return indexObject[lowerCase(key)];
    }
    // splits words into single words and returns its position
    if((typeof key === 'string') && key.indexOf(' ') !== -1) {
    var searchArray = key.split(' ').map(function (word) {
      return getIndexPosition(word, indexObject);
    });

    return searchArray;
  }
  }

  /**
   * @param  {String}  data
   * returns true if data is not found in the array
   * @return {Boolean}
   */
  function isValidData(data) {
    return (['',undefined,null,isNaN].indexOf(data) === -1)? true: false;
  }

}

module.exports = Index
