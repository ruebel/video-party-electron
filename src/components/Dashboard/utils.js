export const getNextVideos = (windows, files) => {
  return windows.map((w, i) => {
    return {
      ...w,
      src: files[getRandomInt(0, files.length - 1)],
      startTime: Math.random()
    };
  });
};

export const getRandomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
