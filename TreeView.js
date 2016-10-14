/// <reference path="angular.min.js" />

var treeViewApp = angular.module("treeViewApp", []);

treeViewApp.component("treeView", {
    templateUrl: "Views/TreeView.html",
    controller: ["$http", function (http) {
        var context = this;
        context.TreeItems = [];
        http.get("JavaScript/TreeItems.json").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].ParentKey === 0) {
                    context.TreeItems[context.TreeItems.length] = new TreeItem(response.data[i], response.data);
                }
            }            
        });
    }]
});

treeViewApp.component("treeItem", {
    templateUrl: "Views/TreeItem.html",
    controller: ["$scope", "$http", function (scope, http) {
        var context = this;
        context.TreeKey = scope.$parent.item.TreeKey;
        context.Title = scope.$parent.item.Title;
        context.ParentKey = scope.$parent.item.ParentKey;
        context.HasChildren = scope.$parent.item.HasChildren;
        context.Children = scope.$parent.item.Children;
        context.IsNodeOpen = false;
        context.ToggleNode = function () {
            context.IsNodeOpen = !context.IsNodeOpen;
        };
    }]
});

var TreeItem = function (item, items) {
    this.TreeKey = item.TreeKey
    this.Title = item.Title;
    this.ParentKey = item.ParentKey;
    this.Children = [];
    this.HasChildren = false;
    for (var i = 0; i < items.length; i++) {
        if (items[i].ParentKey === item.TreeKey) {
            this.HasChildren = true;
            this.Children[this.Children.length] = new TreeItem(items[i], items);
        }
    }
}
