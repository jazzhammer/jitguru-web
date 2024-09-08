<style>
  .new-subject {
    width: 100%;
    text-align: left;
  }

</style>
<script lang="ts">
import SubjectsStore from "../../../stores/subjects-store";
import store from "../../../stores/types";
import {type Subject} from "../../../models/subject";
import SubjectService from "../../../services/subject-service";
import MessagesStore from "../../../stores/messages-store.js";

let newSubject: Partial<Subject> = {
  name: ''
};
export let createdSubject = (next: Subject): void => {
  console.log(`created ${JSON.stringify(created)}`);
};
let canCreate = false;
$: canCreate = newSubject.name && newSubject.name.trim().length > 0;

const create = (): void => {
  SubjectService.create({
    ...newSubject
  }).then((response) => {
    const created = response.data.created;
    SubjectsStore.set({
      type: store.CREATE,
      payload: created
    });
    MessagesStore.update(old => {
      return {
        ...old,
        subject: `subject created: ${created.name}`
      }
    });
    createdSubject(created)
  });
}

</script>
<div class="new-subject flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">new subject</div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div>name</div><div><input bind:value={newSubject.name} placeholder="name" class="bg-white text-amber-950 pl-3"/></div>
  </div>
  {#if canCreate}
  <div on:click={create}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950"
      style="border-radius: 3px; min-width: 90px; max-width: 150px; margin-top:12px;"
  >create</div>
  {/if}
</div>