import { language } from './data/settings.json';

const fs = window.require('fs');
const enMessages = JSON.parse(
  fs.readFileSync('src/utils/data/messages_en.json')
);

const findMessage = (bundle, fullPath) => {
  let final = bundle;
  fullPath.forEach((path) => {
    final = final[path];
  });
  return final;
};

export const Localize = (path) => {
  const paths = path.split('.');
  switch (language) {
    case 'English':
      return findMessage(enMessages, paths);
    default:
      return findMessage(enMessages, paths);
  }
};
