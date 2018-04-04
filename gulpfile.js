const gulp = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const changed = require("gulp-changed");
const watch = (require("gulp-chokidar"))(gulp)
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

errorHandler = function (error) {
  console.log(error);
  this.emit("end");
};

gulp.task("ts", function () {
  tsProject.src()
    .pipe(plumber({handleError: errorHandler}))
    .pipe(ts(tsProject))
    .js
    .pipe(gulp.dest("."));
});

gulp.task("minify", function () {
  gulp.src(["treeview.js"])
    .pipe(uglify({mangle: false}))
    .pipe(concat("treeview.min.js"))
    .pipe(gulp.dest("."));
});

gulp.task("watch", function () {
  watch("./treeview.ts", ["ts"]);
  watch("./treeview.js", ["minify"]);
});