<script>
  import {createEventDispatcher} from "svelte";
  import OrgsStore from "../orgs-store.js";
  import {onDestroy} from "svelte";
  const dispatch = createEventDispatcher();
  let orgs;
  const unsubOrgs = OrgsStore.subscribe(old => {
    orgs = old
  });
  onDestroy(()=>unsubOrgs())

  const selectOrg = (org) => {
    OrgsStore.update(old => {
      return {
        ...old,
        selected: org
      }
    });
    dispatch('selectedOrg', org);
  }
</script>
<main class="flex flex-col w-64 text-black text-left">
  <div class="pl-2 italic border-b-2 bg-stone-800 font-bold border-garden-200">goto another org:</div>
  {#each orgs.assigned as org}
    {#if !orgs.selected || org.id !== orgs.selected.id}
      <div class="flex flex-row">
        <div on:click={() => selectOrg(org)} class="pl-2 w-11/12 bg-{orgs.selected?.id === org.id ? 'garden-800':'white'} hover:bg-garden-900 cursor-pointer">{org.name}</div>
        <div class="w-2 pl-2 pr-3 cursor-pointer hover:bg-cocoa-200 hover:text-white font-bold">-</div>
      </div>
    {/if}
  {/each}
</main>