# autobg.macro

a babel macro for `styled-components` which auto generate background-image, width, height CSS code

## Install

```bash
npm i -S autobg.macro
```

## Usage

```js
import autobg from 'autobg.macro';

const MyDiv = styled.div`
  text-align: center;
  ${autobg('./path/to/img.png')}
  color: red;
`;
```

assuming the image file's dimension is 750x750, the code above with be compiled to

```js
import autobg from 'autobg.macro';

const MyDiv = styled.div`
  text-align: center;
  background-image: url('${require('./path/to/img.png')}');
  background-size: 100%;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vw;
  color: red;
`;
```
