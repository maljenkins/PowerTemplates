const gulp = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const sass = require("gulp-sass");
const prefix = require('gulp-autoprefixer');
const data = require("gulp-data");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync");
const server = browserSync.create();
const fs = require('fs');


const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  html: {
    src: 'src/templates/**/*'
  },
  data: {
    src: 'src/data/*.json'
  }
};


function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './dist/'
    }
  });
  done();
}

function getData(file) {
  return JSON.parse(fs.readFileSync(file));
}

function nunjucks(done) {
  gulp.src("./src/templates/*")
    .pipe(plumber())
    .pipe(data(getData('./src/data/global.json')))
    .pipe(
      nunjucksRender({
        path: ["./src/templates/"],
      })
    )
    .pipe(gulp.dest("./dist/"));
  done();
}

function style(done) {
  gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefix())
    .pipe(gulp.dest(paths.styles.dest));
  done();
}



const watch = () => gulp.watch([paths.styles.src, paths.html.src, paths.data.src], gulp.series(nunjucks, style, reload));

const dev = gulp.series(nunjucks, style, serve, watch);
exports.default = dev;