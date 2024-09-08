<style>
  .list-topics {
    width: 400px;
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

  import {type Topic} from '../../../models/topic';

  export let topics: Topic[] = [];
  export let selected = (next: Topic): void => {
    console.log(`selected ${JSON.stringify(next)}`);
  }
</script>
<div class="list-topics">
  {#if topics && topics.length}
    <div class="text-center bg-white">name</div>
    {#each topics as topic}
      <div on:click={() => selected(topic)} class="item hover:bg-blue-200 cursor-pointer">{topic.name}</div>
    {/each}
  {/if}
</div>