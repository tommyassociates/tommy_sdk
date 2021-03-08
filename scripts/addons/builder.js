const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const entryPlus = require('webpack-entry-plus')

var fs = require('fs')
const glob = require('glob')
const path = require('path')
const helpers = require('../helpers')

function resolvePath(dir) {
  return path.join(__dirname, '..', '..', dir)
}

function resolveAddonPath(baseDir, ...dir) {
  return path.join(baseDir, ...dir)
}

function createConfig(pkg, version, localAddonFilePath) {
  const jsEntry = `addons/${pkg}/${version}/build/addon`

  return {
    mode: process.env.NODE_ENV, // 'development'
    devtool: false,
    entry: {
      [jsEntry]: resolveAddonPath(localAddonFilePath, `addons/${pkg}/${version}/src/addon.js`),
    },
    output: {
      filename: '[name].js',
      path: resolveAddonPath(localAddonFilePath, ''),
      libraryTarget: 'var',
      library: 'addon',
      // iife: true,
      // module: false,
      // libraryTarget: 'commonjs',
      // libraryExport: 'addon'
      // publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolveAddonPath(localAddonFilePath, 'addons/${pkg}/${version}/src'),
      },
      modules: [
        resolvePath('node_modules'),
        resolvePath('node_modules/tommy-core'),
      ]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          // include: [
          //   resolvePath('addons'),
          //   resolvePath('node_modules/tommy-core'),
          //   resolvePath('node_modules/framework7'),
          //   resolvePath('node_modules/framework7-vue'),
          //   resolvePath('node_modules/template7'),
          //   resolvePath('node_modules/dom7'),
          //   resolvePath('node_modules/ssr-window'),
          // ],
        },
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            // {
            //   loader: 'file-loader',
            //   options: {
            //     name: (name) => cssOutputPath(name, localAddonFilePath)
            //     // name: '[path][name].css',
            //   }
            // },
            // {
            //     loader: 'postcss-loader'
            // },
            'sass-loader'
          ]
        },
        // {
        //   test: /\.scss$/,
        //   use: [
        //     {
        //       loader: 'file-loader',
        //       options: {
        //         // name: 'dist/css/[name].css',
        //         // name: '[path][name].css',
        //         // name: '[name].css',
        //         name: 'addons/availability/1.0.0/build/addon.css',
        //       }
        //     },
        //     {
        //         loader: 'extract-loader'
        //     },
        //     {
        //         loader: 'css-loader?-url'
        //         // loader: 'css-loader'
        //     },
        //     // {
        //     //     loader: 'postcss-loader'
        //     // },
        //     {
        //       loader: 'sass-loader'
        //     }
        //   ]
        // }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(helpers.getSdkVariables()),
      new MiniCssExtractPlugin({
        // filename: (pathData) => {
        //   console.log('css', pathData.chunk.name)
        //   return pathData.chunk.name
        // },
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     compress: {
      //       // warnings: false
      //     }
      //   },
      //   sourceMap: true,
      //   parallel: true
      // }),
      // new OptimizeCSSPlugin({
      //   cssProcessorOptions: {
      //     safe: true,
      //     map: { inline: false }
      //   }
      // }),
      // new webpack.HotModuleReplacementPlugin(),
      // new webpack.NamedModulesPlugin(),
      new VueLoaderPlugin(),
      // new webpack.HashedModuleIdsPlugin(),
      // new webpack.optimize.ModuleConcatenationPlugin(),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [resolveAddonPath(localAddonFilePath, `addons/${pkg}/${version}/build/addon.*`)],
        cleanAfterEveryBuildPatterns: [resolveAddonPath(localAddonFilePath, `addons/${pkg}/${version}/build/addon.css.js`)],
        dry: false,
        dangerouslyAllowCleanPatternsOutsideProject: true
      })
    ]
  }
}

module.exports = function(pkg, version) {
  const localAddonFilePath = helpers.getLocalAddonFilePath('', '', '..') // ex. tommy-sdk-private

  return new Promise((resolve, reject) => {
    console.error('addon building', pkg, version, 'in', process.env.NODE_ENV)
    const config = createConfig(pkg, version, localAddonFilePath)
    const compiler = webpack(config)
    compiler.run((err, stats) => {
      if (err) {
        console.error('addon compile failed', pkg, version)
        console.error(err.stack || err)
        if (err.details) {
          console.error(err.details)
        }
        reject(err)
        return;
      }

      const info = stats.toJson()
      if (stats.hasErrors()) {
        console.error('addon compile error:', info.errors)
        reject(info.errors)
        return;
      }

      if (stats.hasWarnings()) {
        console.warn('addon compile warning:', info.warnings)
      }

      console.log('addon compiled', pkg, version)

      // FIX: Addons need to be exported as a global variable to support old
      // builds, so we need to ensure the default module is exposed directly.
      const outputFile = resolveAddonPath(localAddonFilePath, `addons/${pkg}/${version}/build/addon.js`)
      fs.readFile(outputFile, 'utf8', function (err, data) {
        if (err) {
          return console.log(err)
        }

        const result = data.slice(0, -1) + '.default;'
        fs.writeFile(outputFile, result, 'utf8', function (err) {
           if (err) return console.log(err)
           resolve(stats) // success
        })
      })

      // resolve(stats)
    })
  })
}



// module.exports = {
//   buildAddon
// }

// const addonVersions = helpers.readLocalAddonVersions()
// const configs = []
//
// Object.keys(addonVersions).forEach((pkg) => {
//   const versions = addonVersions[pkg];
//   for (let i = 0; i < versions.length; i += 1) {
//     configs.push(createConfig(pkg, versions[i]))
//   }
// })
//
// const compiler = webpack(configs)
// const watching = compiler.watch({
//   aggregateTimeout: 300,
//   poll: undefined
// }, (err, stats) => {})
