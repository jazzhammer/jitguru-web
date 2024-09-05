<style>
  .edit-topic {
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
import store from '../../../stores/types';
import {type Topic} from '../../../models/topic';
import TopicsStore from '../../../stores/topics-store';
import TopicService from "../../../services/topic-service";

export let topic: Topic;
$: topic

let nextTopic: Partial<Topic> = {
  id: topic.id,
  name: topic.name,
  subject_id: topic.subject_id
};


let canUpdate = false;
$: canUpdate = nextTopic.name && nextTopic.name.trim().length > 0;

const update = (): void => {
  TopicService.update({
    ...nextTopic
  }).then((response) => {
    const updated = response.data.updated;
    TopicsStore.set({
      type: store.UPDATE,
      payload: updated
    });
    updatedTopic(updated);
    topic = updated;
  });
}

export let updatedTopic = (next: Topic): void => {
  console.log(`updatedTopic(${JSON.stringify(next)})`);
}

const keyupTopicName = (e: KeyboardEvent): void => {
  if (e.code === 'Enter') {
    update();
  }
}
</script>
<div class="edit-topic flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">update topic</div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div style="width: 80px;">name</div>
    <div>
      <input on:keyup={keyupTopicName} bind:value={nextTopic.name}
             class="bg-white text-amber-950 pl-3"/>
    </div>
  </div>
  {#if canUpdate}
  <div on:click={update}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950"
      style="border-radius: 3px; min-width: 90px; max-width: 150px; margin-top:12px;"
  >update topic</div>
  {/if}
</div>