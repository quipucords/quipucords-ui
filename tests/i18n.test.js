const { GettextExtractor, JsExtractors } = require('gettext-extractor');

const textExtractor = () => {
  const extractor = new GettextExtractor();
  extractor
    .createJsParser([
      JsExtractors.callExpression(['t', '[this].t'], {
        arguments: {
          text: 0,
          context: 1
        }
      })
    ])
    .parseFilesGlob('./src/components/**/*!(.test|.spec).@(js|jsx)');

  return extractor;
};

describe('i18n locale', () => {
  const getText = textExtractor();

  it('should generate a predictable pot output snapshot', () => {
    expect(getText.getPotString()).toMatchSnapshot('pot output');
  });
});
