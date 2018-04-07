((window: IWindow) => {

  const treeviewModule = window.angular.module("treeview", []);

  treeviewModule.service("treeviewProvider", ["cacheServiceProvider", (cacheServiceProvider: CacheServiceProvider) : TreeviewProvider => {
    return new TreeviewProvider(cacheServiceProvider.GetStateManagerInstance());
  }]);

  treeviewModule.service("cacheServiceProvider", ["$window", ($window: IWindow) : CacheServiceProvider => {
    return new CacheServiceProvider($window);
  }]);

  treeviewModule.directive("treeview", () => {
    return {
      restrict: "E",
      templateUrl: "./Views/treeview.html",
      scope: {
        Data: "=data"
      }
    };
  });

  treeviewModule.directive("treeitem", () => {
    return {
      restrict: "E",
      templateUrl: "./Views/treeitem.html",
      scope: {
        Item: "=item"
      }
    };
  });

  class TreeviewProvider implements ITreeviewProvider {
    GetInstance: any;
    constructor(stateManager: StateManager) {
      this.GetInstance = (id: string, treeItems: Array<TreeItem>) => {
        return new Treeview(id, treeItems, stateManager);
      }
    }
  }

  class Treeview implements ITreeview {
    ID: string;
    TreeItems: Array<TreeItem>;
    Collapsed: boolean;
    StateManager: StateManager;
    ToggleAll(): void {
      const context = this;
      const toggleChildren = (items : Array<TreeItem>) => {
        items.forEach(item => {
          item.Collapsed = context.Collapsed;
          toggleChildren(item.Children);
        });
      };
      context.Collapsed = !context.Collapsed;      
      context.StateManager.SetValue(context.ID, context.StateManager.CachedProperties.AllCollapsed, context.Collapsed);
      context.StateManager.SetValue(context.ID, context.StateManager.CachedProperties.ExpandedNodes, []);
      toggleChildren(context.TreeItems);
    };
    IsNodeCollapsed(treeKey: number): boolean {
      const expandedNodes = this.StateManager.GetValue(this.ID, this.StateManager.CachedProperties.ExpandedNodes, []);
      if (expandedNodes.length === 0) return this.Collapsed;
      const filteredExpandedNodes = expandedNodes.filter((tk: number) => tk === treeKey);
      return filteredExpandedNodes.length === 0;
    };
    constructor (id: string, items : Array<TreeItem>, stateManager: StateManager) {
      const context = this;
      context.ID = id;
      context.TreeItems = [];
      context.Collapsed = stateManager.GetValue(id, stateManager.CachedProperties.AllCollapsed, true);
      context.StateManager = stateManager;
      items.forEach(item => {
        if (item.ParentKey === 0) {
          context.TreeItems[context.TreeItems.length] = new TreeItem(item, items, context);
        }
      });
    }
  }

  class TreeItem implements ITreeItem {
    RootScope: Treeview;
    TreeKey: number;
    ParentKey: number;
    Title: string;
    Collapsed: boolean;
    HasChildren: boolean;
    Children: Array<TreeItem>;
    ToggleNode(): void {
      const context = this;
      context.Collapsed = !context.Collapsed;
      var expandedNodes = context.RootScope.StateManager.GetValue(context.RootScope.ID, context.RootScope.StateManager.CachedProperties.ExpandedNodes, []);
      expandedNodes = expandedNodes.filter((tk: number) => tk !== context.TreeKey);
      if (!context.Collapsed) {
        expandedNodes[expandedNodes.length] = context.TreeKey;
      }
      context.RootScope.StateManager.SetValue(context.RootScope.ID, context.RootScope.StateManager.CachedProperties.ExpandedNodes, expandedNodes);
    };
    constructor (item: TreeItem, items: Array<TreeItem>, rootScope: Treeview) {
      const context = this;
      context.RootScope = rootScope;
      context.TreeKey = item.TreeKey;
      context.ParentKey = item.ParentKey;
      context.Title = item.Title;
      context.Collapsed = rootScope.IsNodeCollapsed(item.TreeKey);
      context.HasChildren = false;
      context.Children = [];
      items.forEach(i => {
        if (i.ParentKey === item.TreeKey) {
          context.HasChildren = true;
          context.Children[context.Children.length] = new TreeItem(i, items, rootScope);
        }
      });
    }
  }

  class CacheServiceProvider implements ICacheServiceProvider {
    GlobalScope: IWindow;
    GetStateManagerInstance() : StateManager {
      return new StateManager(this.GlobalScope);
    }
    constructor(globalScope: IWindow) {
      this.GlobalScope = globalScope;
    }
  }

  class StateManager implements IStateManager {
    GlobalScope: IWindow;
    CachedProperties: ICachedProperties;
    CurrentState: any;
    GetValue(controlID: string, property: string, defaultValue: any): any {
      if (!this.CurrentState[controlID]) this.CurrentState[controlID] = {};
      return typeof this.CurrentState[controlID][property] === "undefined" ? defaultValue : this.CurrentState[controlID][property];
    };
    SetValue(controlID: string, property: string, value: any): void {
      if (!this.CurrentState[controlID]) this.CurrentState[controlID] = {};
      this.CurrentState[controlID][property] = value;
      if (this.GlobalScope.localStorage) this.GlobalScope.localStorage.TreeviewCache = JSON.stringify(this.CurrentState);
    };
    constructor(globalScope: IWindow) {
      this.GlobalScope = globalScope;
      this.CurrentState = globalScope.localStorage && globalScope.localStorage.TreeviewCache ? JSON.parse(globalScope.localStorage.TreeviewCache) : {};
      this.CachedProperties = {
        AllCollapsed: "AllCollapsed",
        ExpandedNodes: "ExpandedNodes"
      }
    }
  }

})(this);

interface IWindow extends Window {
  angular: any;
  localStorage: any;
  describe(description: string, action: Function) : void;
  beforeEach(action: Function): void;
  it(description: string, action: Function): void;
  expect: any;
  inject(args: Array<any>): void;
}

interface ITreeview {
  ID: string;
  Collapsed: boolean;
  TreeItems: Array<ITreeItem>;
  StateManager: IStateManager;
  ToggleAll(): void;
  IsNodeCollapsed(treeKey: number): boolean;
}

interface ITreeviewProvider {
  GetInstance(id: string, treeItems: Array<ITreeItemPartial>): ITreeview;
}

interface ITreeItemPartial {
  TreeKey: number;
  ParentKey: number;
  Title: string;
}

interface ITreeItem extends ITreeItemPartial {
  RootScope: ITreeview;
  Collapsed: boolean;
  HasChildren: boolean;
  Children: Array<ITreeItem>;
  ToggleNode(): void;
}

interface IStateManager {
  GlobalScope: IWindow;
  CachedProperties: ICachedProperties;
  CurrentState: any;
  GetValue(controlID: string, property: string, defaultValue: any): any;
  SetValue(controlID: string, property: string, value: any): void;
}

interface ICacheServiceProvider {
  GlobalScope: IWindow;
  GetStateManagerInstance(): void;
}

interface ICachedProperties {
  AllCollapsed: string;
  ExpandedNodes: string;
}