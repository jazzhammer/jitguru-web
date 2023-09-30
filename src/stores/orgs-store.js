import {writable} from "svelte/store";
const OrgsStore = writable({});
export default OrgsStore;
export const ACTION_SELECTED = "action_selected";