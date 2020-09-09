const { createMacro } = require('babel-plugin-macros');
const imageSize = require('image-size');
const path = require('path');

const autoBg = createMacro(autoBgMacro, {
  configName: 'autoBg'
});

module.exports = autoBg;

function vw(px, base = 750, unit = true) {
  return (Math.round(px) / base) * 100 + (unit ? 'vw' : '');
}

function getImgSysPath(baseUrl, filePath) {
  /* 
    ./path/to/img.png
    ../../path/to/img.png
    ~@/path/to/img.png (vue-cli alias)
    ~path/to/img.png (cra with jsconfig)
    =>
    path/to/img.png
   */
  const fixedPath = filePath
    .replace(/(\.{1,2})+\//g, '')
    .replace(/^~?@?\/?/, '');
  return path.resolve(process.cwd(), baseUrl, fixedPath);
}

const defaultConfig = {
  baseUrl: './src',
  vwBase: 750
};

function autoBgMacro({ references, state, babel, config }) {
  const { default: defaultImport = [] } = references;

  function getArgPath(referencePath) {
    try {
      return referencePath.parentPath.get('arguments')[0].evaluate().value;
    } catch (e) {
      throw e;
    }
  }

  function valueToAstNode(val) {
    try {
      return babel.parse(`var str = \`${val}\``).program.body[0].declarations[0]
        .init;
    } catch (e) {
      throw e;
    }
  }

  const finalConfig = {
    ...defaultConfig,
    ...config
  };

  defaultImport.forEach(referencePath => {
    if (referencePath.parentPath.type === 'CallExpression') {
      if (referencePath === referencePath.parentPath.get('callee')) {
        const imgPath = getArgPath(referencePath);
        const imgSysPath = getImgSysPath(finalConfig.baseUrl, imgPath);
        const size = imageSize(imgSysPath);
        referencePath.parentPath.replaceWith(
          valueToAstNode(
            [
              `background-image: url("\${require('${imgPath}')}");`,
              `background-size: 100%;`,
              `background-repeat: no-repeat;`,
              `width: ${vw(size.width, finalConfig.vwBase)};`,
              `height: ${vw(size.height, finalConfig.vwBase)};`
            ].join('\n')
          )
        );
      } else {
        throw Error(`use this macro like: autoBg('path/to/img.png')`);
      }
    } else {
      throw Error(`use this macro like: autoBg('path/to/img.png')`);
    }
  });
}
