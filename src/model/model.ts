import {ColorValue} from 'react-native';

import log from '../log';
import {
  Address,
  BaseModel,
  City,
  Colour,
  ColourFamily,
  Corporation,
  Country,
  Event,
  MapDisplayables,
  Organisation,
  PointOfInterest,
} from '../types/model';

export class CouleurbummelModel {
  private readonly addresses = new Map<string, Address>();
  private readonly cities = new Map<string, City>();
  private readonly colours = new Map<string, Colour>();
  private readonly colourFamilies = new Map<string, ColourFamily>();
  private readonly corporations = new Map<string, Corporation>();
  private readonly countries = new Map<string, Country>();
  private readonly events = new Map<string, Event>();
  private readonly organisations = new Map<string, Organisation>();
  private readonly pointsOfInterest = new Map<string, PointOfInterest>();

  /**
   * Constructor to import the model from a database
   *
   * @param db The database; can be a Snapshot from Firebase or just an object with the correct interface
   * @returns {CouleurbummelModel} the new model
   */
  constructor(db?: any) {
    if (!db) {
      return;
    }

    for (const objectType in this) {
      log.debug('Importing ' + objectType);
      const map = this[
        objectType as keyof CouleurbummelModel
      ] as unknown as Map<string, BaseModel>;

      for (const id in db[objectType] ?? []) {
        map.set(id, db[objectType][id]);
      }
      log.debug(`Imported ${map.size} ${objectType}`);
    }
  }

  /**
   * Get a corporation by ID
   * @param id - the ID of the corporation
   * @returns {Corporation | undefined} the corporation if found and not hidden
   */
  corporation(id?: string) {
    if (!id) {
      return undefined;
    }
    const c = this.corporations.get(id);

    return !c || c.hidden ? undefined : c;
  }

  /**
   * Get corporations by ID, removing hidden and not founds
   * @param corporationIds - the IDs of the corporations
   * @returns {Corporation[]} the available corporations which aren't hidden
   */
  corporationsById(corporationIds: string[]) {
    return corporationIds
      .map(id => this.corporation(id))
      .filter(c => !!c)
      .map(c => c as Corporation);
  }

  /**
   * Get corporations by ID and their corresponding address
   * @param corporationIds - the IDs of the corporations
   * @returns {[Corporation, Address][]} corporations with address, where both were found and not hidden
   */
  corporationsWithAddress(corporationIds: string[]) {
    return this.corporationsById(corporationIds)
      .map(c => [c, this.address(c.addressId)])
      .filter(([_c, a]) => !!a)
      .map(obj => obj as [Corporation, Address]);
  }

  /**
   * Get an address by ID
   * @param id - the ID of the address
   * @returns {Address | undefined}  the address if found and not hidden
   */
  address(id?: string) {
    if (!id) {
      return undefined;
    }
    const a = this.addresses.get(id);

    return !a || a.hidden ? undefined : a;
  }

  /**
   * Get all addresses
   */
  allAddresses() {
    return Array.from(this.addresses.values()).filter(a => !a.hidden);
  }

  /**
   * Get addresses by ID, removing hidden and not founds
   * @param addressIds - the IDs of the addresses
   * @returns {Address[]} the available addresses which aren't hidden
   */
  addressesById(addressIds: string[]) {
    return addressIds
      .map(addressId => this.address(addressId))
      .filter(a => !!a)
      .map(a => a as Address);
  }

  /**
   * Get addresses and their corporations, filtering out hidden and empty ones
   * @param addressIds - the IDs of the addresses
   * @returns {[Address, Corporation[]][] | undefined} addresses and their corporaitons
   */
  addressesWithCorporations(addressIds: string[]) {
    return this.addressesById(addressIds)
      .map(
        a =>
          [a, this.corporationsById(a.corporationIds || [])] as [
            Address,
            Corporation[],
          ],
      )
      .filter(([_a, corporations]) => corporations.length > 0);
  }

