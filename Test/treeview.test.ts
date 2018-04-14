((window: IWindow) => {

  var _stateManager: IStateManager;
  var _treeview: ITreeview;
  var _treeItem: ITreeItem;
  var _getValueCalls: Array<Object>;
  var _getValueLogic: (id: string, property: string, defaultValue :any) => any;
  var _setValueCalls: Array<any>;
  var _window: any;
  var _thenResult: any;
  const _someItems: Array<ITreeItemPartial> = [
    {
      TreeKey: 1,
      ParentKey: 0,
      Title: "TreeItem1"
    },
    {
      TreeKey: 2,
      ParentKey: 0,
      Title: "TreeItem2"
    },
    {
      TreeKey: 3,
      ParentKey: 0,
      Title: "TreeItem3"
    },
    {
      TreeKey: 4,
      ParentKey: 1,
      Title: "TreeItem4"
    },
    {
      TreeKey: 5,
      ParentKey: 1,
      Title: "TreeItem5"
    }
  ];

  window.angular.module("treeview.mock.window", []).service("$window", () => {
    return {
      localStorage: {}
    };
  });

  window.angular.module("treeview.mock.cache", []).service("cacheServiceProvider", ["$window", ($window: IWindow) : ICacheServiceProvider => {
    return {
      GlobalScope: $window,
      GetStateManagerInstance: () : IStateManager => {
        _stateManager = {
          GlobalScope: $window,
          CachedProperties: {
            "AllCollapsed": "AllCollapsed",
            "CachedNodes": "CachedNodes"
          },
          CurrentState: {},
          GetValue: (id: string, property: string, defaultValue :any) : any => {
            _getValueCalls.push({ID: id, Property: property, DefaultValue: defaultValue});
            return _getValueLogic === null ? defaultValue : _getValueLogic(id, property, defaultValue);
          },
          SetValue: (id: string, property: string, value: any) : void => {
            _setValueCalls.push({ID: id, Property: property, Value: value});
          }
        };
        return _stateManager;
      }
    };
  }]);

  window.describe("treeview module", () => {
    
    window.beforeEach(() => {
      window.angular.mock.module("treeview");
      _stateManager = null;
      _treeview = null;
      _treeItem = null;
      _getValueCalls = [];
      _getValueLogic = null;
      _setValueCalls = [];
    });    

    window.describe("treeview", () => {

      const _givenTreeview = () : void => {
        window.angular.mock.module("treeview.mock.window");
        window.angular.mock.module("treeview.mock.cache");
        window.inject(["treeviewProvider", (treeviewProvider: ITreeviewProvider) => {
          _treeview = treeviewProvider.GetInstance("testID", _someItems);
        }]);
      };

      const _givenTreeItem = () : void => {
        _treeItem = _treeview.TreeItems[0];
      };      

      const _givenCachedValues = (allCollapsed: boolean, openNodes: Array<number>) : void => {
        _getValueLogic = (id: string, property: string, defaultValue :any) => {
          return property === _stateManager.CachedProperties.AllCollapsed ? allCollapsed : openNodes;
        };
      };

      const _whenToggleAll = () : void => {
        _treeview.ToggleAll();
      };

      const _whenToggleNode = () => {
        _treeItem.ToggleNode();
      };

      window.it("should be instantiated", () => {
        _givenTreeview();
        window.expect(_treeview).not.toBe(null);        
      });

      window.it("should set ID", () => {
        _givenTreeview();
        window.expect(_treeview.ID).toBe("testID");
      });

      window.it("should create tree structure", () => {
        _givenTreeview();
        window.expect(_treeview.TreeItems.length).toBe(3);
        window.expect(_treeview.TreeItems[0].HasChildren).toBe(true);
        window.expect(_treeview.TreeItems[0].Children.length).toBe(2);
        window.expect(_treeview.TreeItems[1].HasChildren).toBe(false);
        window.expect(_treeview.TreeItems[1].Children.length).toBe(0);
        window.expect(_treeview.TreeItems[2].HasChildren).toBe(false);
        window.expect(_treeview.TreeItems[2].Children.length).toBe(0);
      });

      window.it("should get node status from cache", () => {
        _givenTreeview();
        window.expect(_getValueCalls.length).toBe(_someItems.length + 1);
      });

      window.it("should open all nodes if tree is expanded and no nodes cached", () => {
        _givenCachedValues(false, []);
        _givenTreeview();
        window.expect(_treeview.TreeItems[0].Collapsed).toBe(false);
      });

      window.it("should open cached nodes if tree is collapsed", () => {
        _givenCachedValues(true, [1]);
        _givenTreeview();
        window.expect(_treeview.TreeItems[0].Collapsed).toBe(false);
      });

      window.it("should close cached nodes if tree is expanded", () => {
        _givenCachedValues(false, [1]);
        _givenTreeview();
        window.expect(_treeview.TreeItems[0].Collapsed).toBe(true);
      });

      window.it("should toggle all", () : void => {
        _givenTreeview();
        _whenToggleAll();
        window.expect(_treeview.TreeItems[0].Collapsed).toBe(false);
        _whenToggleAll();
        window.expect(_treeview.TreeItems[0].Collapsed).toBe(true);
      });

      window.it("should set cache on toggle all", () : void => {
        _givenTreeview();
        _whenToggleAll();
        window.expect(_setValueCalls.length).toBe(2);
        window.expect(_setValueCalls[0].ID).toBe("testID");
        window.expect(_setValueCalls[0].Property).toBe(_stateManager.CachedProperties.AllCollapsed);
        window.expect(_setValueCalls[0].Value).toBe(false);
        window.expect(_setValueCalls[1].ID).toBe("testID");
        window.expect(_setValueCalls[1].Property).toBe(_stateManager.CachedProperties.CachedNodes);
        window.expect(_setValueCalls[1].Value).toEqual([]);
      });

      window.describe("tree item", () : void => {

        window.beforeEach(() : void => {
          _givenTreeview();
          _givenTreeItem();
        });

        window.it("should toggle", () : void => {
          _whenToggleNode();
          window.expect(_treeItem.Collapsed).toBe(false);
        });

        window.it("should set status", () : void => {
          _whenToggleNode();
          window.expect(_setValueCalls.length).toBe(1);
          window.expect(_setValueCalls[0].ID).toBe("testID");
          window.expect(_setValueCalls[0].Property).toBe(_stateManager.CachedProperties.CachedNodes);
          window.expect(_setValueCalls[0].Value).toEqual([1]);
        });

      });

    });

    window.describe("cache service", () : void => {

      const _givenCacheService = (cachedData: string = null) : void => {
        window.angular.mock.module("treeview.mock.window");
        window.inject(["cacheServiceProvider", (cacheServiceProvider: ICacheServiceProvider) => {
          _window = cacheServiceProvider.GlobalScope;
          if (cachedData) _window.localStorage.TreeviewCache = cachedData;
          _stateManager = cacheServiceProvider.GetStateManagerInstance();
        }]);
      };

      const _whenGetValue = (id: string, property: string, defaultValue: any) : any => {
        _thenResult = _stateManager.GetValue(id, property, defaultValue);
      };

      const _whenSetValue = (id: string, property: string, value: any) : void => {
        _stateManager.SetValue(id, property, value);
        _thenResult = JSON.parse(_window.localStorage.TreeviewCache);
      };

      window.beforeEach(() : void => {
        _stateManager = null
        _window = null;
        _thenResult = null;        
      });

      window.it("should be instantiated", () : void => {
        _givenCacheService();
        window.expect(_window).not.toBe(null);
        window.expect(_stateManager).not.toBe(null);
      });

      window.it("should save value to local storage on SetValue", () : void => {
        _givenCacheService();
        _whenSetValue("SomeID", "SomeProperty", "SomeValue");
        window.expect(_thenResult.SomeID.SomeProperty).toBe("SomeValue");
      });

      window.it("should pull value from local storage on GetValue", () : void => {
        _givenCacheService("{\"SomeID\":{\"SomeProperty\":\"SomeValue\"}}");
        _whenGetValue("SomeID", "SomeProperty", "");
        window.expect(_thenResult).toBe("SomeValue");
      });

      window.it("should return default value if property not in cache on GetValue", () : void => {
        _givenCacheService();
        _whenGetValue("SomeID", "SomeProperty", "SomeDefaultValue");
        window.expect(_thenResult).toBe("SomeDefaultValue");
      });

    });

  });

})(this);