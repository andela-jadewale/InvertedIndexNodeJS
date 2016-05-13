'use strict'

function Index(){
  var INDEX = this;
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


  this.createIndex = function(filepath){
     if(this.indexCreated.isCreated){

   }
   else{
    requestData(filepath);
  }
    }




/**
   * @param  {String} The host address
   * @param  {String} The datasource flag to be set.
   * @param  {Array} A list of all unique words array to be populated.
   * @param  {Object} The words and documents location object to be populated.
   * @param  {Array} .
   * @param  {Object}The JSON file to be set
   * @param  {Object} The original length of the JSON file.
   * param   {Object} The Index created flag to be set
   * creates the HttpRequest .
   * adds a Listener for the requests callback
   * sets request paramters and header
   * @return {void}
   */
function requestData(filepath) {
  try {
    //Instantiates a request object
    var syncRequest = new XMLHttpRequest();
    //Adds on readystatechange listener to request object
    addSynclistener(syncRequest);
    //sets request objects parameters(request location) and heading
    prepareSyncRequest(filepath, syncRequest);
  } catch (exception) {
    console.log(exception);
  }//end of try/catch block
}


function addSynclistener(syncRequest) {
  //adds readystatechange listener, callback
  syncRequest.addEventListener('readystatechange',function(){parseData(syncRequest);}, false);
}

function prepareSyncRequest(filepath, syncRequest) {
  syncRequest.open('GET', filepath, false);
  syncRequest.setRequestHeader('Accept', 'application/json; charset=utf-8');
  syncRequest.send();
}

function processData(jsonData) {
  for (var value in jsonData) {
    INDEX.indexArray
    .push(jsonData[value]
    .title.concat(' ')
    .concat(jsonData[value]
    .text)
    .toLowerCase().split(' '));
    INDEX.indexArray[value] = eliminateDupicateWords(replaceNonWord(INDEX.indexArray[value]));
  }
}

function parseData(syncRequest) {
  if (syncRequest.readyState === 4 && syncRequest.status === 200) {
    var jsonData = JSON.parse(syncRequest.responseText);
    saveJsonFile(jsonData);
    saveDocumentLength(jsonData);
    getSyncResponse(jsonData);
  }
}

function saveJsonFile(jsonData) {
  INDEX.jsonDocument.jsonfile = jsonData;
}
function saveDocumentLength( jsonData) {
  INDEX.documentLength += jsonData.length;
}
function getSyncResponse(jsonData) {
  if (jsonData.length >= 0 && jsonData !== []) {
    INDEX.emptyDatasource.isEmpty = false;
    processData(jsonData);
    isIndexcreated();
    INDEX.indexObject.strings = createIndex(INDEX.indexArray);
  }
}
function isIndexcreated() {
  if (INDEX.indexArray.length > 0) {
    INDEX.indexCreated.isCreated = true;
  }
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


}
