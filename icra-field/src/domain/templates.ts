import type { ActivityType, IcraClass, ItemTemplate, Matrix, ProjectSettings, RiskGroup, ShutdownSystem } from './types'

// Everything in this file is starting data for a prototype. Each hospital adopts its own
// permit wording and matrix; verify against the owner's current ICRA 2.0 permit before use.

export const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'] as const

export const ACTIVITY_TYPES: { id: ActivityType; label: string; desc: string }[] = [
  { id: 'A', label: 'Type A', desc: 'Inspection and non-invasive work (e.g. removing a ceiling tile for visual inspection, painting without sanding).' },
  { id: 'B', label: 'Type B', desc: 'Small-scale, short-duration work with minimal dust (e.g. cabling, chase access, controlled cutting).' },
  { id: 'C', label: 'Type C', desc: 'Moderate to high dust or removal of fixed building components (e.g. sanding, new walls, work above ceilings, work spanning more than one shift).' },
  { id: 'D', label: 'Type D', desc: 'Major demolition and construction (consecutive shifts, heavy demolition, new construction).' },
]

export const RISK_GROUPS: { id: RiskGroup; label: string; desc: string }[] = [
  { id: 'low', label: 'Low', desc: 'Office areas, unoccupied areas.' },
  { id: 'medium', label: 'Medium', desc: 'Cardiology, endoscopy, nuclear medicine, PT, radiology/MRI, respiratory therapy.' },
  { id: 'high', label: 'High', desc: 'CCU, ER, L&D, labs, nursery, outpatient surgery, pediatrics, pharmacy, PACU, surgical units.' },
  { id: 'highest', label: 'Highest', desc: 'Immunocompromised patients, burn, cath lab, central sterile, ICU, oncology, ORs, NICU, transplant.' },
]

export const SPECIAL_HAZARDS = [
  { id: 'sewage', label: 'Sewage' },
  { id: 'mold', label: 'Mold' },
]

// Cells from a search excerpt of the ASHE ICRA 2.0 permit. Other published matrices differ,
// which is why the matrix is per-project data that the team can edit in Settings.
export const DEFAULT_MATRIX: Matrix = {
  low: { A: 1, B: 2, C: 2, D: 3 },
  medium: { A: 1, B: 2, C: 3, D: 4 },
  high: { A: 1, B: 3, C: 4, D: 5 },
  highest: { A: 3, B: 4, C: 5, D: 5 },
}

export const DEFAULT_SETTINGS: ProjectSettings = {
  matrix: DEFAULT_MATRIX,
  matrixVersion: 'ASHE ICRA 2.0 (draft, verify)',
  pressureThreshold: 0.01,
  checkDueTime: '12:00',
}

export function computeClass(matrix: Matrix, activity: ActivityType, risk: RiskGroup, hazards: string[]): IcraClass {
  let cls = matrix[risk][activity]
  if (hazards.includes('sewage') || hazards.includes('mold')) {
    const floor: IcraClass = risk === 'low' || risk === 'medium' ? 4 : 5
    cls = Math.max(cls, floor) as IcraClass
  }
  return cls
}

/** Class III and above need IP and facilities sign-off before work starts. */
export function requiredPermitSigners(cls: IcraClass, ilsm: boolean) {
  const roles: ('ip' | 'facilities' | 'safety')[] = cls >= 3 ? ['ip', 'facilities'] : ['facilities']
  if (ilsm) roles.push('safety')
  return roles
}

type ClassedItem = ItemTemplate & { minClass: IcraClass; maxClass?: IcraClass }

