<script>
  import SecurityStore from "../store.js";
  import PermissionsStore from "../permissions-store.js";
  import {onDestroy} from "svelte";
  import {API_BASE_URL} from "../settings/api-settings.js";
  import OrgSelector from "./org-selector.svelte";

  import OrgsStore from "../orgs-store.js";
  let orgs;
  const unsubOrgs = OrgsStore.subscribe(stored => {
    orgs = stored;
  });

  let permissions;
  const unsubPermissions = PermissionsStore.subscribe(stored => {
    permissions = stored;
  });

  let security;
  const unsub = SecurityStore.subscribe(async stored => {
    security = stored;
    if (security && security['loggedInUser']) {
      let response = await fetch(`${API_BASE_URL}users/permission?user_id=${security['loggedInUser'].id}&permission=assign_org_to_self`
        , {
          method: 'GET'
        });
      const permissionJson = await response.json();
      if (permissionJson['hasPermission']) {
        // permissions.push('assign_org_to_self');
        PermissionsStore.update(old => {
          return {
            ...old,
            assign_org_to_self: permissionJson['hasPermission']
          }
        })
      }
      response = await fetch(`${API_BASE_URL}users/orgs?user_id=${security['loggedInUser'].id}`,{
        method: 'GET'
      });
      const orgsJson = await response.json();
      OrgsStore.update(old => {
        const next = {
          ...old,
          "assigned": orgsJson.assigned,
        };
        if (!old['selected']) {
          if (orgsJson.assigned.length > 0) {
            next['selected'] = orgsJson.assigned[0];
          }
        }
        return next;
      });

    }

  });
  onDestroy(()=>{
    unsub();
    unsubPermissions();
    unsubOrgs();
  });

  let orgSelector = false;
  function showOrgSelector(show) {
    console.log(`showOrgSelector(${show})`)
    orgSelector = show;
  }
  function toggleOrgSelector() {
    console.log(`toggleOrgSelector()`)
    orgSelector = !orgSelector;
  }

</script>
<main class="flex flex-col text-black m-0 h-full w-screen">
  <div id="banner" class="h-7 bg-garden-200 text-white mr-1 flex flex-row">
    <div id="banner" class=" bg-garden-200 text-white text-left logo-text pl-2" style="padding-top: 2px">jitguru</div>
    <div class="text-sm pt-1 ml-2">{security?.loggedInUser?.first_name.toLowerCase()}</div>
    {#if orgs}
      {#if orgs.selected}
        <div class="relative">
          <div class="text-sm pt-1 ml-2 cursor-pointer relative" on:click={() => toggleOrgSelector()}>
            @{orgs?.selected?.name}
          </div>
          {#if orgSelector}
            <div class="absolute top-7 left-0 bg-white border-2 border-garden-200 w-fit text-sm">
              <OrgSelector on:selectedOrg={() => {showOrgSelector(false)}}></OrgSelector>
            </div>
          {/if}
        </div>
      {:else if !orgs.selected}
        {#if permissions?.assign_org_to_self}
          <div class="ml-2 cursor:pointer">+</div>
        {/if}
      {/if}
    {/if}
  </div>
</main>
