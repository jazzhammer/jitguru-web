<script>
  import SecurityStore from "../store.js";
  import PermissionsStore from "../permissions-store.js";

  import {onDestroy} from "svelte";
  import {API_BASE_URL} from "../settings/api-settings.js";
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
        console.log(`assigning orgs: ${orgsJson.assigned}`);
        return {
          ...old,
          "assigned": orgsJson.assigned
        }
      });

    }

  });
  onDestroy(()=>{
    unsub();
    unsubPermissions();
    unsubOrgs();
  });



</script>
<main class="flex flex-col text-black m-0 h-full w-screen">
  <div id="banner" class="h-7 bg-garden-200 text-white mr-1 flex flex-row">
    <div id="banner" class=" bg-garden-200 text-white text-left logo-text pl-2" style="padding-top: 2px">jitguru</div>
    <div class="text-sm pt-1 ml-2">{security?.loggedInUser?.first_name.toLowerCase()}</div>
    {#if security}
      {#if security.selectedOrg}
        <div class="text-sm pt-1 ml-2">@{security?.selectdOrg?.name}</div>
      {:else if !security.selectedOrg}
        {#if permissions?.assign_org_to_self}
          <div class="text-sm pt-1 ml-2">+</div>
        {/if}
      {/if}
    {/if}
  </div>
  <div class="flex flex-col">
    {#if orgs.assigned}
      {#each orgs.assigned as org}
        <div>{org.name}</div>
      {/each}
    {:else}
      orgs: {JSON.stringify(orgs)}
    {/if}
  </div>
</main>