const SETUP: ClassedItem[] = [
  { id: 's.posted', minClass: 1, section: 'Setup', photo: 'required', text: 'Permit posted at work area entrance' },
  { id: 's.adjacent', minClass: 1, section: 'Setup', photo: 'optional', text: 'Adjacent areas checked: above, below, beside, shared ceiling space, isolation rooms, air intakes' },
  { id: 's.oriented', minClass: 1, section: 'Setup', photo: 'optional', text: 'Crew oriented to ICRA / ILSM requirements for this permit' },
  { id: 's.doors', minClass: 2, section: 'Setup', photo: 'optional', text: 'Unused doors sealed with tape' },
  { id: 's.vents', minClass: 2, section: 'Setup', photo: 'required', text: 'HVAC return vents blocked and sealed, or HVAC isolated' },
  { id: 's.mat', minClass: 3, section: 'Setup', photo: 'optional', text: 'Walk-off mat placed at entrance' },
  { id: 's.hvac', minClass: 3, section: 'Setup', photo: 'optional', text: 'HVAC isolation confirmed with facilities', help: 'Record who from facilities confirmed it in the note.' },
  { id: 's.barrier', minClass: 3, section: 'Setup', photo: 'required', text: 'Critical barriers in place before work starts: deck to deck, joints taped, penetrations sealed', help: 'Photograph the top of the wall and every penetration.' },
  { id: 's.nam', minClass: 3, section: 'Setup', photo: 'required', text: 'Negative pressure with HEPA-filtered exhaust running' },
  { id: 's.smoke', minClass: 3, section: 'Setup', photo: 'required', text: 'Smoke test confirms airflow into containment at barrier' },
  { id: 's.monitor', minClass: 4, section: 'Setup', photo: 'required', text: 'Pressure monitor installed on containment exterior' },
  { id: 's.ante4', minClass: 4, maxClass: 4, section: 'Setup', photo: 'required', text: 'Anteroom built; shoe covers / coveralls available' },
  { id: 's.ante5', minClass: 5, section: 'Setup', photo: 'required', text: 'Anteroom built, large enough for equipment staging and cart cleaning' },
]

// Daily wording follows a field superintendent's barrier-check mockup where it covers the item.
const DAILY: ClassedItem[] = [
  { id: 'd.barrier', minClass: 3, section: 'ICRA', photo: 'required', text: 'Barrier intact, no gaps or tears (including above ceiling)' },
  { id: 'd.ante', minClass: 4, section: 'ICRA', photo: 'optional', text: 'Anteroom door closed and self-closing' },
  { id: 'd.mat', minClass: 3, section: 'ICRA', photo: 'optional', text: 'Walk-off mat changed today' },
  { id: 'd.nam', minClass: 3, section: 'ICRA', photo: 'optional', text: 'HEPA unit running and exhausting' },
  { id: 'd.corridor', minClass: 2, section: 'ICRA', photo: 'optional', text: 'Corridor outside barrier clean' },
  { id: 'd.sealed', minClass: 2, section: 'ICRA', photo: 'optional', text: 'Unused doors and return vents still sealed' },
  { id: 'd.dust', minClass: 2, section: 'ICRA', photo: 'optional', text: 'Work surfaces misted / dust controlled' },
  { id: 'd.carts', minClass: 2, section: 'ICRA', photo: 'optional', text: 'Debris moved in covered carts' },
  { id: 'd.hvac', minClass: 3, section: 'ICRA', photo: 'optional', text: 'HVAC isolation still in place' },
  { id: 'd.hepavac', minClass: 4, section: 'ICRA', photo: 'optional', text: 'Work area HEPA-vacuumed before leaving' },
  { id: 'd.tiles', minClass: 1, section: 'ICRA', photo: 'optional', text: 'Ceiling tiles moved for access replaced' },
]

export interface IlsmMeasure {
  id: string
  label: string
  cadence: string
  daily?: { text: string; photo: 'required' | 'optional' }
}

export const ILSM_MEASURES: IlsmMeasure[] = [
  { id: 'M2', label: 'Fire department notification + fire watch when systems are impaired', cadence: 'Alarm out >4 h or sprinkler out >10 h in 24 h' },
  { id: 'M3', label: 'Alternative exit signage', cadence: 'On egress change; verified daily', daily: { text: 'Alternative-exit signage in place and visible', photo: 'optional' } },
  { id: 'M4', label: 'Daily inspection of exits in affected areas', cadence: 'Daily', daily: { text: 'Exits in affected area free and unobstructed', photo: 'optional' } },
  { id: 'M5', label: 'Temporary equivalent fire alarm / detection', cadence: 'During impairment' },
  { id: 'M6', label: 'Inspect and test temporary systems', cadence: 'Monthly' },
  { id: 'M7', label: 'Additional fire extinguishers + training', cadence: 'Setup; checked daily', daily: { text: 'Extra fire extinguishers present and tagged', photo: 'optional' } },
  { id: 'M8', label: 'Temporary partitions smoke-tight, noncombustible / limited-combustible', cadence: 'At erection; daily', daily: { text: 'Temporary partitions smoke-tight', photo: 'optional' } },
  { id: 'M9', label: 'Increased surveillance of construction and storage areas', cadence: 'Per policy' },
  { id: 'M10', label: 'Storage, housekeeping, and debris removal', cadence: 'Daily', daily: { text: 'Storage and debris controlled; no combustible buildup', photo: 'optional' } },
  { id: 'M11', label: 'Additional fire drills', cadence: 'Commonly 1 per shift per quarter' },
  { id: 'M12', label: 'Education on deficiencies, temporary measures, alternative exits', cadence: 'Start of ILSM; each new worker' },
  { id: 'M13', label: 'No smoking in or near construction', cadence: 'Continuous', daily: { text: 'No smoking observed; signage posted', photo: 'optional' } },
]

