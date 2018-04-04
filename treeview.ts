(() => {

  const treeviewModule = angular.module("treeviewModule", []);

  treeviewModule.service("treeviewProvider", [() => {
    this.GetInstance = (items: Array<TreeItem>) => {
      return new Treeview(items);
    };
    return this;
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

  class Treeview {
    TreeItems: Array<TreeItem>;
    Collapsed: boolean;
    ToggleAll(): void {
      const context = this;
      const toggleChildren = (items : Array<TreeItem>) => {
        items.forEach(item => {
          item.Collapsed = context.Collapsed;
          toggleChildren(item.Children);
        });
      };
      this.Collapsed = !this.Collapsed;
      toggleChildren(this.TreeItems);
    };
    constructor (items : Array<TreeItem>) {
      const context = this;
      this.TreeItems = [];
      this.Collapsed = true;
      items.forEach(item => {
        if (item.ParentKey === 0) {
          context.TreeItems[context.TreeItems.length] = new TreeItem(item, items);
        }
      });
    }
  }

  class TreeItem {
    TreeKey: number;
    ParentKey: number;
    Title: string;
    Collapsed: boolean;
    HasChildren: boolean;
    Children: Array<TreeItem>;
    ToggleNode(): void {
      this.Collapsed = !this.Collapsed;
    };
    constructor (item: TreeItem, items: Array<TreeItem>) {
      this.TreeKey = item.TreeKey;
      this.ParentKey = item.ParentKey;
      this.Title = item.Title;
      this.Collapsed = true;
      this.HasChildren = false;
      this.Children = [];
      items.forEach(i => {
        if (i.ParentKey === item.TreeKey) {
          this.HasChildren = true;
          this.Children[this.Children.length] = new TreeItem(i, items);
        }
      });
    }
  }

})();