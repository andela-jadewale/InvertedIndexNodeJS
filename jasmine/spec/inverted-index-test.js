/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global expect */

 var invertedindex = new InvertedIndex();

describe("Read book data",function(){
    it("Checks if datasource is populated",function(){
    expect(invertedindex.emptyDatasource.isEmpty).toBe(false);
    expect(invertedindex.document.jsonfile).not.toBe([]);
    expect(invertedindex.documentLength.length).toBeGreaterThan(0);
});

});



describe("Populate Index",function(){
    var invertedindex = new InvertedIndex();
    it("Index are created when json file is read",function(){
    expect(invertedindex.indexCreated.isCreated).toBe(true);
});

});


describe("Index Mapping",function(){
    it("Index are mapped to correct strings",function(){
        invertedindex.keyword = "alice";
        expect(invertedindex.getIndex()).toEqual([0,1]);
        invertedindex.keyword = "and";
        expect(invertedindex.getIndex()).toEqual([1]);
        invertedindex.keyword = "AliCe";
        expect(invertedindex.getIndex()).toEqual([0,1]);
        invertedindex.keyword = "";
        expect(invertedindex.getIndex()).toEqual(undefined);
});

});


describe("Search query",function(){
    it("Search index returns object with search query",function(){
        invertedindex.keyword = "alice";
        expect(invertedindex.lowerCaseTransform(invertedindex.document.jsonfile[0].title)).
                toContain(invertedindex.lowerCaseTransform(invertedindex.keyword));


        invertedindex.keyword = "alIce";
        expect(invertedindex.lowerCaseTransform(invertedindex.document.jsonfile[0].title)).
                toContain(invertedindex.lowerCaseTransform(invertedindex.keyword));

        invertedindex.keyword = "alIce..";
        expect(invertedindex.lowerCaseTransform(invertedindex.document.jsonfile[0].title)).
                toContain(replaceNonWord(invertedindex.lowerCaseTransform(invertedindex.keyword)));

    });

});




