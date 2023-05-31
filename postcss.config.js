// required to run:
// npx postcss --use autoprefixer --autoprefixer.browsers "Firefox" -o style.css styleOrigin.css

module.exports = {
    plugins: [
      require('autoprefixer')({
        overrideBrowserslist: [
          "last 2 versions",
          "not dead",
          "not ie <= 11"
        ]
      })
    ]
  }