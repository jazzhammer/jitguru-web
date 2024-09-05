<style>
  .search-subject {
    width: 100%;
    text-align: left;
  }

</style>
<script lang="ts">
import SubjectsStore from "../../../stores/subjects-store";
import store from "../../../stores/types";
import {type Subject} from "../../../models/subject";
import SubjectService from "../../../services/subject-service";

let newSubject: Partial<Subject> = {
  name: ''
};
export let created = (next: Subject): void => {
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
    created(created)
  });
}

export let found = (next: Subject[]): void => {
  console.log(`found ${JSON.stringify(next)}`);
}

let search_term = '';
let searchTimeout;
const search = (): void => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    SubjectService.find({
      name: search_term
    }).then((response) => {
      const founds = response.data.matched;
      found(founds);
    });
  }, 450);
}
</script>
<div class="search flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">browse subjects</div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div>search</div>
    <div>
      <input on:keyup={search}
             bind:value={search_term}
             placeholder="search term"
             class="bg-white text-amber-950 pl-3"/>
    </div>
  </div>
</div>