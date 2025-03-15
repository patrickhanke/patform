const sortItemsByPosition = (items: Array<{ position: number } & any>) => {
  if (items) {
    return [...items].sort((a, b) => a.position - b.position);
  }
  return [];
};

export default sortItemsByPosition;
