/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global expect */
'use strict'

//variable to hold index instance
var invertedindex;


describe("Read book data", function() {


  describe('test something', function() {
    beforeEach( function (){
      invertedindex = new Index();
      invertedindex.createIndex(invertedindex.getHostAddress()+'/books.json');
      //calling create index twice
      invertedindex.createIndex(invertedindex.getHostAddress()+'/read.json');
      }) ;
    it('Checks if datasource is populated ', function(done) {
        setTimeout(function() {
            expect(invertedindex.emptyDatasource.isEmpty).toBe(false);
            //check is empty datasource flag is empty
            expect(invertedindex.emptyDatasource.isEmpty).toBe(false);
            //check taht datasource file is not empty array
            expect(invertedindex.jsonDocument.jsonfile).not.toBe([]);
            //check document length > 0
            expect(invertedindex.documentLength).toBeGreaterThan(0);
            done();
        },1000);
    });
});


});



describe("Populate Index", function() {
  it("Index are created when json file is read", function() {
    //check index created is true
    expect(invertedindex.indexCreated.isCreated).toBe(true);
  });
});

describe("Index Mapping", function() {
  it("Index are mapped to correct strings", function() {

    expect(invertedindex.getIndex().and).toEqual([0,1]);
    expect(invertedindex.getIndex().alice).toEqual([0]);
    expect(invertedindex.getIndex().seek).toEqual([1]);
    expect(invertedindex.getIndex().of).toEqual([0,1]);
    //testing read.json
    expect(invertedindex.getIndex().concise).toEqual([3]);
    expect(invertedindex.getIndex().pocahontas).toEqual([2]);
    expect(invertedindex.getIndex().a).toEqual([0,1,2]);
  });
});



describe("Search Index", function() {
  it("Search index returns object with search query", function() {
    expect(invertedindex.searchIndex('and')).toEqual([0,1]);
    expect(invertedindex.searchIndex('alice')).toEqual([0]);
    expect(invertedindex.searchIndex('wonderland')).toEqual([0]);
    expect(invertedindex.searchIndex('alice and wonderland in')).toEqual([ [ 0 ], [ 0,1 ], [ 0 ], [ 0 ] ] );
  });
});
