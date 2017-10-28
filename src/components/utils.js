/* eslint-disable sort-keys */
export const colorModes = {
  regular: 'Regular',
  blackAndWhite: 'Black and White',
  colorize: 'Colorize',
  random: 'Random'
};

export const getVideoName = src => {
  if (!src) return;
  const fileName = src.slice(src.lastIndexOf('/') + 1);
  const withoutExt = fileName.slice(0, fileName.lastIndexOf('.'));
  return withoutExt;
};
