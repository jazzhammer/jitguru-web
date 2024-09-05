<style>
  .new-topic {
    width: 100%;
    text-align: left;
  }

</style>
<script lang="ts">
import TopicsStore from "../../../stores/topics-store";
import store from "../../../stores/types";
import {type Topic} from "../../../models/topic";
import TopicService from "../../../services/topic-service";
import {type Subject} from "../../../models/subject";

let newTopic: Partial<Topic> = {
  name: '',
  subject_id: null
};
export let createdTopic = (next: Topic): void => {
  console.log(`created ${JSON.stringify(next)}`);
};

export let subject: Subject;
$: newTopic.subject_id = subject?.id


let canCreate = false;
$: canCreate = newTopic.name && newTopic.name.trim().length > 0;

const create = (): void => {
  TopicService.create({
    ...newTopic
  }).then((response) => {
    const created = response.data.created;
    TopicsStore.set({
      type: store.CREATE,
      payload: created
    });
    createdTopic(created)
  });
}
const keyupTopicName = (e: KeyboardEvent): void => {
  if (e.code === 'Enter') {
    create();
  }
}
</script>
<div class="new-topic flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">new topic</div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div style="width: 80px;">name</div>
    <div>
      <input on:keyup={keyupTopicName} bind:value={newTopic.name} placeholder="new topic name"
             class="bg-white text-amber-950 pl-3"/>
    </div>
  </div>
  {#if canCreate}
  <div on:click={create}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950"
      style="border-radius: 3px; min-width: 90px; max-width: 150px; margin-top:12px;"
  >create topic</div>
  {/if}
</div>