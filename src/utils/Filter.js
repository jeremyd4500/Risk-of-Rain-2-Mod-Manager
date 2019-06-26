// bad-words.json was pulled from the bad-words npm package here https://github.com/web-mech/badwords/blob/master/lib/lang.json
import { words } from './data/bad-words.json';

const censor = '*';

const filterList = (list, splitCharacter) => {
  list.forEach((word) => {
    const bareWord = word.replace(/[^a-zA-Z ]/g, '');
    if (words.includes(bareWord.toLowerCase())) {
      const censored = censor.repeat(bareWord.length);
      list[list.indexOf(word)] = censored;
    }
  });
  return list.join(splitCharacter);
};

export const Filter = (text) => {
  let splitText = text.split(' ');
  if (splitText.length === 1) {
    if (text.includes('_')) {
      splitText = text.split('_');
      return filterList(splitText, '_');
    } else if (text.includes('-')) {
      splitText = text.split('-');
      return filterList(splitText, '-');
    } else {
      let newText = text.replace(/([A-Z])/g, ' $1');
      splitText = newText.split(' ');
      if (splitText[0] === '') {
        splitText.splice(0, 1);
      }
      return filterList(splitText, '');
    }
  } else {
    return filterList(splitText, ' ');
  }
};
