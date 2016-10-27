module.exports = {
  server: {
    hostname: 'bartekus.github.io/r3',
    port: 80,
  },

  webpack: {
    devtool: 'source-map',
    output: {
      publicPath: '/r3',
    },
  },

  compiler: {
    hash_type: 'chunkhash',
    stats: {
      chunks: true,
      chunkModules: true,
      colors: true,
    },
  },
};
