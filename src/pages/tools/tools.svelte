<style>
  .tools {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding-top: 10px;
  }

  .tools > *  {
    margin: 6px;
  }
</style>
<script lang="ts">
  import UserPreferenceService from "../../services/user-preference-service";
  import {UserPreferenceValue} from "../../models/user-preference";
  import {type User} from "../../models/user";
  import {onDestroy} from "svelte";
  import SecurityStore from '../../stores/security-store';
  import UserPreferencesStore from "../../stores/user-preferences-store";
  import store from "../../stores/types";
  import MeetupTemplatesCard from './meetup-template/meetup-templates-card.svelte';
  import SubjectsCard from './subject/subjects-card.svelte';

  let security: {
    loggedInUser: User
  };
  $: security;
  const unsubSecurity = SecurityStore.subscribe(async stored => {
    security = stored as {
      loggedInUser: User
    };
  });
  onDestroy(unsubSecurity);



  const addToolToMe = (toolname: string): void => {
    if (security?.loggedInUser) {
      UserPreferenceService.create({
        name: `tool:${toolname}`,
        value: `${UserPreferenceValue.ENABLED}`,
        user_id: security.loggedInUser.id
      }).then((response) => {
        const created = response.data.created;
        UserPreferencesStore.set({
          type: store.CREATE,
          payload: created
        });
      });
    }
  }
</script>
<div class="tools">
  <div><MeetupTemplatesCard addToolToMe={addToolToMe}></MeetupTemplatesCard></div>
  <div><SubjectsCard addToolToMe={addToolToMe}></SubjectsCard></div>
</div>

