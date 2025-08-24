const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "process": require.resolve("process/browser.js"), // Nota el .js añadido
    "stream": require.resolve("stream-browserify"),
    "vm": require.resolve("vm-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "buffer": require.resolve("buffer/"),
    "util": require.resolve("util/")
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js', // Cambiado a la ruta completa
      Buffer: ['buffer', 'Buffer']
    })
  ]);

  // Añade esto para manejar archivos .mjs
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false // Permite omitir la extensión en imports
    }
  });

  return config;
};