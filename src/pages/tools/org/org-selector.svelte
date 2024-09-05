<script>
  import {API_BASE_URL} from "../../../settings/api-settings.js";
  import {PREF_SELECTED_ORG_ID} from "../../../models/user-preference.ts"
  import {createEventDispatcher} from "svelte";
  import OrgsStore, {ACTION_SELECTED} from "../../../stores/orgs-store.js";
  import {onDestroy} from "svelte";
  import PermissionsStore from "../../../stores/permissions-store.js";
  import SecurityStore from "../../../stores/security-store.js";
  import OrgSearch from './org-search.svelte';
  import OrgCreate from './org-create.svelte';

  let mode = 'select_org';

  let permissions;
  const unsubPermissions = PermissionsStore.subscribe(stored => {
    permissions = stored;
  });

  const dispatch = createEventDispatcher();
  let orgs;
  const unsubOrgs = OrgsStore.subscribe(stored => {
    orgs = stored
  });

  let security;
  const unsubSecurity = SecurityStore.subscribe(old => {
    security = old;
  });

  const selectOrg = (org) => {
    OrgsStore.update(old => {
      return {
        ...old,
        selected: org,
        action: ACTION_SELECTED
      }
    });
    if (security.loggedInUser) {
      fetch(`${API_BASE_URL}users/preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: security.loggedInUser.id,
          name: PREF_SELECTED_ORG_ID,
          value: org.id
        })
      }).then((response) => {
        if (response.status < 300) {
          let pref = response.json();
          console.log(`pref created : ${JSON.stringify(pref)}`);
        }
        throw new Error(`response status ${response.status}`);
      }).catch( (e) => {
        console.log(`while posting preference: ${e}`);
      });
  }
    dispatch('selectedOrg', org);
  }

  onDestroy(()=>{
    unsubSecurity();
    unsubOrgs();
    unsubPermissions();
  })

  function createdOrg(created) {
    dispatch('createdOrg', created)
  }

</script>
<main class="flex flex-col w-64 text-black text-left">
  {#if orgs && orgs.assigned && orgs.assigned.length > 0}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      {#if mode!=='select_org'}
        <div on:click={()=>mode='select_org'} class="cursor-pointer rounded-xl bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {:else}
        <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {/if}
      {#if mode!=='select_org'}
        <div on:click={() => mode = 'select_org'} class="cursor-pointer hover:text-garden-400">go to another org:</div>
      {:else}
        <div class="">go to another org:</div>
      {/if}
    </div>
    {#if mode==='select_org'}
      {#each orgs.assigned as org}
        {#if !orgs.selected || org.id !== orgs.selected.id}
          <div class="flex flex-row">
            <div on:click={() => selectOrg(org)} class="pl-2 w-11/12 bg-{orgs.selected?.id === org.id ? 'garden-800':'white'} hover:bg-garden-900 cursor-pointer">{org.name}</div>
            <div class="w-2 pl-2 pr-3 cursor-pointer hover:bg-cocoa-200 hover:text-white font-bold">-</div>
          </div>
        {/if}
      {/each}
    {/if}
  {/if}
  {#if permissions.assign_org_to_self}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      {#if mode!=='join_org'}
        <div on:click={()=>mode='join_org'} class="cursor-pointer rounded-xl  bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {:else}
        <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {/if}
      {#if mode!=='join_org'}
        <div on:click={() => mode = 'join_org'} class="cursor-pointer hover:text-garden-400">join an org:</div>
      {:else}
        <div class="">join an org:</div>
      {/if}
    </div>
    {#if mode==='join_org'}
      <div>
        <OrgSearch></OrgSearch>
      </div>
    {/if}
  {/if}
  {#if permissions.add_org}
    <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200 flex flex-row">
      {#if mode!=='create_org'}
        <div on:click={()=>mode='create_org'} class="cursor-pointer rounded-xl  bg-garden-400 hover:bg-garden-700 pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {:else}
        <div class="rounded-xl pt-2 mr-2" style="margin-top: 6px; height: 4px; width: 8px;"></div>
      {/if}
      {#if mode!=='create_org'}
        <div on:click={() => mode = 'create_org'} class="cursor-pointer hover:text-garden-400">create an org:</div>
      {:else}
        <div class="">create an org:</div>
      {/if}
    </div>
    {#if mode==='create_org'}
      <div>
        <OrgCreate on:createdOrg={(created) => createdOrg(created)}></OrgCreate>
      </div>
    {/if}
  {/if}
</main>