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
    padding: 8px;
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
<div class="">
  <div class="tool-swatch border-2 border-amber-700 bg-amber-50 flex flex-col">
    <div class="tool-name bg-amber-900 text-amber-50 flex flex-row"
         style="height: 30px">
      <div>my&nbsp;mastery&nbsp;path</div>
      <div style="width:100%"></div>
      {#if security && security.loggedInUser}
        <div on:click={() => addToolToMe('my_mastery_path')} class="hover:bg-amber-50 hover:text-amber-950 border-2 px-4 border-amber-50"
             style="margin-bottom: 2px; border-radius: 2px; cursor: pointer;">
          add2me
        </div>
      {/if}
    </div>
    <div class="tool-description text-blue-950">
      plan, execute, and monitor your path to mastery of through
      <li>your selection of meetups with gurus and topics,</li>
      <li>attendance at meetups for targeted mentorship, and</li>
      <li>building upon successes to reach your ultimate goals</li>
    </div>
  </div>
</div>