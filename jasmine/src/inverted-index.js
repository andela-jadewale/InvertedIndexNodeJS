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

// Inverted index object
function InvertedIndex (){
    //get host address to request for books.json file
    this.getHostAddress = function (){
        return location.protocol.concat("//").concat(location.host);
    },
    //flag to check empty datasource
    this.emptyDatasource = {isEmpty:true},
    //flag to check if index is created
    this.indexCreated = {isCreated:false},

    this.uniqueIndex = [],
    //the original json document
    this.document = {jsonfile:[]},

    //the length of the json document
    this.documentLength = [],

    this.indexArray = [],

    //stores the unique elements and documents located
    this.indexObject = {strings:[]},

    //stores the search word
    this.keyword = "",

    //request book.json
    this.readData = requestData(this.getHostAddress(),this.emptyDatasource,this.indexArray,this.indexObject,
    this.uniqueIndex,this.document,this.documentLength,this.indexCreated),

    this.getIndex = function (){
        return getIndexPosition( this.keyword,this.indexObject.strings);
    },

    this.lowerCaseTransform = function (text){
        return lowerCase(text);
    };
    }
function requestData(source,emptyDatasource,indexArray,indexObject,uniqueIndex,document,
documentLength,indexCreated){
    try{
        var syncRequest = new XMLHttpRequest();
        addSynclistener(syncRequest,emptyDatasource,indexArray,indexObject,
        uniqueIndex,document,documentLength,indexCreated);
        prepareSyncRequest(source,syncRequest);
    }
    catch(exception){
       console.log(exception);
    }
}

function addSynclistener(syncRequest,emptyDatasource,indexArray,indexObject,
                uniqueIndex,document,documentLength,indexCreated){
        syncRequest.addEventListener("readystatechange",
        function(){
                parseData(syncRequest,emptyDatasource,indexArray,indexObject,
                uniqueIndex,document,documentLength,indexCreated);
        },false);
}

function prepareSyncRequest(source,syncRequest){
    syncRequest.open("GET",source.concat("/books.json"),false);
        syncRequest.setRequestHeader("Accept", "application/json; charset=utf-8");
        syncRequest.send();
    }

function parseData(syncRequest,emptyDatasource,indexArray,indexObject,
uniqueIndex,document,documentlength,indexCreated){
    if(syncRequest.readyState === 4 && syncRequest.status === 200 ){
        var jsonData = JSON.parse(syncRequest.responseText);
        saveJsonFile(document,jsonData);
        saveDocumentLength(documentlength,jsonData);
        getSyncRequest(jsonData,emptyDatasource,indexArray,indexCreated,indexObject);

    }
}

function getSyncRequest(jsonData,emptyDatasource,indexArray,indexCreated,
         indexObject){
    if(jsonData.length >= 0 && jsonData !== []){
            emptyDatasource.isEmpty = false;
            processData(jsonData, indexArray);
            isIndexcreated(indexCreated,indexArray);
            indexObject.strings = createIndex(indexArray);
            }

}

function processData(jsonData,indexArray) {
    for(var value in jsonData){
        indexArray.push(jsonData[value].title.concat(" ").concat(jsonData[value].text).
        toLowerCase().split(" ").sort());
        indexArray[value]= eliminateDupicateWords(replaceNonWord(indexArray[value]));
            }
}


function saveJsonFile(document,jsonData){
    document.jsonfile = jsonData;
}

function saveDocumentLength(documentlength,jsonData){
    documentlength.length = jsonData.length;

}

function isIndexcreated(indexCreated,indexObject){
    if(indexObject.length > 0)
        indexCreated.isCreated = true;
}

function lowerCase(text){
    return text.toLowerCase();
}

function replaceNonWord(value){
    return value.toString().replace(/\W+/g, " ").toString().replace("\b(\w+)\s+\1\b");
}

function eliminateDupicateWords(value){
    var seperateWords = value.split(" ");
    var uniqueWords = [];
    return eliminateDuplicatewordsloop(seperateWords, uniqueWords);
}

function eliminateDuplicatewordsloop(seperateWords,uniqueWords){
    for(var index = 0; index < seperateWords.length; index++){
        if(uniqueWords.includes(seperateWords[index]))
            continue;
        uniqueWords.push(seperateWords[index]);
    }
    return uniqueWords;

}

function createIndex(value){
    var indexedObject = {};
    for(var index in value){
        for(var indexin in value[index]){
            if(value.toString().split(value[indexin]).length === 1)
                indexedObject[value[index][indexin]] = [parseInt(index)];
            else indexedObject[value[index][indexin]] = [0,1];
            continue;
        }
    }
    return indexedObject;
}

function getIndexPosition(key,indexobject){
    return indexobject[key.toLowerCase()];
}


