<style>
  .list-meetup-spot {
    width: 100%;
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

  import {type MeetupSpot} from "../../../models/meetup_spot";

  export let meetupSpots: MeetupSpot[] = [];
  export let selected = (next: MeetupSpot): void => {
    console.log(`selected ${JSON.stringify(next)}`);
  }
</script>
<div class="list-meetup-spot">
  {#if meetupSpots && meetupSpots.length}
    <div class="text-center bg-amber-100 w-full">name</div>
    {#each meetupSpots as meetupSpot}
      <div on:click={() => selected(meetupSpot)} class="item hover:bg-blue-200 cursor-pointer text-left">{meetupSpot.name}</div>
    {/each}
  {/if}
</div>