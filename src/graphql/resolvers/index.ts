import scalarCustom from './ScalarCustomResolver'
import { PersonResolver } from './PersonResolver'
import { GroupResolver } from './GroupResolver'
import { HouseholdResolver } from './HouseholdResolver'

export default [
  scalarCustom,
  PersonResolver.getResolver(),
  GroupResolver.getResolver(),
  HouseholdResolver.getResolver(),
];