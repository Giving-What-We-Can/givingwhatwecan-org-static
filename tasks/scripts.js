require('dotenv').load({silent: true})
console.log('Building Javascript files')

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const cp = Promise.promisify(require('ncp').ncp)
const rm = Promise.promisify(require('rimraf'))
const recursive = Promise.promisify(require('recursive-readdir'))

const Browserify = require('browserify')
const uglify = require('uglify-js')
const exorcist = require('exorcist')
const streamToPromise = require('stream-to-promise')

const minimatch = require('minimatch')

const SOURCE_PATH = path.join(__dirname, '..', 'src', 'scripts')
const DESTINATION_PATH = path.join(__dirname, '..', 'src', 'metalsmith', 'scripts')
const BUILD_PATH = path.join(__dirname, '..', 'dest', 'scripts')

// clear directory out

const isBundle = minimatch.filter('**/*.bundle.js')
const isNotBundle = minimatch.filter('**/*!.bundle.js')
const isJS = minimatch.filter('**/*.js')

;(function () {
  console.log('Clearing directory...')
  return rm(DESTINATION_PATH)
    .then(() => fs.mkdir(DESTINATION_PATH))
    .then(() => cp(path.join(SOURCE_PATH, 'includes'), path.join(DESTINATION_PATH, 'includes')))
    .then(() => fs.readdirAsync(SOURCE_PATH))
    .then(fileNames => {
      // Bundle files
      const bundleFileNames = fileNames.filter(isBundle)
      console.log('Bundling files with browserify...')
      return Promise.all(bundleFileNames.map(createBundle))
    })
    .then(() => recursive(DESTINATION_PATH))
    .then(fileNames => {
      const javascriptFileNames = fileNames.filter(isJS)
      console.log('Minifying all files...')
      return Promise.all(javascriptFileNames.map(minify))
      // return Promise.all(file)
    })
    .then(() => {
      if (process.env.NODE_ENV !== 'development') return
      return fs.readdirAsync(BUILD_PATH)
        .then(() => cp(DESTINATION_PATH, BUILD_PATH))
        .catch(err => {
          if (err.code === 'ENOENT') return
          throw err
        })
    })
    .then(() => console.info('Done!'))
    .catch(err => console.error(err))
})()

function createBundle (bundleFileName) {
  console.log('Bundling', bundleFileName)
  const outFileName = bundleFileName.replace('.bundle', '')
   // start browserify
  const browserify = Promise.promisifyAll(new Browserify({debug: true}))
    // add the entry file to the queue
  browserify.add(path.join(SOURCE_PATH, bundleFileName))
  // add minifier / sourcemap generator
  browserify.transform('uglifyify')
  // call the main bundle function
  return streamToPromise(
    browserify.bundle()
    .pipe(exorcist(path.join(DESTINATION_PATH, `${outFileName}.map`)))
    .pipe(fs.createWriteStream(path.join(DESTINATION_PATH, outFileName), 'utf8'))
  )
}

function minify (filePath) {
  const outFilePath = filePath.replace('.js', '.min.js')
  const mapFilePath = `${outFilePath}.map`
  const outFileName = path.basename(outFilePath)
  const mapFileName = path.basename(mapFilePath)
  return Promise.all([
    fs.readFileAsync(filePath),
    fs.readFileAsync(`${filePath}.map`).catch(err => {
      if (err.code === 'ENOENT') return undefined
      else throw err
    })
  ])
    .then(([code, sourceMap]) => {
      console.log(`Minified ${path.basename(filePath)}`)
      const sourceMapOptions = {
        filename: outFileName,
        url: mapFileName
      }
      if (sourceMap) sourceMapOptions.content = sourceMap.toString()
      return uglify.minify(code.toString(), {
        sourceMap: sourceMapOptions
      })
    })
    .then(({code, map}) => Promise.all([
      fs.writeFileAsync(outFilePath, code),
      fs.writeFileAsync(mapFilePath, map)
    ]))
}

//       if (err) throw err
//       // do a straight copy of 'includes' directory
//       console.log('Copying `includes` directory...')
//         if (err) throw err
//         console.log('Copied')
//         // browserify all `bundles` files
//         fs.readdir(srcPath, function (err, files) {
//           each(, bundle, function (err) {
//             if (err) throw err
//             if (err) throw err
//             console.log('All files bundled')
//             // create minified versions of all files
//             recursive(destPath, function (err, files) {
//               if (err) throw err
//               console.log('Minifying files...')
//               each(files.filter(minimatch.filter('**/*.js')), minify, function (err) {
//                 if (err) throw err
//                 console.log('All files minified')
//                 // copy to the 'dest' directory if needed
//                 if (process.env.ENV !== 'production') {
//                   fs.readdir(builtPath, function (err) {
//                     if (err) {
//                       return
//                     }
//                     cp(destPath, path.join(builtPath, 'scripts'), function () {
//                       console.log('Updated /dest directory with latest scripts...')
//                     })
//                   })
//                 }
//               })
//             })
//           })
//         })
//       })
//     })
//   })

// function bundle (file, cb) {
//   console.log('Bundling', file)
//     // the output filename of our bundle
//   const outFile = file.replace('.bundle', '')
//     // the output filename of our sourcemap
//   const mapFile = file.replace('.bundle.js', '.js.map')
//     // get an absolute path to the file
//   const entryFile = path.join(srcPath, file)
//     // start browserify
//   const browserify = new Browserify({debug: true})
//     // add the entry file to the queue
//   browserify.add(entryFile)
//     // add minifier / sourcemap generator
//   browserify.plugin('minifyify', {map: '/' + mapFile, minify: minify})
//     // call the main bundle function

//   })
// }

// function minify (file, cb) {
//   console.log('Minifying', path.basename(file))
//   const outFile = file.replace('.js', '.min.js')
//   const mapFile = file.replace('.js', '.min.js.map')

//   const minified = uglify.minify(file, {
//     outSourceMap: path.basename(mapFile)
//   })
//   fs.writeFile(outFile, minified.code, function (err) {
//     if (err) throw err
//     console.log('+ Wrote', path.basename(outFile))
//     fs.writeFile(mapFile, minified.map, function (err) {
//       if (err) throw err
//       console.log('+ Wrote', path.basename(outFile))
//       cb()
//     })
//   })
// }
