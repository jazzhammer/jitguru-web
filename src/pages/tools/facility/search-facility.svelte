<style>
  .search-facility {
    width: 100%;
    text-align: left;
  }

</style>
<script lang="ts">
import {type Facility} from "../../../models/facility";
import FacilityService from "../../../services/facility-service";

let newFacility: Partial<Facility> = {
  name: ''
};
export let created = (next: Facility): void => {
  console.log(`created ${JSON.stringify(created)}`);
};

export let found = (next: Facility[]): void => {
  console.log(`found ${JSON.stringify(next)}`);
}

let search_term = '';
let searchTimeout;
const search = (): void => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    FacilityService.find({
      name: search_term
    }).then((response) => {
      const founds = response.data.matched;
      found(founds);
    });
  }, 450);
}
</script>
<div class="search-facility flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2 text-left">browse facilities</div>
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 300px; padding-left: 8px; margin-top: 8px;">
    <div>search</div>
    <div>
      <input on:keyup={search}
             bind:value={search_term}
             placeholder="search term"
             class="bg-white text-amber-950 pl-3 border-2 border-gray-300"
             style="width: calc(100% - 3px);"
      />
    </div>
  </div>
</div>