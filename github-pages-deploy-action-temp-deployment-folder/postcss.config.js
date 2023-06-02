// required to run:
// npx postcss -o style.css styleOrigin.css

module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['> 2%'],
      cascade: false
    })
  ]
};
