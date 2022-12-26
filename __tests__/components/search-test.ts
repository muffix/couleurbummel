import {ColoursQuery, searchColours} from '../../src/components/search/helpers';
import {Address, Corporation} from '../../src/types/model';
import {getTestModel} from '../__helpers__/helpers';

describe('Colours search', () => {
  const model = getTestModel();
  const addressesAndCorporations = model
    .addressesWithCorporations(model.allAddresses().map(a => a.id))
    .flatMap(([address, corporations]) =>
      corporations.map(c => [address, c] as [Address, Corporation]),
    );

  const testQuery = (query: ColoursQuery) =>
    searchColours(query, addressesAndCorporations, model);

  it('should find exact matches', () => {
    expect(
      testQuery({
        baseColourId: '',
        colourFamilyIds: [
          'colour_family_red',
          'colour_family_white',
          'colour_family_pink',
        ],
      }),
    ).toHaveLength(1);
  });

  it('should find exact matches with duplicate colours', () => {
    expect(
      testQuery({
        baseColourId: '',
        colourFamilyIds: [
          'colour_family_red',
          'colour_family_white',
          'colour_family_red',
        ],
      }),
    ).toHaveLength(1);
  });

  it('should find partial matches', () => {
    expect(
      testQuery({
        baseColourId: '',
        colourFamilyIds: ['colour_family_red', '', 'colour_family_pink'],
      }),
    ).toHaveLength(1);
  });

  it('should find base colours', () => {
    expect(
      testQuery({
        baseColourId: 'colour_family_white',
        colourFamilyIds: ['', ''],
      }),
    ).toHaveLength(1);
  });

  it('should find base colours and ignore extra fields', () => {
    expect(
      testQuery({
        baseColourId: 'colour_family_white',
        colourFamilyIds: ['', ''],
      }),
    ).toHaveLength(1);
  });

  it('should find base colours and partial matches', () => {
    expect(
      testQuery({
        baseColourId: 'colour_family_white',
        colourFamilyIds: ['colour_family_black', ''],
      }),
    ).toHaveLength(1);
  });

  it('should not find colours with too few colours', () => {
    expect(
      testQuery({
        baseColourId: '',
        colourFamilyIds: ['colour_family_black', '', '', ''],
      }),
    ).toHaveLength(0);
  });

  it('should not find colours with too many colours', () => {
    expect(
      testQuery({
        baseColourId: '',
        colourFamilyIds: ['colour_family_black'],
      }),
    ).toHaveLength(0);
  });
});
