var gulp = require('gulp');
var webserver = require('gulp-webserver');
var fs = require('fs');
var path = require('path');
var url = require('url');
var date = require('./public/data/data.json');
gulp.task('webserver', function() {
    return gulp.src('public')
        .pipe(webserver({
            port: 9090,
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/') {
                    res.end(fs.readFileSync(path.join(__dirname, 'public', 'index.html')));
                } else if (pathname === '/favicon.ico') {
                    res.end('');
                } else if (pathname === '/sortlist') { //渲染页面与排序功能
                    var query = url.parse(req.url, true).query;
                    var search = query.search
                    var texts = [];
                    date.map(function(item) {
                        if (item.title.indexOf(search) != -1) {
                            texts.push(item);
                        }
                    });
                    console.log(query.data);
                    var newarr = [];
                    if (query.data == "nmobl") {
                        newarr = texts;
                    } else if (query.data == "min") {
                        newarr = texts;
                        newarr.sort(function(a, b) {
                            return a.money.slice(1) - b.money.slice(1);
                        })

                    } else if (query.data == "max") {
                        newarr = texts;
                        newarr.sort(function(a, b) {
                            return b.money.slice(1) - a.money.slice(1);
                        })
                    } else if (query.data == "info") {
                        newarr = texts;
                        newarr.sort(function(a, b) {
                            return b.lien - a.lien;
                        })
                    } else if (query.data == "some") {
                        newarr = texts;
                        newarr.sort(function(a, b) {
                            console.log(a.num);
                            return b.num - a.num;
                        })
                    }
                    res.end(JSON.stringify(newarr));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'public', pathname)));
                }
            }
        }))
})