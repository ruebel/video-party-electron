import ReactPlayer from 'react-player';
const { remote } = window.require('electron');
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

export const getNextVideos = (windows, files, settings) => {
  return windows.map((w, i) => {
    return {
      ...w,
      colorize: settings.colorize ? getRandomColor() : null,
      src: files[getRandomInt(0, files.length - 1)],
      startTime: getRandomInRange(0.05, 0.95)
    };
  });
};

export const getRandomColor = () => {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
};

export const getRandomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
