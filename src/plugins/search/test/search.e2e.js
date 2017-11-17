describe('Search plugin', () => {

  var id = 'testContainer';

  beforeEach(function () {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('enabling/disabling plugin', () => {
    it('should expose `search` object when plugin is enabled', () => {

      var hot = handsontable({
        search: true,
      });

      expect(hot.search).toBeDefined();
    });

    it('should NOT expose `search` object when plugin is disabled', () => {
      var hot = handsontable({
        search: false,
      });

      expect(hot.search).not.toBeDefined();
    });

    it('plugin should be disabled by default', () => {
      var hot = handsontable();

      expect(hot.search).not.toBeDefined();
    });

    it('should disable plugin using updateSettings', () => {
      var hot = handsontable({
        search: true,
      });

      expect(hot.search).toBeDefined();

      updateSettings({
        search: false,
      });

      expect(hot.search).not.toBeDefined();
    });

    it('should enable plugin using updateSettings', () => {
      var hot = handsontable({
        search: false,
      });

      expect(hot.search).not.toBeDefined();

      updateSettings({
        search: true,
      });

      expect(hot.search).toBeDefined();
    });
  });

  describe('query method', () => {
    afterEach(() => {
      Handsontable.plugins.Search.global.setDefaultQueryMethod(Handsontable.plugins.Search.DEFAULT_QUERY_METHOD);
    });

    it('should use the default query method if no queryMethod is passed to query function', () => {
      spyOn(Handsontable.plugins.Search, 'DEFAULT_QUERY_METHOD');

      var defaultQueryMethod = Handsontable.plugins.Search.DEFAULT_QUERY_METHOD;

      Handsontable.plugins.Search.global.setDefaultQueryMethod(defaultQueryMethod);

      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      hot.search.query('A');

      expect(defaultQueryMethod.calls.count()).toEqual(25);
    });

    it('should use the custom default query method if no queryMethod is passed to query function', () => {
      var customDefaultQueryMethod = jasmine.createSpy('customDefaultQueryMethod');

      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      Handsontable.plugins.Search.global.setDefaultQueryMethod(customDefaultQueryMethod);

      hot.search.query('A');

      expect(customDefaultQueryMethod.calls.count()).toEqual(25);
    });

    it('should use the query method from the constructor if no queryMethod is passed to query function', () => {
      var customQueryMethod = jasmine.createSpy('customDefaultQueryMethod');

      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: {
          queryMethod: customQueryMethod,
        },
      });

      hot.search.query('A');

      expect(customQueryMethod.calls.count()).toEqual(25);
    });

    it('should use method passed to query function', () => {
      var customQueryMethod = jasmine.createSpy('customQueryMethod');

      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      hot.search.query('A', null, customQueryMethod);

      expect(customQueryMethod.calls.count()).toEqual(25);
    });
  });

  describe('default query method', () => {

    it('should use query method to find phrase', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      var searchResult = hot.search.query('A');

      expect(searchResult.length).toEqual(5);

      for (var i = 0; i < searchResult.length; i += 1) {
        expect(searchResult[i].row).toEqual(i);
        expect(searchResult[i].col).toEqual(0);
        expect(searchResult[i].data).toEqual(hot.getDataAtCell(i, 0));
      }
    });

    it('default query method should be case insensitive', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      var searchResult = hot.search.query('a');

      expect(searchResult.length).toEqual(5);

      searchResult = hot.search.query('A');

      expect(searchResult.length).toEqual(5);
    });

    it('default query method should work with numeric values', () => {
      var hot = handsontable({
        data: [
          [1, 2],
          [22, 4],
        ],
        search: true,
      });

      var searchResult = hot.search.query('2');

      expect(searchResult.length).toEqual(2);
    });

    it('default query method should interpret query as string, not regex', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      var searchResult = hot.search.query('A*');

      expect(searchResult.length).toEqual(0);
    });

    it('default query method should always return false if query string is empty', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      var searchResult = hot.search.query('A');

      expect(searchResult.length).toEqual(5);

      searchResult = hot.search.query('');

      expect(searchResult.length).toEqual(0);
    });

    it('default query method should always return false if no query string has been specified', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      var searchResult = hot.search.query('A');

      expect(searchResult.length).toEqual(5);

      searchResult = hot.search.query();

      expect(searchResult.length).toEqual(0);
    });

    it('default query method should always return false if no query string is not a string', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      var searchResult = hot.search.query('A');

      expect(searchResult.length).toEqual(5);

      searchResult = hot.search.query([1, 2, 3]);

      expect(searchResult.length).toEqual(0);
    });
  });

  describe('search callback', () => {
    afterEach(() => {
      Handsontable.plugins.Search.global.setDefaultCallback(Handsontable.plugins.Search.DEFAULT_CALLBACK);
    });

    it('should invoke default callback for each cell', () => {
      spyOn(Handsontable.plugins.Search, 'DEFAULT_CALLBACK');

      var defaultCallback = Handsontable.plugins.Search.DEFAULT_CALLBACK;

      Handsontable.plugins.Search.global.setDefaultCallback(defaultCallback);

      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      hot.search.query('A');

      expect(defaultCallback.calls.count()).toEqual(25);
    });

    it('should change the default callback', () => {
      spyOn(Handsontable.plugins.Search, 'DEFAULT_CALLBACK');

      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      var defaultCallback = jasmine.createSpy('defaultCallback');
      Handsontable.plugins.Search.global.setDefaultCallback(defaultCallback);

      hot.search.query('A');

      expect(Handsontable.plugins.Search.DEFAULT_CALLBACK).not.toHaveBeenCalled();
      expect(defaultCallback.calls.count()).toEqual(25);
    });

    it('should invoke callback passed in constructor', () => {
      var searchCallback = jasmine.createSpy('searchCallback');

      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: {
          callback: searchCallback,
        },
      });

      hot.search.query('A');

      expect(searchCallback.calls.count()).toEqual(25);
    });

    it('should invoke custom callback for each cell which has been tested', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      var searchCallback = jasmine.createSpy('searchCallback');

      hot.search.query('A', searchCallback);

      expect(searchCallback.calls.count()).toEqual(25);

      for (var rowIndex = 0, rowCount = countRows(); rowIndex < rowCount; rowIndex += 1) {
        for (var colIndex = 0, colCount = countCols(); colIndex < colCount; colIndex += 1) {
          var callArgs = searchCallback.calls.argsFor((rowIndex * 5) + colIndex);
          expect(callArgs[0]).toEqual(hot);
          expect(callArgs[1]).toEqual(rowIndex);
          expect(callArgs[2]).toEqual(colIndex);
          expect(callArgs[3]).toEqual(hot.getDataAtCell(rowIndex, colIndex));

          if (colIndex === 0) {
            expect(callArgs[4]).toBe(true);
          } else {
            expect(callArgs[4]).toBe(false);
          }
        }
      }
    });
  });

  describe('default search callback', () => {
    it('should add isSearchResult = true, to cell properties of all matched cells', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      hot.search.query('2');

      for (var rowIndex = 0, rowCount = countRows(); rowIndex < rowCount; rowIndex += 1) {
        for (var colIndex = 0, colCount = countCols(); colIndex < colCount; colIndex += 1) {
          var cellProperties = getCellMeta(rowIndex, colIndex);

          if (rowIndex === 1) {
            expect(cellProperties.isSearchResult).toBeTruthy();
          } else {
            expect(cellProperties.isSearchResult).toBeFalsy();
          }
        }
      }
    });
  });

  describe('search result decorator', () => {
    it('should add default search result class to cells which mach the query', () => {

      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: true,
      });

      hot.search.query('2');

      render();

      for (var rowIndex = 0, rowCount = countRows(); rowIndex < rowCount; rowIndex += 1) {
        for (var colIndex = 0, colCount = countCols(); colIndex < colCount; colIndex += 1) {
          var cell = getCell(rowIndex, colIndex);

          if (rowIndex === 1) {
            expect($(cell).hasClass(Handsontable.plugins.Search.DEFAULT_SEARCH_RESULT_CLASS)).toBe(true);
          } else {
            expect($(cell).hasClass(Handsontable.plugins.Search.DEFAULT_SEARCH_RESULT_CLASS)).toBe(false);
          }
        }
      }
    });

    it('should add custom search result class to cells which mach the query', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 5),
        search: {
          searchResultClass: 'customSearchResultClass',
        },
      });

      hot.search.query('2');

      render();

      for (var rowIndex = 0, rowCount = countRows(); rowIndex < rowCount; rowIndex += 1) {
        for (var colIndex = 0, colCount = countCols(); colIndex < colCount; colIndex += 1) {
          var cell = getCell(rowIndex, colIndex);

          if (rowIndex === 1) {
            expect($(cell).hasClass('customSearchResultClass')).toBe(true);
          } else {
            expect($(cell).hasClass('customSearchResultClass')).toBe(false);
          }
        }
      }
    });
  });

  describe('HOT properties compatibility', () => {
    it('should work properly when the last row is empty', () => { // connected with https://github.com/handsontable/handsontable/issues/1606
      var hot = handsontable({
          data: Handsontable.helper.createSpreadsheetData(5, 5),
          colHeaders: true,
          search: true,
          minSpareRows: 1,
        }),
        errorThrown = false;

      try {
        hot.search.query('A');
      } catch (err) {
        errorThrown = true;
      }

      expect(errorThrown).toBe(false);
    });
  });
});
