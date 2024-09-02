export const PREF_SELECTED_ORG_ID = "selected_org_id";
export const PREF_SELECTED_FACILITY_ID = "selected_facility_id";
export interface UserPreference {
  id: number;
  name: string;
  value: string;
  deleted: boolean;
  user_id: number;
}

export const UserPreferenceValue = Object.freeze({
  ENABLED: 1,
  DISABLED: 0
});
