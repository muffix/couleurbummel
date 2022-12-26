import fuzzySearch from '../src/components/fuzzySearch';

describe('fuzzy search', () => {
  const haystack = 'KDStV Marchia';
  it('finds exact matches', () => {
    expect(fuzzySearch(haystack, haystack)).toBeTruthy();
  });

  it('finds partial matches', () => {
    expect(fuzzySearch('KDM', haystack)).toBeTruthy();
  });

  it('is case sensitive', () => {
    expect(fuzzySearch(haystack.toLowerCase(), haystack)).toBeFalsy();
  });

  it('accepts unicode', () => {
    expect(fuzzySearch('ä', 'KDStV Märchiä')).toBeTruthy();
  });

  it('does not match if haystack is strict prefix of needle', () => {
    expect(fuzzySearch('haystacks', 'haystack')).toBeFalsy();
  });
});
