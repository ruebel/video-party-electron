import ReactPlayer from 'react-player';
const remote = window.require('electron').remote;
const fs = remote.require('fs');
const path = remote.require('path');

export const getFilesInFolder = folder => {
  const files = fs.readdirSync(folder);
  return files.reduce((total, file) => {
    const filePath = path.join(folder, file);
    if (fs.statSync(filePath).isDirectory()) {
      return [...total, ...getFilesInFolder(filePath)];
    } else if (ReactPlayer.canPlay(filePath)) {
      return [...total, filePath];
    }
    return total;
  }, []);
};