const inClass = (cls: IcraClass) => (i: ClassedItem) => cls >= i.minClass && (!i.maxClass || cls <= i.maxClass)
const strip = ({ minClass: _min, maxClass: _max, ...item }: ClassedItem): ItemTemplate => item

export function setupItems(cls: IcraClass): ItemTemplate[] {
  return SETUP.filter(inClass(cls)).map(strip)
}

export function dailyItems(permit: { cls: IcraClass; ilsm: boolean; ilsmMeasures: string[]; pressurePoints: string[] }): ItemTemplate[] {
  const items: ItemTemplate[] = []
  if (permit.cls >= PRESSURE_FROM_CLASS) {
    permit.pressurePoints.forEach((location, i) =>
      items.push({ id: `p.${i}`, section: 'Pressure', photo: 'required', text: `Differential pressure: ${location}`, readingAt: location, help: 'Photograph the gauge so the reading can be checked later.' }),
    )
  }
  items.push(...DAILY.filter(inClass(permit.cls)).map(strip))
  if (permit.ilsm) {
    for (const m of ILSM_MEASURES) {
      if (m.daily && permit.ilsmMeasures.includes(m.id)) items.push({ id: `l.${m.id}`, section: 'ILSM', photo: m.daily.photo, text: m.daily.text })
    }
  }
  return items
}

/** Pressure readings and negative air start at Class III (APIC matrix; matches field practice). */
export const PRESSURE_FROM_CLASS = 3

export interface SystemInfo {
  id: ShutdownSystem
  label: string
  /** Out of service longer than this (hours in 24) means fire watch or evacuation (CMS K-346 / K-354). */
  fireWatchAfterHours?: number
}

export const SHUTDOWN_SYSTEMS: SystemInfo[] = [
  { id: 'fire_alarm', label: 'Fire alarm / detection', fireWatchAfterHours: 4 },
  { id: 'sprinkler', label: 'Sprinkler', fireWatchAfterHours: 10 },
  { id: 'medical_gas', label: 'Medical gas' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'hvac', label: 'HVAC / air handling' },
  { id: 'water', label: 'Domestic water' },
  { id: 'other', label: 'Other' },
]

// The order of closeout steps is enforced: a step can't be recorded until the one before it is complete.
export const CLOSEOUT_STEPS: ItemTemplate[] = [
  { id: 'c.clean', section: 'Closeout', photo: 'required', roles: ['superintendent', 'foreman'], text: 'Contractor clean and HEPA vacuum of work area' },
  { id: 'c.ip1', section: 'Closeout', photo: 'optional', roles: ['ip'], text: 'Infection Preventionist inspection of work area' },
  { id: 'c.evs', section: 'Closeout', photo: 'optional', roles: ['facilities'], text: 'EVS terminal clean completed', help: 'Recorded by facilities on behalf of Environmental Services.' },
  { id: 'c.iprelease', section: 'Closeout', photo: 'optional', roles: ['ip'], text: 'Infection Preventionist release' },
  { id: 'c.engrelease', section: 'Closeout', photo: 'optional', roles: ['facilities'], text: 'Engineering release' },
  { id: 'c.hvac', section: 'Closeout', photo: 'optional', roles: ['facilities'], text: 'HVAC isolation removed; normal airflow restored' },
  { id: 'c.barriers', section: 'Closeout', photo: 'required', roles: ['superintendent', 'foreman'], text: 'Barriers removed; area cleaned after removal' },
  { id: 'c.return', section: 'Closeout', photo: 'optional', roles: ['ip', 'facilities'], text: 'Area returned to service' },
]
