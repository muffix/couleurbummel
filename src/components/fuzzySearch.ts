export default (needle: string, haystack: string) => {
  if (needle.length > haystack.length) {
    return false;
  }
  if (needle.length === haystack.length) {
    return needle === haystack;
  }

  // eslint-disable-next-line no-labels
  outerLoop: for (let i = 0, j = 0; i < needle.length; i++) {
    const nch = needle.charCodeAt(i);
    while (j < haystack.length) {
      if (haystack.charCodeAt(j++) === nch) {
        // eslint-disable-next-line no-labels
        continue outerLoop;
      }
    }
    return false;
  }
  return true;
};
