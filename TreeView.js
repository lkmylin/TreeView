(function() {

    var treeviewModule = angular.module("treeviewModule", []);

    treeviewModule.service("treeviewProvider", function () {
        this.Treeview = function (data) {
            this.TreeItems = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].ParentKey === 0) {
                    this.TreeItems[this.TreeItems.length] = new TreeItem(data[i], data);
                }
            }
        };
        return this;
    });

    treeviewModule.directive("treeview", function () {
        return {
            templateUrl: "Views/treeview.html",
            restrict: "E",
            scope: {
                Items: "=items"
            }
        }
    });

    treeviewModule.directive("treeitem", function () {
        return {
            templateUrl: "Views/treeitem.html",
            restrict: "E",
            scope: {
                Item: "=item"
            }
        }
    });

    var TreeItem = function (item, items) {
        this.TreeKey = item.TreeKey
        this.Title = item.Title;
        this.ParentKey = item.ParentKey;
        this.Children = [];
        this.HasChildren = false;
        this.IsNodeOpen = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i].ParentKey === item.TreeKey) {
                this.HasChildren = true;
                this.Children[this.Children.length] = new TreeItem(items[i], items);
            }
        }
    };
    TreeItem.prototype.ToggleNode = function () {
        this.IsNodeOpen = !this.IsNodeOpen;
    };

})();