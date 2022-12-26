import log from '../../log';
import {CouleurbummelModel} from '../../model/model';
import {Address, Colours, Corporation} from '../../types/model';

export interface ColoursQuery {
  baseColourId: string;
  colourFamilyIds: string[];
}

const coloursMatch = (
  colours: Colours,
  colourIdsToFind: string[][],
  baseColourIdsToFind?: string[],
) => {
  // If we're searching for more or fewer colours than we have, it's not a match
  if (colourIdsToFind.length !== colours.colourIds.length) {
    return false;
  }

  // If the query contains a base colour, but the corporation doesn't have one or has the wrong one, it doesn't match.
  if (
    baseColourIdsToFind?.length &&
    (!colours.baseColourId ||
      baseColourIdsToFind.indexOf(colours.baseColourId) === -1) &&
    (!colours.percussionColourId ||
      baseColourIdsToFind.indexOf(colours.percussionColourId) === -1)
  ) {
    log.debug(
      'Base colour not matching',
      colours.baseColourId,
      baseColourIdsToFind,
    );
    return false;
  }

  let index = 0;
  let coloursFound = 0;

  // See if we can find the colours in the correct order.
  for (const i in colourIdsToFind) {
    const matchingColourIds = colourIdsToFind[i];

    if (
      // Blank colours are wildcards and always match
      !matchingColourIds.length ||
      matchingColourIds.indexOf(colours.colourIds[index]) !== -1
    ) {
      coloursFound++;
    }
    index++;
  }

  return coloursFound === colourIdsToFind.length;
};

export const searchColours = (
  query: ColoursQuery,
  data: [Address, Corporation][],
  model: CouleurbummelModel,
) => {
  log.debug('Serving query', query);

  const baseColourToSearch = model.colourFamily(
    query.baseColourId,
  )?.memberColourIds;

  const coloursToSearch = (query.colourFamilyIds || []).map(
    familyId => model.colourFamily(familyId)?.memberColourIds || [],
  );

  log.debug('Resolved colours', baseColourToSearch, coloursToSearch);

  return data.filter(([_address, corporation]) => {
    return (corporation.colours || []).some(cols =>
      coloursMatch(cols, coloursToSearch, baseColourToSearch),
    );
  });
};
