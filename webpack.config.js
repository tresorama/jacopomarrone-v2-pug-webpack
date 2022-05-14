const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: './dist',
    watchFiles: ['src/**/*'],
  },
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    // When webpack encounters a .css file ...
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // When webpack encounters a .pug file ...
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      },
      // When webpack encounters a .scss/.sass file ...
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    // Copy 'src/public' folder contents to 'dist', to be served as static files
    new CopyPlugin({
      patterns: [
        { from: "src/public", to: "." },
      ],
    }),
    // Copy html pages to 'dist'
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.pug'
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'calcola-guadagno.html',
    //   template: 'src/pages/calcola-guadagno.html',
    // }),
    // new HtmlWebpackPlugin({
    //   filename: 'oggetti-che-si-vendono-velocemente.html',
    //   template: 'src/pages/oggetti-che-si-vendono-velocemente.html',
    // }),
  ],

};
