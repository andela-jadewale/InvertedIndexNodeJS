(function () {
   'use strict';


var invertedindex;
var documentLength;


describe('Initialises Index object', function () {
  beforeEach( function (){
    invertedindex = new Index();
    invertedindex.createIndex(invertedindex.getHostAddress() + '/books.json');
  }) ;

describe('Read book data', function () {
  it('Checks if datasource is populated ', function (done) {
    setTimeout (function () {
      expect(invertedindex.emptyDatasource.isEmpty).toBe(false);
      expect(invertedindex.jsonDocument.jsonfile).not.toBe([]);
      // loops through  to assert json values are strings
        it('Checks objects in json array contain strings ', function (done) {
          var length = invertedindex.jsonDocument.jsonfile.length;
          for (var obj = 0; obj < length; obj++) {
            for (var index in invertedindex.jsonDocument.jsonfile[obj]) {
              expect(typeof invertedindex.jsonDocument
                .jsonfile[obj][index].title).toEqual('string');
              expect(typeof invertedindex.jsonDocument
                .jsonfile[obj][index].text).toEqual('string');
            }
          }
        });

        it('Checks Increase in documents Length ', function (done) {
          // checks document length is increased
          expect(invertedindex.documentLength).toBeGreaterThan(0);
          expect(invertedindex.documentLength).toEqual(2);
          // assigns a value to documenlength which will be checked after
          // // second call to create index
          documentLength = invertedindex.documentLength;
        });
          done();
        },500);
    });
  });
});

describe('Populate Index', function () {
  it('Index are created when json file is read', function () {
    expect(invertedindex.indexCreated.isCreated).toBe(true);
    invertedindex.createIndex(invertedindex.getHostAddress()+'/read.json');

    it('Test book.json file is not overwritten ', function (done) {
      setTimeout (function () {
      // document length which shows create index did not overwrite previous
      expect(invertedindex.documentLength).toBeGreaterThan(2);
      done();
    }, 500);
    });
  });
});

describe('Index Mapping', function () {
  it('Index are mapped to correct strings', function () {
    expect(invertedindex.getIndex().and).toEqual([0,1]);
    expect(invertedindex.getIndex().alice).toEqual([0]);
    expect(invertedindex.getIndex('alice')).toEqual([0]);
    expect(invertedindex.getIndex().seek).toEqual([1]);
    expect(invertedindex.getIndex().of).toEqual([0,1]);

    it('Test read.json file ', function(done) {
      setTimeout (function () {
        // testing index mapping
      expect(invertedindex.getIndex().and).toEqual([0,1]);
      expect(invertedindex.getIndex().concise).toEqual([3]);
      expect(invertedindex.getIndex().pocahontas).toEqual([2]);
      expect(invertedindex.getIndex().a).toEqual([0,1,2]);
      done();
    }, 500);
  });});

});

describe('Search Index', function () {
  it('Search index returns object with search query', function(done) {
    setTimeout (function () {
      expect(invertedindex.searchIndex('and')).toEqual([0,1]);
      expect(invertedindex.searchIndex('alice')).toEqual([0]);
      expect(invertedindex.searchIndex('')).toEqual('');
      var pastdate = new Date();
      expect(invertedindex.searchIndex('wonderland')).toEqual([0]);
      expect(invertedindex.searchIndex('alice and wonderland in'))
        .toEqual([ [ 0 ], [ 0,1 ], [ 0 ], [ 0 ] ] );
        // test complicated search works
      expect(invertedindex.searchIndex('Wonderland ?  . concise in '+
        '/ pocahontas, seek'))
        .toEqual([[ 0 ], [ 3 ], [ 0 ], [ 2 ], [ 1 ]] );
        // test an array passed into the search works
      expect(invertedindex.searchIndex([['alice', 'and','wonderland', 'in']]))
        .toEqual([ [ 0 ], [ 0,1 ], [ 0 ], [ 0 ] ] );
      expect(invertedindex.searchIndex(['wonderland'])).toEqual([0]);
      expect(invertedindex.searchIndex('wonderland')).toEqual([0]);
      expect(invertedindex.searchIndex('alice and wonderland in'))
        .toEqual([ [ 0 ], [ 0,1 ], [ 0 ], [ 0 ] ] );
      var presentdate = new  Date();
      // test time to complete 7 search's will be less than 5 milliseconds
      expect(presentdate.getMilliseconds() - pastdate.getMilliseconds() )
      .toBeLessThan(5);
      done();
    }, 500);

  });
});

}());