((window: IWindow) => {

  var _treeview: ITreeview;
  var _getValueCalled: boolean;
  var _getValueCount: number;
  var _getValueID: string;
  var _getValueProperty: string;
  var _getValueReturn: any;
  var _setValueCalled: boolean;
  var _setValueID: string;
  var _setValueProperty: string;
  var _setValueValue: any;
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
    return {};
  });

  window.angular.module("treeview.mock.cache", []).service("cacheServiceProvider", ["$window", ($window: IWindow) : ICacheServiceProvider => {
    return {
      GlobalScope: $window,
      GetStateManagerInstance: () : IStateManager => {
        return {
          GlobalScope: $window,
          CachedProperties: {
            "AllCollapsed": "AllCollapsed",
            "ExpandedNodes": "ExpandedNodes"
          },
          CurrentState: {},
          GetValue: (id: string, property: string, defaultValue :any) => {
            _getValueCalled = true;
            _getValueCount += 1;
            _getValueID = id;
            _getValueProperty = property;
            return _getValueReturn || defaultValue;
          },
          SetValue: (id: string, property: string, value: any) => {
            _setValueCalled = true;
            _setValueID = id;
            _setValueProperty = property;
            _setValueValue = value;
          }
        };
      }
    };
  }]);

  window.describe("treeview module", () => {
    
    window.beforeEach(() => {
      window.angular.mock.module("treeview");
      _treeview = null;
      _getValueCalled = false;
      _getValueCount = 0;
      _getValueID = null;
      _getValueProperty = null;
      _getValueReturn = null;
      _setValueCalled = false;
      _setValueID = null;
      _setValueProperty = null;
      _setValueValue = null;
    });    

    window.describe("treeview provider", () => {

      const givenTreeview = () => {
        window.angular.mock.module("treeview.mock.window");
        window.angular.mock.module("treeview.mock.cache");
        window.inject(["treeviewProvider", (treeviewProvider: ITreeviewProvider) => {
          _treeview = treeviewProvider.GetInstance("testID", _someItems);
        }]);
      };

      window.beforeEach(() => {
        givenTreeview();
      });      

      window.it("should be instantiated", () => {
        window.expect(_treeview).not.toBe(null);        
      });

      window.it("should set ID", () => {
        window.expect(_treeview.ID).toBe("testID");
      });

      window.it("should create tree structure", () => {
        window.expect(_treeview.TreeItems.length).toBe(3);
        window.expect(_treeview.TreeItems[0].HasChildren).toBe(true);
        window.expect(_treeview.TreeItems[0].Children.length).toBe(2);
        window.expect(_treeview.TreeItems[1].HasChildren).toBe(false);
        window.expect(_treeview.TreeItems[1].Children.length).toBe(0);
        window.expect(_treeview.TreeItems[2].HasChildren).toBe(false);
        window.expect(_treeview.TreeItems[2].Children.length).toBe(0);
      });

      window.it("should get node status from cache", () => {
        window.expect(_getValueCount).toBe(_someItems.length + 1);
      });

    });

  });

})(this);