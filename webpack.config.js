const path = require('path');
const fs = require('fs');


var entries = []
file_path = path.resolve(__dirname, './assets')
fs.readdirSync(path.resolve(file_path)).forEach(function (file) {
  if (file.endsWith(".js")) {
    entries.push([file.split(".")[0], path.join(file_path, file)]);

  }
})
entry_map = new Map(entries);
const entry_obj = Object.fromEntries(entry_map);

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", 'css'],
  },
  entry: entry_obj,  // path to our input file
  output: {
    filename: '[name].js',  // output bundle file name
    path: path.resolve(__dirname, './static'),  // path to our Django static directory
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
    ]
  }
};

