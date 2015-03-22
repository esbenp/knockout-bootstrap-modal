var gulp = require("gulp");
var umd = require("gulp-umd");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var concat = require("gulp-concat-util");

var finalFileName = "knockout-bootstrap-modal.js"

gulp.task("concat", function() {
    return gulp.src("src/js/*.js")
            .pipe(concat(finalFileName, {newLine: '\n\n'}))
            .pipe(concat.header("if (typeof KnockoutBootstrapModal === \"undefined\") { var KnockoutBootstrapModal = {}; }\n\n"))
            .pipe(gulp.dest("dist/js"))
});

gulp.task("umd", ["concat"], function() {
    return gulp.src("dist/js/" + finalFileName)
        .pipe(umd({
            dependencies: function(file) {
                return [
                    {
                        name: "jquery",
                        amd: "jquery",
                        cjs: "jquery",
                        global: "jQuery",
                        param: "$"
                    },
                    {
                        name: "knockout",
                        amd: "knockout",
                        cjs: "knockout",
                        global: "ko",
                        param: "ko"
                    },
                    {
                        name: "bootstrap",
                        amd: "bootstrap",
                        cjs: "bootstrap",
                        global: "jQuery",
                        param: "bootstrap"
                    },
                    {
                        name: "html",
                        amd: "text!knockout-bootstrap-modal-html",
                        cjs: "text!knockout-bootstrap-modal-html",
                        global: "KnockoutBootstrapModalHtml",
                        param: "html"
                    },
                    {
                        name: "require",
                        amd: "require",
                        cjs: "require",
                        global: "jQuery",
                        param: "require"
                    }
                ];
            },
            exports: function(file) {
                return 'KnockoutBootstrapModal.Modal';
            },
            namespace: function(file) {
                return 'KnockoutBootstrapModal';
            }
        }))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("html", function(){
    return gulp.src("src/html/*")
            .pipe(gulp.dest("dist/html"));
});

gulp.task("production", ["concat", "umd", "html"], function(){
    return gulp.src("dist/js/" + finalFileName)
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"))
});

gulp.task("dev", function(){
    gulp.watch("src/**/*.js", ["concat", "umd"])
    gulp.watch("src/**/*.html", ["html"]);
});

gulp.task("default", ["concat", "umd", "html"]);