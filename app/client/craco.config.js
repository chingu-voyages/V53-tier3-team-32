module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add an ignore pattern for react-datepicker warnings
      webpackConfig.ignoreWarnings = [
        {
          module: /react-datepicker/,
        },
        {
          message: /Failed to parse source map/,
        },
      ];

      // Keep existing rule for source-map-loader
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules\/react-datepicker/,
        use: ["source-map-loader"],
      });

      return webpackConfig;
    },
  },
};
