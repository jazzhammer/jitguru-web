<script>
  import {API_BASE_URL} from "../../../settings/api-settings.js";
  import {PREF_SELECTED_FACILITY_ID} from "../../../models/user-preference.ts"
  import {createEventDispatcher, onDestroy} from "svelte";
  import FacilitysStore from "../../../stores/facilitys-store.js";
  import OrgsStore from "../../../stores/orgs-store.js";
  import PermissionsStore from "../../../stores/permissions-store.js";
  import SecurityStore from "../../../stores/security-store.js";
  import FacilitySearch from "./facility-search.svelte";
  import FacilityCreate from "./facility-create.svelte";

  let mode = 'select_facility';

  let permissions;
  const unsubPermissions = PermissionsStore.subscribe(stored => {
    permissions = stored;
  });

  let orgs;
  const unsubOrgs = OrgsStore.subscribe(stored => {
    orgs = stored;
  })

  const dispatch = createEventDispatcher();

  let facilitys;
  const unsubFacilitys = FacilitysStore.subscribe(stored => {
    facilitys = stored;
    if (!facilitys['selected']) {
      if (facilitys['facilitys']?.length > 0) {
        facilitys['selected'] = facilitys['facilitys'][0];
      }
    }
  });

  let security;
  const unsubSecurity = SecurityStore.subscribe(old => {
    security = old;
  });

  const selectFacility = (facility) => {
    if (security.loggedInUser) {
      fetch(`${API_BASE_URL}users/preference`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: security.loggedInUser.id,
          name: PREF_SELECTED_FACILITY_ID,
          value: facility.id
        })
      });
    }
    dispatch('selectedFacility', facility);
  }

  onDestroy(()=>{
    unsubSecurity();
    unsubFacilitys();
    unsubPermissions();
  })

  function createdFacility(created) {
    dispatch('createdFacility', created)
  }

</script>
<main class="flex flex-col w-64 text-black text-left">
  {#if facilitys && facilitys.facilitys?.length > 0}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      {#if mode!=='select_facility'}
        <div on:click={()=>mode='select_facility'} class="cursor-pointer rounded-xl bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {:else}
        <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {/if}
      {#if mode!=='select_facility'}
        <div on:click={() => mode = 'select_facility'} class="cursor-pointer hover:text-garden-400">go to another facility:</div>
      {:else}
        {#if facilitys.facilitys && facilitys.facilitys.length > 0}
          <div class="">go to another facility:</div>
        {/if}
      {/if}
    </div>
    {#if mode==='select_facility'}
      {#each facilitys.facilitys as facility}
        {#if !facilitys.selected || facility.id !== facilitys.selected.id}
          <div class="flex flex-row">
            <div on:click={() => selectFacility(facility)} class="pl-2 w-11/12 bg-{facilitys.selected?.id === facility.id ? 'garden-800':'white'} hover:bg-garden-900 cursor-pointer">{facility.name}</div>
            <div class="w-2 pl-2 pr-3 cursor-pointer hover:bg-cocoa-200 hover:text-white font-bold">-</div>
          </div>
        {/if}
      {/each}
    {/if}
  {/if}
  {#if permissions['api.add_facility']}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      {#if mode!=='join_facility'}
        <div on:click={()=>mode='join_facility'} class="cursor-pointer rounded-xl  bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {:else}
        <div class="rounded-xl pt-2 mr-2"
             style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {/if}
      {#if mode!=='include_facility'}
        <div on:click={() => mode = 'join_facility'} class="cursor-pointer hover:text-garden-400">include a facility in this org:</div>
      {:else}
        <div class="">include a facility:</div>
      {/if}
    </div>
    {#if mode==='join_facility'}
      <div>
        <FacilitySearch></FacilitySearch>
      </div>
    {/if}
  {/if}
  {#if permissions['api.add_facility']}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      {#if mode!=='create_facility'}
        <div on:click={()=>mode='create_facility'} class="cursor-pointer rounded-xl  bg-garden-400 hover:bg-garden-700 pt-2 mr-2"
             style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {:else}
        <div class="rounded-xl pt-2 mr-2"
             style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {/if}
      {#if mode!=='create_facility'}
        <div on:click={() => mode = 'create_facility'} class="cursor-pointer hover:text-garden-400">create a facility:</div>
      {:else}
        <div class="">create a facility:</div>
      {/if}
    </div>
    {#if mode==='create_facility'}
      <div>
        <FacilityCreate on:createdFacility={(created) => createdFacility(created)}></FacilityCreate>
      </div>
    {/if}
  {/if}
</main>