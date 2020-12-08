const colorLevels = {
  0: 'text-indigo-500',
  1800: 'text-purple-600',
  2700: 'text-yellow-600',
  3570: 'text-red-600'
};

function getColorLevels(timeStamp) {
  return Object.keys(colorLevels).reduce(
    (acc, curr) => {
      if (timeStamp >= parseInt(curr, 10)) {
        return {
          add: colorLevels[curr],
          delete: acc.add
        };
      }
      return acc;
    },
    { add: '', delete: '' }
  );
}

export { getColorLevels };
