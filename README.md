# autobg.macro

a babel macro which can auto-generate background-image, width (in vw), height (in vw) CSS code based on the given image path, usually used with `styled-components`

## Install

```bash
npm i -S autobg.macro
```

## Usage

```js
import styled from 'styled-components/macro';
import autobg from 'autobg.macro';

const MyDiv = styled.div`
  text-align: center;
  ${autobg('./path/to/img.png')}
  color: red;
`;
```

assuming the image file's dimension is 750x750, the code above with be compiled to

```js
import styled from 'styled-components/macro';

const MyDiv = styled.div`
  text-align: center;
  background-image: url('${require('./path/to/img.png')?.default}');
  background-size: 100%;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vw;
  color: red;
`;
```

## Config

- baseUrl (String): image path resolving base URL, default `"./src"`
- vwBase (Number): px to vw transform base value, default `750`
- esModule (Boolean): set this the same value as `url-loader` or `file-loader`, default: `true`
  - use `false` when using `react-scripts < 4`

example config using `babelMacros` field in `package.json` file, for more config detail, see https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/user.md#config

```json
{
  "babelMacros": {
    "autobg": {
      "baseUrl": "./src",
      "vwBase": 750,
      "esModule": true
    }
  }
}
```
