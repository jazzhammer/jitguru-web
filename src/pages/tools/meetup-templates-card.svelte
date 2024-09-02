<style>
  .tool-swatch {
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
  import {type User} from "../../models/user";
  import {onDestroy} from "svelte";
  import SecurityStore from '../../stores/security-store';

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
  <div class="tool-swatch border-2 border-amber-700 bg-amber-50 flex flex-col">
    <div class="tool-name bg-amber-900 text-amber-50 flex flex-row"
         style="height: 30px">
      <div>meetup&nbsptemplates</div>
      <div style="width:100%"></div>
      {#if security && security.loggedInUser}
        <div on:click={() => addToolToMe('meetup_templates')} class="hover:bg-amber-50 hover:text-amber-950 border-2 px-4 border-amber-50"
             style="margin-bottom: 2px; border-radius: 2px; cursor: pointer;">
          add2me
        </div>
      {/if}
    </div>
    <div class="tool-description text-blue-950">a description of what should happen in a meetup, including but not limited to:
      <li>persons that are expected to attend,</li>
      <li>their respective roles and </li>
      <li>the meetup's expected outcomes</li>
    </div>
  </div>
</div>