
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict'

function InvertedIndex() {
  //get host address to request for books.json file
   this.getHostAddress = function() {
      return location.protocol.concat('//').concat(location.host);
    },
    //flag to check empty datasource
    this.emptyDatasource = { isEmpty: true },
    //flag to check if index is created
    this.indexCreated = { isCreated: false },

    this.uniqueIndex = [],
    //the original json document
    this.document = { jsonfile: [] },

    //the length of the json document
    this.documentLength = [],

    this.indexArray = [],

    //stores the unique elements and documents location
    this.indexObject = { strings: [] },

    //stores the search word
    this.keyword = '',

    //request book.json and manipulate the file
    this.readData = requestData(this.getHostAddress(),
      this.emptyDatasource, this.indexArray, this.indexObject,
      this.uniqueIndex, this.document, this.documentLength, this.indexCreated),


    // gets the location of the documents
    this.getIndex = function() {
      return getIndexPosition(this.keyword, this.indexObject.strings);
    },

    //transforms text to lower case
    this.lowerCaseTransform = function(text) {
      return lowerCase(text);
    };
}

   /**
   * @param  {String} The host address
   * @param  {String} The datasource flag to be set.
   * @param  {Array} A list of all unique words array to be populated.
   * @param  {Object} The words and documents location object to be populated.
   * @param  {Array} .
   * @param  {Object} The original length of the JSON file.
   * creates the HttpRequest .
   * adds a Listener for the requests callback
   * sets request paramters and header
   * @return {void}
   */
function requestData(source, emptyDatasource,
  indexArray, indexObject, uniqueIndex, document,
  documentLength, indexCreated) {
  try {
    //Instantiates a request object
    var syncRequest = new XMLHttpRequest();
    //Adds on readystatechange listener to request object
    addSynclistener(syncRequest, emptyDatasource, indexArray, indexObject,
      uniqueIndex, document, documentLength, indexCreated);
    //sets request objects parameters(request location) and heading
    prepareSyncRequest(source, syncRequest);
  } catch (exception) {
    console.log(exception);
  }//end of try/catch block
}

/**
   * @param  {Object} request object
   * @param  {String} The datasource flag to set on request's response.
   * @param  {Array} A list of unique words array to set on request's response.
   * @param  {Object} The words and documents location object to set on request's response.
   * @param  {Array} .
   * @param  {Object} The original length of the JSON file to set on request's response.
   * sets on readystatechange listener
   * sets a calback function on request's response
   * sets asynchronous to false
   * @return {void}
   */

function addSynclistener(syncRequest, emptyDatasource, indexArray, indexObject,
  uniqueIndex, document, documentLength, indexCreated) {
  //adds readystatechange listener, callback and sets asynchronous request false
  syncRequest.addEventListener('readystatechange',
    function() {
      parseData(syncRequest, emptyDatasource, indexArray, indexObject,
        uniqueIndex, document, documentLength, indexCreated);
    }, false);
}

/**
   * @param  {String} The host address
   * @param  {Object} the request object
   * sets on readystatechange listener
   * sets a calback function on request's response
   * sets asynchronous to false
   * @return {void}
   */
function prepareSyncRequest(source, syncRequest) {
  syncRequest.open('GET', source.concat('/books.json'), false);
  syncRequest.setRequestHeader('Accept', 'application/json; charset=utf-8');
  syncRequest.send();
}

function parseData(syncRequest, emptyDatasource, indexArray, indexObject,
  uniqueIndex, document, documentlength, indexCreated) {
  if (syncRequest.readyState === 4 && syncRequest.status === 200) {
    var jsonData = JSON.parse(syncRequest.responseText);
    saveJsonFile(document, jsonData);
    saveDocumentLength(documentlength, jsonData);
    getSyncRequest(jsonData, emptyDatasource, indexArray, indexCreated, indexObject);
  }
}

function getSyncRequest(jsonData, emptyDatasource, indexArray, indexCreated,
  indexObject) {
  if (jsonData.length >= 0 && jsonData !== []) {
    emptyDatasource.isEmpty = false;
    processData(jsonData, indexArray);
    isIndexcreated(indexCreated, indexArray);
    indexObject.strings = createIndex(indexArray);
  }
}

function processData(jsonData, indexArray) {
  for (var value in jsonData) {
    indexArray
    .push(jsonData[value]
    .title.concat(' ')
    .concat(jsonData[value]
    .text)
    .toLowerCase().split(' ').sort());
    indexArray[value] = eliminateDupicateWords(replaceNonWord(indexArray[value]));
  }
}

function saveJsonFile(document, jsonData) {
  document.jsonfile = jsonData;
}

function saveDocumentLength(documentlength, jsonData) {
  documentlength.length = jsonData.length;
}

function isIndexcreated(indexCreated, indexObject) {
  if (indexObject.length > 0) {
    indexCreated.isCreated = true;
  }
}

function lowerCase(text) {
  return text.toLowerCase();
}

function replaceNonWord(value) {
  return value.toString().replace(/\W+/g, ' ').toString();
}

function eliminateDupicateWords(value) {
  var seperateWords = value.split(' ');
  var uniqueWords = [];
  return eliminateDuplicatewordsloop(seperateWords, uniqueWords);
}

function eliminateDuplicatewordsloop(seperateWords, uniqueWords) {
  for (var index = 0; index < seperateWords.length; index++) {
    if (uniqueWords.includes(seperateWords[index])){
      continue;
    }
    uniqueWords.push(seperateWords[index]);
  }
  return uniqueWords;
}

function createIndex(value) {
  var indexedObject = {};
  for (var index in value) {
    for (var indexin in value[index]) {
      if (value.toString().split(value[indexin]).length === 1){
        indexedObject[value[index][indexin]] = [parseInt(index)];
      }

      else{indexedObject[value[index][indexin]] = [0, 1];
      }
      continue;
    }
  }
  return indexedObject;
}

function getIndexPosition(key, indexobject) {
  return indexobject[key.toLowerCase()];
}

