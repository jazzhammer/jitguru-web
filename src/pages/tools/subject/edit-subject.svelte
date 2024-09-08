<style>
  .edit-subject {
    width: 100%;
    text-align: left;
  }
  .topics-panel {
    display: grid;
    grid-template-columns: 1fr 5fr;
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
import SubjectsStore from '../../../stores/subjects-store';
import store from '../../../stores/types';
import {type Subject} from '../../../models/subject';
import SubjectService from '../../../services/subject-service';
import ListTopics from './list-topics.svelte';
import {type Topic} from '../../../models/topic';
import TopicsStore from '../../../stores/topics-store';
import {onDestroy} from "svelte";
import TopicService from "../../../services/topic-service";
import NewTopic from './new-topic.svelte';
import EditTopic from './edit-topic.svelte';

let nextSubject: Partial<Subject> = {
  name: ''
};

let subject: Subject;
$: subject

export let updatedSubject = (updated: Subject): void => {
  console.log(`updated ${JSON.stringify(updated)}`);
};
let canUpdate = false;
$: canUpdate = nextSubject.name && nextSubject.name.trim().length > 0;

const update = (): void => {
  SubjectService.update({
    ...nextSubject
  }).then((response) => {
    const updated = response.data.updated;
    SubjectsStore.set({
      type: store.UPDATE,
      payload: updated
    });
    updatedSubject(updated);
    subject = updated;
  });
}
let mode = 'new';
const setMode = (next: string): void => {
  mode = next;
}
let topic: Topic;
$: topic
const selectedTopic = (next: Topic): void => {
  topic = next;
  setMode('edit');
  TopicsStore.set({
    type: store.READ,
    payload: next
  });
}

const refreshTopics = (subject: Subject): void => {
  if (subject) {
    TopicService.find({
      subject_id: subject.id
    }).then((response) => {
      topics = response.data.matched;
    });
  }

}

let topics: Topic[]
$: topics
let unsubSubject = SubjectsStore.subscribe((scrud) => {
  if (scrud.type == store.READ) {
    nextSubject = scrud.payload;
    subject = scrud.payload;
    refreshTopics(subject);
  }
});
onDestroy(unsubSubject);



const createdTopic =(next: Topic): void => {
  TopicsStore.set({
    type: store.CREATE,
    payload: next
  });
  refreshTopics(subject);
}
const updatedTopic = (next: Topic): void => {
  TopicsStore.set({
    type: store.UPDATE,
    payload: next
  });
  refreshTopics(subject);
}

</script>
<div class="edit-subject flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">subject details: <b>{nextSubject.name}</b></div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div>name</div>
    <div><input bind:value={nextSubject.name}
                placeholder="name"
                class="bg-white text-amber-950 pl-3"/>
    </div>
  </div>
  {#if canUpdate}
  <div on:click={update}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950 cursor-pointer"
      style="border-radius: 3px; min-width: 90px; max-width: 150px; margin-top:12px;"
  >update subject</div>
  {/if}
  <div class="tool text-amber-950 text-left flex flex-col mb-10" style="position: relative;">
    <div class="border-b-2 border-garden-100 mb-4"
         style="width: calc(100% - 5px); position: absolute; top: 0px; left: -8px;"
    >
      <!--    <div class="border-garden-100"-->
      <!--         style="width: 100%; position: absolute; top: 10px; left: 0px; border-bottom: 1px solid">-->
            &nbsp;
      <!--    </div>&nbsp;-->

    </div>
    <div class="bg-garden-200 text-amber-100 px-4"
         style="position: absolute; left: 2px; top: 12px"
    >
      topics for {subject.name}
    </div>
  </div>

  <div class="">
      <div class="menu ml-2">
        {#if mode !== 'new'}
          <div on:click={() => setMode('new')} class="menu-item border-2 border-amber-700 text-center hover:bg-blue-200 cursor-pointer"
               style="border-radius: 3px;"
          >
            new topic
          </div>
        {/if}
      </div>
      <div class="topics-panel mt-3">
        <div class="">
          {#if mode === 'new'}
            <NewTopic subject={subject} createdTopic={createdTopic}></NewTopic>
          {/if}
          {#if mode === 'edit'}
            <EditTopic topic={topic} updatedTopic={updatedTopic}></EditTopic>
          {/if}
        </div>
        <div class="ml-2 h-full">
          {#if !topics || topics.length === 0}
            <div>no topics for subject: {nextSubject.name}</div>
          {:else}
            <div class="bg-amber-100 text-amber-950 px-2">assigned topics</div>
            <ListTopics topics={topics} selected={selectedTopic}></ListTopics>
          {/if}
        </div>
      </div>
  </div>
</div>