/* eslint operator-linebreak: 0 */
/* eslint comma-dangle: 0 */
const head = require('lodash.head');
const tail = require('lodash.tail');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssnano = require('cssnano');
const debug = require('debug');
// const config = require('./config');

debug.enable('app:*');

const log = debug('app:webpack');

// Environment
const NODE_ENV = process.env.NODE_ENV || 'development';
const DEVELOPMENT = NODE_ENV === 'development';
const TESTING = NODE_ENV === 'test';
const PRODUCTION = NODE_ENV === 'production';
const __DEBUG__ = DEVELOPMENT;
log(`Starting in ${ NODE_ENV } mode.`);

// Webpack scss handling setup
const loaderOrLoaders = DEVELOPMENT ? 'loader' : 'use';
log(`SCSS webpack ${ loaderOrLoaders } enabled.`);
/* Any .scss file in ./src/... *except* those in ./src/styles/
 * are local css modules. the class names and ids will be changed to:
 * [name]-[local]-[hash:base64:5] */
const devLoaders = {
  test: /\.scss$/,
  exclude: path.resolve(__dirname, 'src', 'styles'),
  include: [
    path.resolve(__dirname, 'src', 'components'),
    path.resolve(__dirname, 'src', 'containers'),
    path.resolve(__dirname, 'src', 'pages')
  ],
  // include: /src\/(?!styles).+/,
  use: [
    'style',
    'css?modules&sourceMap&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]',
    'postcss',
    'sass',
  ]
};
const prodLoader = {
  test: /\.scss$/,
  exclude: path.resolve(__dirname, 'src', 'styles'),
  include: [
    path.resolve(__dirname, 'src', 'components'),
    path.resolve(__dirname, 'src', 'containers'),
    path.resolve(__dirname, 'src', 'pages')
  ],
  // include: /src\/(?!styles).+/,
  loader: ExtractTextPlugin.extract(
    { fallbackLoader: 'style-loader',
      loader: 'css-loader?' +
      'modules&sourceMap&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]&sourceMap?' +
      'postcss?' +
      'sass?' +
      'sourceMap?',
    }
  )
};
const scssLoader = DEVELOPMENT ? devLoaders : prodLoader;

const devCompiler = {
  hash_type: 'hash',
  stats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  },
};
const prodCompiler = {
  hash_type: 'chunkhash',
  stats: {
    chunks: true,
    chunkModules: true,
    colors: true,
  },
};
const webpackCompiler = DEVELOPMENT ? devCompiler : prodCompiler;

const devTool = 'cheap-module-eval-source-map';
const prodTool = 'source-map';
const webpackDevTools = DEVELOPMENT ? devTool : prodTool;

const devPublicPath = '/';
const prodPublicPath = '/';
const webpackPublicPath = DEVELOPMENT ? devPublicPath : prodPublicPath;

// Webpack configuration
log('Creating webpack configuration...');
const webpackconfig = {
  entry: {
    app: ['./src/app'],
    vendor: [
      'react',
      'react-redux',
      'react-router',
      'react-intl',
      'redux',
      'redux-form',
      'react-router-redux',
      'react-bootstrap',
      'react-router-bootstrap',
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `[name].[${ webpackCompiler.hash_type }].js`,
    publicPath: webpackPublicPath,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        enforce: 'pre',
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      scssLoader,
      /* Any .scss files in ./src/styles are treated as normal (not local)
       * sass files, and so class names and ids will remain as specified */
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src', 'styles'),
        loader: 'style!css!postcss!sass',
      },
      // File loaders
      /* eslint-disable */
      {
        test: /\.woff(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'file?prefix=fonts/&name=[path][name].[ext]'
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=8192'
      },
      /* eslint-enable */
    ],
  },

  devtool: webpackDevTools,

  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, 'src')
    ],

    extensions: ['.js', '.json', '.jsx', '.css', '.scss'],

    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
  },

  plugins: [
    new webpack.DefinePlugin({ DEVELOPMENT, PRODUCTION, __DEBUG__ }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      hash: true,
      favicon: path.join(__dirname, 'src', 'static', 'favicon.png'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.xxx$/, // may apply this only for some modules
      options: {
        postcss: [
          cssnano({
            sourcemap: true,
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            safe: true,
            discardComments: {
              removeAll: true,
            },
          }),
        ],
        sassLoader: {
          resolveLoader: path.join(__dirname, 'src', 'styles'),
        },
        eslint: {
          configFile: path.join(__dirname, '.eslintrc'),
        },
      }
    })
  ],
};

if (!TESTING) {
  webpackconfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor'],
  }));
}

if (DEVELOPMENT) {
  log('Extending webpack configuration with development settings.');

  log('Adding HMR entry points.');
  webpackconfig.entry.app.unshift(
    'webpack-hot-middleware/client',
    'react-hot-loader/patch'
  );

  log('Enable development plugins (HMR, NoErrors).');
  webpackconfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
}

if (PRODUCTION) {
  log('Extending webpack configuration with production settings.');

  log('Add uglify and dedupe plugins.');
  webpackconfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      },
    }),
    new webpack.optimize.DedupePlugin()
  );

  log('Apply ExtractTextPlugin to CSS loaders.');
  webpackconfig.module.rules.filter(loader =>
    loader.use && loader.use.find(name => /css/.test(name.split('?')[0]))
  ).forEach(loader => {
    /* eslint-disable */
    const first = head(loader.use);
    const rest = tail(loader.use);
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete loader.use;
    /* eslint-enable */
  });
  webpackconfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css')
  );
}

module.exports = webpackconfig;
