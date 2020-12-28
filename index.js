const { createMacro } = require('babel-plugin-macros');
const imageSize = require('image-size');
const path = require('path');

const autobg = createMacro(autobgMacro, {
  configName: 'autobg'
});

module.exports = autobg;

function vw(px, base = 750, unit = true) {
  return (Math.round(px) / base) * 100 + (unit ? 'vw' : '');
}

function getImgSysPath(baseUrl, filePath, srcFile) {
  if (/^\./.test(filePath)) {
    return path.resolve(path.dirname(srcFile), filePath);
  }
  const fixedPath = filePath.replace(/^~?@?\/?/, '');
  return path.resolve(process.cwd(), baseUrl, fixedPath);
}

const defaultConfig = {
  baseUrl: './src',
  vwBase: 750,
  esModule: true
};

const usageErr = Error(
  `use \`autobg.macro\` this way: autobg('path/to/img.png')`
);

function autobgMacro({ references, state, babel, config }) {
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
        if (/^http/.test(imgPath)) {
          throw Error('image path should be relative');
        }
        const imgSysPath = getImgSysPath(
          finalConfig.baseUrl,
          imgPath,
          state.file.opts.filename
        );
        const size = imageSize(imgSysPath);
        referencePath.parentPath.replaceWith(
          valueToAstNode(
            [
              `background-image: url("\${require('${imgPath}')${
                finalConfig.esModule ? '?.default' : ''
              }}");`,
              `background-size: 100%;`,
              `background-repeat: no-repeat;`,
              `width: ${vw(size.width, finalConfig.vwBase)};`,
              `height: ${vw(size.height, finalConfig.vwBase)};`
            ].join('\n')
          )
        );
      } else {
        throw usageErr;
      }
    } else {
      throw usageErr;
    }
  });
}
