<style>
  .list-meetup-templates {
    width: 300px;
    display: grid;
    grid-template-columns: 1fr;
    margin-left: 0px;
    margin-top: 8px;
    border: solid 1px white;
  }

  .item {
    border: solid 1px white;
    padding-left: 3px;
  }
</style>
<script lang="ts">

  import {type MeetupTemplate} from "../../../models/meetup-template";

  export let meetupTemplates: MeetupTemplate[] = [];
  export let selected = (next: MeetupTemplate): void => {
    console.log(`slected ${JSON.stringify(next)}`);
  }
</script>
<div class="list-meetup-templates">
  {#if meetupTemplates && meetupTemplates.length}
    <div class="text-center bg-white">name</div>
    {#each meetupTemplates as meetupTemplate}
      <div on:click={() => selected(meetupTemplate)}
           class="item hover:bg-blue-200 cursor-pointer">
        {meetupTemplate.name}
      </div>
    {/each}
  {/if}
</div>