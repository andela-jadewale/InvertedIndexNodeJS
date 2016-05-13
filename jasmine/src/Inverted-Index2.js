'use strict'

function Index(){

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
  syncRequest.addEventListener('readystatechange',parseData(syncRequest), false);
}

function prepareSyncRequest(filepath, syncRequest) {
  syncRequest.open('GET', filepath, true);
  syncRequest.setRequestHeader('Accept', 'application/json; charset=utf-8');
  syncRequest.send();
}

function processData(jsonData) {
  for (var value in jsonData) {
    this.indexArray
    .push(jsonData[value]
    .title.concat(' ')
    .concat(jsonData[value]
    .text)
    .toLowerCase().split(' '));
    this.indexArray[value] = eliminateDupicateWords(replaceNonWord(this.indexArray[value]));
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
  this.jsonDocument.jsonfile = jsonData;
}
function saveDocumentLength(documentlength, jsonData) {
  this.documentLength += jsonData.length;
}
function getSyncResponse(jsonData) {
  if (jsonData.length >= 0 && jsonData !== []) {
    this.emptyDatasource.isEmpty = false;
    processData(jsonData);
    isIndexcreated();
    indexObject.strings = createIndex(indexArray);
  }
}
function isIndexcreated() {
  if (this.indexArray.length > 0) {
    this.indexCreated.isCreated = true;
  }
}


}