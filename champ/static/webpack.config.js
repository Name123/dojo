var path = require ('path');

module.exports = {
  "output": {
    "filename": "[name].pack.js"
  },
  "module": {
    "rules": [
      {
        "use": {
          "loader": "babel-loader",
          "options": {
            "presets": [
              "babel-preset-env",
              "babel-preset-react"
            ]
          }
        },
        "exclude": /node_modules/,
        "test": /\.js$/
      },
      {
        'test': /\.(scss|css)$/,
        'include': [
          path.resolve(__dirname, "src/scss/"),
          path.resolve(__dirname, "node_modules/react-datepicker/dist/")
        ],
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  "entry": {
    "index": "./index"
  }
};