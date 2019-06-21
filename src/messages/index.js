const fs = window.require('fs');

const enMessages = JSON.parse(fs.readFileSync('src/messages/messages_en.json'));
const settings = JSON.parse(fs.readFileSync('src/api/settings.json'));

const language = settings.language;

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
