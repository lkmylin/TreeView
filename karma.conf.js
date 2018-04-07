module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],
    browsers: ["PhantomJS"],
    files: ["./Test/treeview.test.min.js"]
  });
};