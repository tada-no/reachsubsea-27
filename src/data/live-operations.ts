// Live operations (17 Sep 2026, prototype). SAMPLE DATA: not real positions, projects or clients.
// Region-level on purpose: a pin marks a sea area (its label point), never a vessel's position.
// Kept apart from the 3D World (src/data/world.ts): the 3D World zones are illustrative scenes,
// this is where assets are actually working. Recommendation and WordPress field map:
// docs/07-live-operations.md.
//
// WordPress: an ACF options page "Current operations" with one repeater of rows (region, asset type,
// asset, scope, sector, since) plus `updatedAt`, which WordPress sets on save. The block groups rows
// by region. An optional AIS job (docs/07 §2) only ever touches `updatedAt` and an `aisConfirmed`
// flag per row; it never publishes coordinates.

export type AssetType = 'crewed' | 'remote' | 'rov';

// `filter` is the short chip label. Not "Reach Remote": that is also the name of individual vessels
// (Reach Remote 1, 2…), so a filter called that reads like one vessel (user, 17 Sep 2026).
export const assetTypes: { key: AssetType; label: string; filter: string; icon: string }[] = [
  { key: 'crewed', label: 'Crewed vessel', filter: 'Crewed', icon: 'ship' },
  { key: 'remote', label: 'Uncrewed surface vessel', filter: 'Uncrewed', icon: 'radar' },
  { key: 'rov', label: 'ROV spread', filter: 'ROVs', icon: 'submarine' },
];

export interface Operation {
  type: AssetType;
  /** Public asset name, or a generic label when the client hasn't cleared naming ("Crewed IMR vessel"). */
  asset: string;
  /** What the work is, without the client ("Pipeline inspection survey"). */
  scope: string;
  sector: 'Oil & gas' | 'Offshore wind' | 'Cables & infrastructure' | 'Research';
  /** Month the campaign started, shown as "Since Aug 2026". */
  since?: string;
  /** Asset single, when the asset is named. */
  assetUrl?: string;
}

export interface Region {
  id: string;
  name: string;
  /** Short context under the name ("Norwegian continental shelf"). */
  area: string;
  /** Label point for the region, in degrees. Rounded to whole degrees: never a vessel position. */
  lon: number;
  lat: number;
  operations: Operation[];
}

export interface LiveOperationsFeed {
  /** ISO 8601. Drives Live / Stale. */
  updatedAt: string;
  regions: Region[];
}

export const liveOperations: LiveOperationsFeed = {
  updatedAt: '2026-09-17T06:00:00Z',
  regions: [
    {
      id: 'norwegian-north-sea',
      name: 'Norwegian North Sea',
      area: 'Norwegian continental shelf',
      lon: 3,
      lat: 59,
      operations: [
        { type: 'crewed', asset: 'Crewed IMR vessel', scope: 'Inspection, maintenance and repair campaign', sector: 'Oil & gas', since: 'Jun 2026' },
        { type: 'rov', asset: 'Work-class ROV spread', scope: 'Riser and mooring inspection', sector: 'Oil & gas', since: 'Jun 2026' },
        { type: 'remote', asset: 'Uncrewed surface vessel', scope: 'Pipeline route survey, operated from shore', sector: 'Oil & gas', since: 'Sep 2026' },
      ],
    },
    {
      id: 'southern-north-sea',
      name: 'Southern North Sea',
      area: 'UK and Dutch sectors',
      lon: 3,
      lat: 54,
      operations: [
        { type: 'remote', asset: 'Uncrewed surface vessel', scope: 'Offshore wind site survey', sector: 'Offshore wind', since: 'Aug 2026' },
        { type: 'crewed', asset: 'Crewed survey vessel', scope: 'Export cable inspection', sector: 'Offshore wind', since: 'Sep 2026' },
      ],
    },
    {
      id: 'baltic-sea',
      name: 'Baltic Sea',
      area: 'Southern Baltic',
      lon: 17,
      lat: 56,
      operations: [
        { type: 'crewed', asset: 'Crewed survey vessel', scope: 'Cable route and UXO survey', sector: 'Cables & infrastructure', since: 'Jul 2026' },
      ],
    },
    {
      id: 'brazil',
      name: 'Offshore Brazil',
      area: 'Campos and Santos basins',
      lon: -41,
      lat: -23,
      operations: [
        { type: 'rov', asset: 'Work-class ROV spread', scope: 'Subsea construction support on a client vessel', sector: 'Oil & gas', since: 'May 2026' },
        { type: 'rov', asset: 'Observation-class ROV spread', scope: 'Field inspection', sector: 'Oil & gas', since: 'Aug 2026' },
      ],
    },
    {
      id: 'south-east-asia',
      name: 'South East Asia',
      area: 'Malaysia and Singapore waters',
      lon: 106,
      lat: 3,
      operations: [
        { type: 'crewed', asset: 'Crewed IMR vessel', scope: 'Pipeline inspection survey', sector: 'Oil & gas', since: 'Aug 2026' },
      ],
    },
  ],
};

/** Hours after `updatedAt` before the block switches to the Stale state. */
export const STALE_AFTER_HOURS = 72;
