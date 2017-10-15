const fs = window.require('electron').remote.require('fs');

export const getFilesInFolder = folder => {
  const files = fs.readdirSync(folder[0]);
  return files.reduce((total, file) => {
    if (fs.statSync(folder + '/' + file).isDirectory()) {
      return [...total, ...getFilesInFolder(folder + '/' + file)];
    }
    return [...total, folder + '/' + file];
  }, []);
};
