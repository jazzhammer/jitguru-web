import {writable} from "svelte/store";
const PersonsStore = writable({});
export default PersonsStore;
export const ACTION_SELECTED = "action_selected";