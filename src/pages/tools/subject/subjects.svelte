<style>
  .tool {
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
  import NewSubject from './new-subject.svelte';
  import SearchSubject from './search-subject.svelte';
  import ListSubjects from './list-subjects.svelte';
  import EditSubject from './edit-subject.svelte';
  import {type Subject} from "../../../models/subject";
  import SubjectsStore from "../../../stores/subjects-store";
  import store from "../../../stores/types";

  import MessagesStore from "../../../stores/messages-store.js";

  let message = '';
  $: message
  const unsubMessages = MessagesStore.subscribe((next: any) => {
    message = next.subject;
    setTimeout(() => {
      message = '';
    }, 4000);
  });

  let mode = 'search';
  $: mode
  const setMode = (next: string): void => {
    mode = next;
  }

  let subject: Subject;
  $: subject
  const createdSubject = (next: Subject): void => {
    subject = next;
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

  let subjects;
  $: subjects
  const found = (founds: Subject[]): void => {
    subjects = founds;
  }

  const selectedSubject = (next: Subject): void => {
    subject = next;
    mode = 'edit';
    SubjectsStore.set({
      type: store.READ,
      payload: subject
    });
  }

  const updatedSubject = (next: Subject) => {
    subject = next;
  }

</script>
<div class="tool">
  <div class="menu ml-3">
    {#if mode !== 'new'}
      <div on:click={() => setMode('new')} class="menu-item border-2 border-amber-700 text-center hover:bg-blue-200 cursor-pointer"
        style="border-radius: 3px;"
      >
        new
      </div>
    {/if}
    {#if mode !== 'search'}
      <div on:click={() => setMode('search')} class="menu-item border-2 border-amber-700 text-center hover:bg-blue-200 cursor-pointer"
           style="border-radius: 3px;"
      >
        search
      </div>
    {/if}
    {#if message}
    <div>{message}</div>
    {/if}
  </div>
  <div class="ml-3 mt-3">
    {#if mode === 'new'}
      <NewSubject createdSubject="{createdSubject}"></NewSubject>
    {/if}
    {#if mode === 'search'}
      <SearchSubject found="{found}"></SearchSubject>
      {#if subjects && subjects.length > 0}
        <ListSubjects subjects={subjects} selected={selectedSubject}></ListSubjects>
      {/if}
    {/if}
    {#if mode === 'edit'}
      <EditSubject updatedSubject="{updatedSubject}"></EditSubject>
    {/if}
  </div>
</div>