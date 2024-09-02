<style>
  .my-tools {
    max-width: 250px;
    min-width: 200px;
  }
</style>
<script lang="ts">
  import {type UserPreference} from "../models/user-preference";
  import UserPreferencesStore from "../stores/user-preferences-store";
  import store from "../stores/types";

  export let userPreferenceTools
  $: userPreferenceTools

  const selectUserPreference = (next: UserPreference): void => {
    UserPreferencesStore.set({
      type: store.READ,
      payload: next
    });
  }
</script>
<div class="my-tools text-amber-950 text-left flex flex-col">
  <div class="border-b-2 border-garden-100 mb-4"
       style="width: calc(100% - 5px); position: relative"
  >
    &nbsp;
    <div class="bg-garden-200 text-amber-100 px-4"
         style="position: absolute; left: 10px; top: 12px"
    >my tools</div>
  </div>
  {#each userPreferenceTools as userPreferenceTool}
    <div on:click={() => selectUserPreference(userPreferenceTool)} class="px-4 cursor-pointer hover:bg-blue-200 hover:text-amber-950">
      {userPreferenceTool.name.split(':')[1]}
    </div>
  {/each}
</div>