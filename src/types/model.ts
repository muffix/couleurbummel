// Properties that all top-level models share
import {ColorValue} from 'react-native';

import {TranslationKey} from './i18n';

export interface BaseModel {
  // The unique ID by which the model can be identified
  id: string;
  hidden?: boolean;
}

// A typed collection of things that can be displayed on a map
export interface MapDisplayables {
  corporations: Corporation[];
  pois: PointOfInterest[];
}

// Something that can be represented by a marker on the map
interface MapDisplayable extends BaseModel {
  shortName: string;
  longName: string;
  addressId: string;
  phone?: string;
  mail?: string;
  website?: string;
  remark?: string;
  indicatorColourId?: string;
  eventIds?: string[];
}

// An address that can house things that can be displayed on a map
export interface Address extends BaseModel {
  name?: string;
  latitude: number;
  longitude: number;
  fullAddress?: string;
  cityIds?: string[];
  corporationIds?: string[];
  pointOfInterestIds?: string[];
}

// A collection of addresses
export interface City extends BaseModel {
  name: string;
  translationKey: TranslationKey;
  countryId: string;
  addressIds?: string[];
}

// A collection of cities
export interface Country extends BaseModel {
  isoCode: string;
  name?: string;
  cityIds?: string[];
}

// A single colour definition
export interface Colour extends BaseModel {
  // The actual value of the colour
  colourValue: ColorValue;
  // The key which is used to translate this colour
  translationKey: TranslationKey;
  // The ID of the colour family to which this shade belongs
  colourFamilyId: string;
  // IDs of corporations using this colour
  inColours?: string[];
}

// A family of similar colours, for example in different shaded
export interface ColourFamily extends BaseModel {
  // IDs of the colours that are similar to each other
  memberColourIds?: string[];
  // The key which is used to translate this colour
  translationKey: TranslationKey;
  // A colour value representing the family
  sampleColourValue: string;
}

// Represents a sash-like collection of colours, such as a tricolore
export interface Colours {
  // The IDs of the colours, top to bottom
  colourIds: string[];
  // The ID of base colour
  baseColourId?: string;
  // The ID of percussion
  percussionColourId?: string;
}

// The fencing policy of a corporation
export enum FencingPrinciple {
  Unknown = 0,
  // Not fencing
  No = 1,
  // Fencing is opt-in
  Freely = 2,
  // Training is mandatory, but mensur is optional
  Facultatively = 3,
  // Mensur is mandatory
  Mandatory = 4,
}

// The colours policy of a corporation
export enum ColoursPrinciple {
  Unknown = 0,
  // No colours exist
  None = 1,
  // Wearing needles
  Needle = 2,
  // Not wearing colours
  NotWearing = 3,
  // Wearing is optional
  Optional = 4,
  // Wearing is mandatory
  Mandatory = 5,
}

// A corporation
export interface Corporation extends MapDisplayable {
  coloursPrinciple: ColoursPrinciple;
  colours?: Colours[];
  fencingPrinciple: FencingPrinciple;
  // IDs of organisations this corporation belongs to
  organisationIds?: string[];
  // The date of foundation, yyyy-MM-dd
  foundationDate?: string;
  // Free-text comment on the best day/time to visit
  jourFixe?: string;
  motto?: string;
  // The postal address if different from the address of the marker
  postalAddress?: string;
}

// An Organisation of corporations
export interface Organisation extends BaseModel {
  name: string;
  abbreviation: string;
  mapDisplayableIds?: string[];
  indicatorColourId?: string;
}

// An event that is displayed temporarily
export interface Event extends BaseModel {
  name: string;
  // IDs of MapDisplayables where this event takes place
  mapDisplayableIds: string[];
  // Begin of the event, ISO 8601
  begin: string;
  // End of the event, ISO 8601
  end?: string;
  description?: string;
}

// A point on the map that isn't a corporation, but can be associated to one or more
export interface PointOfInterest extends MapDisplayable {
  iconName: string;
  associatedCorporationIds?: string;
}
