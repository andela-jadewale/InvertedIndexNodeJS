/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global expect */
'use strict'

//variable to hold index instance
var invertedindex;
var documentLength;


describe("Read book data", function() {


  describe('Initialises Index object', function() {
    beforeEach( function (){
      invertedindex = new Index();
      invertedindex.createIndex(invertedindex.getHostAddress()+'/books.json');

      }) ;
    it('Checks if datasource is populated ', function(done) {
        setTimeout(function() {
            expect(invertedindex.emptyDatasource.isEmpty).toBe(false);
            //check isEmpty datasource flag is empty
            expect(invertedindex.emptyDatasource.isEmpty).toBe(false);
            //check  datasource file is not empty array
            expect(invertedindex.jsonDocument.jsonfile).not.toBe([]);


            for(var obj = 0; obj < invertedindex.jsonDocument.jsonfile.length; obj++){
                for(var index in invertedindex.jsonDocument.jsonfile[obj]){
                  //check if JSON objects() values are strings
                 expect(typeof invertedindex.jsonDocument.jsonfile[obj][index].title).toEqual('string');
                 expect(typeof invertedindex.jsonDocument.jsonfile[obj][index].text).toEqual('string');
                }

              }
            //check Index document length > 0
            expect(invertedindex.documentLength).toBeGreaterThan(0);
            expect(invertedindex.documentLength).toEqual(2);
            //setting test document length = 2
            documentLength = invertedindex.documentLength;
            done();
        },1000);
    });
});

});



describe("Populate Index", function() {
  it("Index are created when json file is read", function() {
    //check index created is true
    expect(invertedindex.indexCreated.isCreated).toBe(true);
    //calling create index again
    invertedindex.createIndex(invertedindex.getHostAddress()+'/read.json');
    it('Test book.json file is not overwritten ', function(done) {
    setTimeout(function(){
      /*testing document length > 2
      create index does not overwrite*/
      expect(invertedindex.documentLength).toBeGreaterThan(2)
;      done();
    }, 1000);
});

  });
});

describe("Index Mapping", function() {
  it("Index are mapped to correct strings", function() {

    expect(invertedindex.getIndex().and).toEqual([0,1]);
    expect(invertedindex.getIndex().alice).toEqual([0]);
    //get index takes string argument
    expect(invertedindex.getIndex('alice')).toEqual([0]);
    expect(invertedindex.getIndex().seek).toEqual([1]);
    expect(invertedindex.getIndex().of).toEqual([0,1]);
    //testing read.json
    it('Test read.json file ', function(done) {
    setTimeout(function(){
      expect(invertedindex.getIndex().and).toEqual([0,1]);
      expect(invertedindex.getIndex().concise).toEqual([3]);
      expect(invertedindex.getIndex().pocahontas).toEqual([2]);
      expect(invertedindex.getIndex().a).toEqual([0,1,2]);
      done();
    }, 1000);

  });});

});



describe("Search Index", function() {
  it("Search index returns object with search query", function(done) {
    setTimeout(function(){

      expect(invertedindex.searchIndex('and')).toEqual([0,1]);
      expect(invertedindex.searchIndex('alice')).toEqual([0]);

      //testing milliseconds for 4 search's
      var d = new Date();
      var n = d.getTime();
      expect(invertedindex.searchIndex('wonderland')).toEqual([0]);
      expect(invertedindex.searchIndex('alice and wonderland in')).toEqual([ [ 0 ], [ 0,1 ], [ 0 ], [ 0 ] ] );
      //testing complex words search
      expect(invertedindex.searchIndex('Wonderland ?  . concise in / pocahontas, seek')).toEqual([[ 0 ], [ 3 ], [ 0 ], [ 2 ], [ 1 ]] );
      //testing arrays
      expect(invertedindex.searchIndex(['alice', 'and','wonderland', 'in'])).toEqual([ [ 0 ], [ 0,1 ], [ 0 ], [ 0 ] ] );
      expect(invertedindex.searchIndex(['wonderland'])).toEqual([0]);
      var s = d.getTime();
      //time test to equal 0 milliseconds
      expect(s-n).toEqual(0);
      done();
    }, 1000)

  });
});
