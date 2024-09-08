<style>
  .search-meetup-template {
    width: 100%;
    text-align: left;
  }

</style>
<script lang="ts">

import {type MeetupTemplate} from "../../../models/meetup-template";
import MeetupTemplateService from "../../../services/meetup-template-service";


export let created = (next: MeetupTemplate): void => {
  console.log(`created ${JSON.stringify(created)}`);
};


export let found = (next: MeetupTemplate[]): void => {
  console.log(`found ${JSON.stringify(next)}`);
}

let search_term = '';
let searchTimeout;
const search = (): void => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    MeetupTemplateService.find({
      name: search_term
    }).then((response) => {
      const founds = response.data.matched;
      found(founds);
    });
  }, 450);
}
</script>
<div class="search-meetup-template flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2">browse meetup_templates</div>
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