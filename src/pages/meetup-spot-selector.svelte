<script>
  import {API_BASE_URL} from "../settings/api-settings.js";
  import {PREF_SELECTED_FACILITY_ID} from "../models/user-preference.ts"
  import {createEventDispatcher, onDestroy} from "svelte";
  import MeetupSpotsStore from "../stores/meetup_spots-store.js";
  import PermissionsStore from "../stores/permissions-store.js";
  import SecurityStore from "../stores/security-store.js";
  import MeetupSpotSearch from "./meetup-spot-search.svelte";
  import MeetupSpotCreate from "./meetup_spot-create.svelte";

  let mode = 'select_meetup_spot';

  let permissions;
  const unsubPermissions = PermissionsStore.subscribe(stored => {
    permissions = stored;
  });

  const dispatch = createEventDispatcher();

  let meetup_spots;
  const unsubMeetupSpots = MeetupSpotsStore.subscribe(stored => {
    meetup_spots = stored;
    if (!meetup_spots['selected']) {
      if (meetup_spots['meetup_spots']?.length > 0) {
        meetup_spots['selected'] = meetup_spots['meetup_spots'][0];
      }
    }
  });

  let security;
  const unsubSecurity = SecurityStore.subscribe(old => {
    security = old;
  });

  const selectMeetupSpot = (meetup_spot) => {
    MeetupSpotsStore.update(old => {
      return {
        ...old,
        selected: meetup_spot
      }
    });
    if (security.loggedInUser) {
      fetch(`${API_BASE_URL}users/preference`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: security.loggedInUser.id,
          name: PREF_SELECTED_FACILITY_ID,
          value: meetup_spot.id
        })
      });
    }
    dispatch('selectedMeetupSpot', meetup_spot);
  }

  onDestroy(()=>{
    unsubSecurity();
    unsubMeetupSpots();
    unsubPermissions();
  })

  function createdMeetupSpot(created) {
    dispatch('createdMeetupSpot', created)
  }

</script>
<main class="flex flex-col w-64 text-black text-left">
  {#if meetup_spots && meetup_spots.meetup_spots?.length > 0}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      {#if mode!=='select_meetup_spot'}
        <div on:click={()=>mode='select_meetup_spot'} class="cursor-pointer rounded-xl bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {:else}
        <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {/if}
      {#if mode!=='select_meetup_spot'}
        <div on:click={() => mode = 'select_meetup_spot'} class="cursor-pointer hover:text-garden-400">go to another meetup_spot:</div>
      {:else}
        <div class="">go to another meetup_spot:</div>
      {/if}
    </div>
    {#if mode==='select_meetup_spot'}
      {#each meetup_spots.meetup_spots as meetup_spot}
        {#if !meetup_spots.selected || meetup_spot.id !== meetup_spots.selected.id}
          <div class="flex flex-row">
            <div on:click={() => selectMeetupSpot(meetup_spot)} class="pl-2 w-11/12 bg-{meetup_spots.selected?.id === meetup_spot.id ? 'garden-800':'white'} hover:bg-garden-900 cursor-pointer">{meetup_spot.name}</div>
            <div class="w-2 pl-2 pr-3 cursor-pointer hover:bg-cocoa-200 hover:text-white font-bold">-</div>
          </div>
        {/if}
      {/each}
    {/if}
  {/if}
  {#if permissions.add_facility_meetup_spot}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      {#if mode!=='join_meetup_spot'}
        <div on:click={()=>mode='join_meetup_spot'} class="cursor-pointer rounded-xl  bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {:else}
        <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {/if}
      {#if mode!=='include_meetup_spot'}
        <div on:click={() => mode = 'join_meetup_spot'} class="cursor-pointer hover:text-garden-400">include a meetup_spot:</div>
      {:else}
        <div class="">include a meetup_spot:</div>
      {/if}
    </div>
    {#if mode==='join_meetup_spot'}
      <div>
        <MeetupSpotSearch></MeetupSpotSearch>
      </div>
    {/if}
  {/if}
  {#if permissions.add_meetup_spot}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      {#if mode!=='create_meetup_spot'}
        <div on:click={()=>mode='create_meetup_spot'} class="cursor-pointer rounded-xl  bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {:else}
        <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {/if}
      {#if mode!=='create_meetup_spot'}
        <div on:click={() => mode = 'create_meetup_spot'} class="cursor-pointer hover:text-garden-400">create a meetup_spot:</div>
      {:else}
        <div class="">create a meetup_spot:</div>
      {/if}
    </div>
    {#if mode==='create_meetup_spot'}
      <div>
        <MeetupSpotCreate on:createdMeetupSpot={(created) => createdMeetupSpot(created)}></MeetupSpotCreate>
      </div>
    {/if}
  {/if}
</main>