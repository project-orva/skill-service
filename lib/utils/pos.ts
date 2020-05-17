import pos from 'pos';

export const createTagged = (text: string): Array<string> => {
  const words = new pos.Lexer().lex(text);
  const tagger = new pos.Tagger();
  return tagger.tag(words);
};

export const createPOSMapping = (text: string): {
    plainWords: Array<string>, pos: Array<string>,
} => {
  const tagged = createTagged(text);

  const pos = [];
  const plainWords = [];

  for (const i in tagged) {
    const [word, tag] = tagged[i];

    pos.push(tag);
    plainWords.push(word);
  }

  return { pos, plainWords };
}