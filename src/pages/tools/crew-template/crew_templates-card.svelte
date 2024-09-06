<style>
  .crew-templates-card {
    min-width: 350px;
    max-width: 450px;
    min-height: 140px;
    max-height: 200px;
    border-radius: 4px;
    text-align: left;
  }

  .tool-name {
    font-weight: bold;
    padding-left: 8px;
  }
  .tool-description {
    padding-left: 8px;
  }

</style>
<script lang="ts">
  import {type User} from "../../../models/user";
  import {onDestroy} from "svelte";
  import SecurityStore from '../../../stores/security-store';

  export let addToolToMe = (next: string): void => {
    console.log(`function addToMe() not yet defined.`)
  }

  let security: {
    loggedInUser: User
  };
  $: security;
  const unsubSecurity = SecurityStore.subscribe(async stored => {
    security = stored as {
      loggedInUser: User
    };
  });
  onDestroy(unsubSecurity);

</script>
<div>
  <div class="crew-templates-card border-2 border-amber-700 bg-amber-50 flex flex-col">
    <div class="tool-name bg-amber-900 text-amber-50 flex flex-row"
         style="height: 30px">
      <div>crew_templates</div>
      <div style="width:100%"></div>
      {#if security && security.loggedInUser}
        <div on:click={() => addToolToMe('crew_templates')} class="hover:bg-amber-50 hover:text-amber-950 border-2 px-4 border-amber-50"
             style="margin-bottom: 2px; border-radius: 2px; cursor: pointer;">
          add2me
        </div>
      {/if}
    </div>
    <div class="tool-description text-blue-950">
      a collection (of template roles) that, when instantiated, is a crew of roles, each of which is to be assigned to
      a person to create a crew of persons, each with a role in a meetup
    </div>
  </div>
</div>