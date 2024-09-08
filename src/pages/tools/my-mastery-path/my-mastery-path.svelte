<style>
  .my-mastery-path {
    width: 100%;
    text-align: left;
  }

  .menu {
    display: flex;
    flex-direction: row;
  }
  .menu-item {
    min-width: 100px;
    margin-right: 8px;
  }
</style>
<script lang="ts">
  // import NewMeetupTemplate from './new-meetup-template.svelte';
  // import SearchMeetupTemplate from './search-meetup-template.svelte';
  // import ListMeetupTemplates from './list-my-mastery-path.svelte';
  // import EditMeetupTemplate from './edit-meetup-template.svelte';
  import {type MeetupTemplate} from "../../../models/meetup-template";
  // import MeetupTemplatesStore from "../../../stores/my-mastery-path-store";
  import store from "../../../stores/types";
  let mode = 'search';
  $: mode
  const setMode = (next: string): void => {
    mode = next;
  }

  let meetupTemplate: MeetupTemplate;
  $: meetupTemplate
  const createdMeetupTemplate = (next: MeetupTemplate): void => {
    meetupTemplate = next;
    mode = 'search';
  }

  const executeSearch = (): void => {

  }

  let timeoutSearch;
  const search = (): void => {
    if (timeoutSearch) {
      clearTimeout(timeoutSearch);
    }
    timeoutSearch = setTimeout(() => {
      executeSearch();
    }, 400);
  }

  let meetupTemplates;
  $: meetupTemplates
  const found = (founds: MeetupTemplate[]): void => {
    meetupTemplates = founds;
  }

  const selectedMeetupTemplate = (next: MeetupTemplate): void => {
    meetupTemplate = next;
    mode = 'edit';
    // MeetupTemplatesStore.set({
    //   type: store.READ,
    //   payload: meetupTemplate
    // });
  }

  const updatedMeetupTemplate = (next: MeetupTemplate) => {
    meetupTemplate = next;
  }

</script>
<div class="my-mastery-path">
  <div class="menu ml-3">
    <!--{#if mode !== 'new'}-->
    <!--  <div on:click={() => setMode('new')} class="menu-item border-2 border-amber-700 text-center hover:bg-blue-200 cursor-pointer"-->
    <!--       style="border-radius: 3px;"-->
    <!--  >-->
    <!--    new-->
    <!--  </div>-->
    <!--{/if}-->
    <!--{#if mode !== 'search'}-->
    <!--  <div on:click={() => setMode('search')} class="menu-item border-2 border-amber-700 text-center hover:bg-blue-200 cursor-pointer"-->
    <!--       style="border-radius: 3px;"-->
    <!--  >-->
    <!--    search-->
    <!--  </div>-->
    <!--{/if}-->
  </div>
  <div class="ml-3 mt-3">
    <!--{#if mode === 'new'}-->
    <!--  <NewMeetupTemplate createdMeetupTemplate="{createdMeetupTemplate}"></NewMeetupTemplate>-->
    <!--{/if}-->
    <!--{#if mode === 'search'}-->
    <!--  <SearchMeetupTemplate found="{found}"></SearchMeetupTemplate>-->
    <!--  {#if meetupTemplates && meetupTemplates.length > 0}-->
    <!--    <ListMeetupTemplates meetupTemplates={meetupTemplates} selected={selectedMeetupTemplate}></ListMeetupTemplates>-->
    <!--  {/if}-->
    <!--{/if}-->
    <!--{#if mode === 'edit'}-->
    <!--  <EditMeetupTemplate updatedMeetupTemplate="{updatedMeetupTemplate}"></EditMeetupTemplate>-->
    <!--{/if}-->
  </div>
</div>