  /**
   * Get all cities, sorted by name
   * @returns {City[]} City instances, filtering out hidden ones
   */
  allCities() {
    return Array.from(this.cities.values())
      .filter(c => !c.hidden)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get a city by ID
   * @param id - the ID of the city
   * @returns {City | undefined} the city if found and not hidden
   */
  city(id?: string) {
    if (!id) {
      return undefined;
    }
    const c = this.cities.get(id);

    return !c || c.hidden ? undefined : c;
  }

  /**
   * Get cities by ID, removing hidden and not founds
   * @param cityIds - the IDs of the cities
   * @returns {City[]} the available cities which aren't hidden
   */
  citiesById(cityIds: string[]) {
    return cityIds
      .map(cityId => this.city(cityId))
      .filter(c => !!c)
      .map(c => c as City);
  }

  /**
   * Gets cities with their corresponding addresses, filtering out hidden and empty ones
   * @param cityIds - the IDs of the cities
   * @returns {[City, Address[]][]} the cities with their addresses
   */
  citiesWithAddresses(cityIds: string[]) {
    return this.citiesById(cityIds)
      .map(
        c => [c, this.addressesById(c.addressIds || [])] as [City, Address[]],
      )
      .filter(([_city, addressesInCity]) => addressesInCity.length > 0);
  }

  /**
   * Get all countries
   * @returns {Country[]} Country instances, filtering out hidden ones
   */
  allCountries() {
    return Array.from(this.countries.values()).filter(c => !c.hidden);
  }

  /**
   * Get all organisations, sorted by name
   * @returns {Organisation[]} Organisation instances, filtering out hidden ones
   */
  allOrganisations() {
    return Array.from(this.organisations.values())
      .filter(o => !o.hidden)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get an organisation by ID
   * @param id - the ID of the organisation
   * @returns {Organisation | undefined} the organisation if found and not hidden
   */
  organisation(id?: string) {
    if (!id) {
      return undefined;
    }
    const o = this.organisations.get(id);

    return !o || o.hidden ? undefined : o;
  }

  /**
   * Get a colour by ID
   * @param id - the ID of the colour
   * @returns {Colour | undefined} the colour
   */
  colour(id?: string) {
    if (!id) {
      return undefined;
    }
    return this.colours.get(id)?.colourValue;
  }

  /**
   * Get the values of {Colour} instances for use in styles
   * @param colourIds
   * @returns {ColorValue[]} the values
   */
  colourValues(colourIds: string[]) {
    return colourIds
      .map(id => this.colour(id))
      .filter(c => !!c)
      .map(c => c as ColorValue);
  }

  /**
   * Get a colour family by ID
   * @param id - the ID of the colour family
   * @returns {ColourFamily | undefined} the colour family
   */
  colourFamily(id?: string) {
    if (!id) {
      return undefined;
    }
    return this.colourFamilies.get(id);
  }

  /**
   * Get all colour families
   */
  allColourFamilies() {
    return Array.from(this.colourFamilies.values()).filter(c => !c.hidden);
  }

  /**
   * Get a point of interest by ID
   * @param id - the ID of the POI
   * @returns {PointOfInterest | undefined} the POI
   */
  pointOfInterest(id: string) {
    if (!id) {
      return undefined;
    }
    const poi = this.pointsOfInterest.get(id);

    return !poi || poi.hidden ? undefined : poi;
  }

  /**
   * Get points of interest by ID, removing hidden and not founds
   * @param poiIds - the IDs of the POIs
   * @returns {PointOfInterest[]} the available POIs which aren't hidden
   */
  pointsOfInterestById(poiIds: string[]) {
    return poiIds
      .map(poiId => this.pointOfInterest(poiId))
      .filter(p => !!p)
      .map(p => p as PointOfInterest);
  }

  /**
   * Get an event by ID
   * @param id - the ID of the event
   * @returns {Event | undefined} the event
   */
  event(id: string) {
    if (!id) {
      return undefined;
    }

    const e = this.events.get(id);

    return !e || e.hidden ? undefined : e;
  }

  public mapDisplayables(): Map<Address, MapDisplayables> {
    const result = new Map<Address, MapDisplayables>();

    [...this.addresses.values()].forEach(address => {
      const corporations = (address.corporationIds || [])
        .map(corpId => this.corporations.get(corpId))
        .filter(corp => !!corp && !corp.hidden)
        .map(corp => corp as Corporation);
      const pois = (address.pointOfInterestIds || [])
        .map(poiId => this.pointsOfInterest.get(poiId))
        .filter(poi => !!poi && !poi.hidden)
        .map(poi => poi as PointOfInterest);
      if (!address.hidden && corporations.length + pois.length > 0) {
        result.set(address, {
          pois: pois,
          corporations: corporations,
        });
      }
    });

    return result;
  }
}
