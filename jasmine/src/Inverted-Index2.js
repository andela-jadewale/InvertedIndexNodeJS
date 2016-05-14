'use strict'


function Index(){
  // holds Index and its property
  var _this = this;

  // get location of file
  this.getHostAddress = function() {
      return location.protocol.concat('//').concat(location.host);
    },
  this.file = function (fileName){
      return fileName;
    },
  this.jsonDocument = {jsonfile:[]},
  this.emptyDatasource = { isEmpty: true },
  this.indexCreated = { isCreated: false },
  this.documentLength = 0,
  this.indexArray = [],
  this.indexObject = {strings:[]},
  this.getIndex = function(key){
    if(key !== undefined){
      return this.indexObject.strings[key]
    }
    return this.indexObject.strings;
  }
  this.searchIndex = function(word) {
      return getIndexPosition(replaceNonWord(word), this.indexObject.strings);
    },
  this.lowerCaseTransform = function(text) {
      return lowerCase(text);
    };
  this.createIndex = function(filepath){
    requestData(filepath);
    }





/**
   * @param  {String} The file path
   * @return {void}
   */
function requestData(filepath) {
  try {
    //Instantiates a request object
    var asyncRequest = new XMLHttpRequest();
    //Adds on readystatechange listener to request object
    addSynclistener(asyncRequest);
    //sets request objects parameters(request location) and header
    prepareSyncRequest(filepath, asyncRequest);
  } catch (exception) {
    console.log(exception);
  }//end of try/catch block
}

/**
   * @param  {Object} The request object
   * sets on readystatechange listener
   * @return {void}
   */
function addSynclistener(asyncRequest) {
  //adds readystatechange listener, callback
  asyncRequest.addEventListener('readystatechange',function(){parseData(asyncRequest);}, true);
}
/**
   * @param  {String} The file path
   * @param  {Object} the request object
   * Sends a get request and sets a calback function on request's response
   * sets asynchronous to true
   * sets request header and sends request
   * @return {void}
   */
function prepareSyncRequest(filepath, asyncRequest) {
  asyncRequest.open('GET', filepath, true);
  asyncRequest.setRequestHeader('Accept', 'application/json; charset=utf-8');
  asyncRequest.send();
}


/**
   * @param  {Object} books.json object
   * populates the unique elements from jsonData and sorts them
   * elimanates duplicate words and replaces non words
   * re-initialises unique elements to sorted and unique words
   *
   * @return {void}
   */
function processData(jsonData) {
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

function parseData(asyncRequest) {
  if (asyncRequest.readyState === 4 && asyncRequest.status === 200) {
    var jsonData = JSON.parse(asyncRequest.responseText);
    saveJsonFile(jsonData);
    saveDocumentLength(jsonData);
    getSyncResponse(jsonData);
  }
}

function saveJsonFile(jsonData) {
  _this.jsonDocument.jsonfile.push(jsonData);
}
function saveDocumentLength( jsonData) {
  _this.documentLength += jsonData.length;
}
function getSyncResponse(jsonData) {
  if (jsonData.length >= 0 && jsonData !== []) {
    _this.emptyDatasource.isEmpty = false;
    processData(jsonData);
    isIndexcreated();
    _this.indexObject.strings = createIndex(_this.indexArray);
  }
}
function isIndexcreated() {
  if (_this.indexArray.length > 0) {
    _this.indexCreated.isCreated = true;
  }
}

function createIndex(value) {
  var indexedObject = {};
  for (var index in value) {
    for (var indexin in value[index]) {
        if(indexedObject[value[index][indexin]] !== undefined ){
          indexedObject[value[index][indexin]].push(parseInt(index));
        }
        else{
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


function getIndexPosition(key, indexobject) {
  if((typeof key === 'string') && key.indexOf(" ") === -1){
    return indexobject[key.toLowerCase()];
  }
  var tokens = key.split(" ");
  if((typeof key === 'string') && key.indexOf(" ") !== -1){
    var searcharray = []
    for(var word = 0; word < tokens.length; word++){
      searcharray.push(getIndexPosition(tokens[word], indexobject));
    }
    return searcharray;
  }




}


}
