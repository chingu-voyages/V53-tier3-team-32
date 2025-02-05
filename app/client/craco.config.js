module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.module.rules.push({
          test: /\.js$/,
          enforce: 'pre',
          exclude: /node_modules\/react-datepicker/,
          use: ['source-map-loader'],
        });
        return webpackConfig;
      },
    },
  };