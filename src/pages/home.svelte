<script lang="ts">
  import SecurityStore from "../stores/security-store.js";
  import PermissionsStore from "../stores/permissions-store.js";
  import FacilitysStore from "../stores/facilitys-store.js";
  import MeetupSpotsStore from "../stores/meetup_spots-store.js";
  import PersonsStore from "../stores/persons-store.js";
  import OrgsStore from "../stores/orgs-store.js";
  import UserGroupsStore from "../stores/user-groups-store.js";
  import UserPreferencesStore from '../stores/user-preferences-store.js';
  import {PREF_SELECTED_ORG_ID, type UserPreference} from '../models/user-preference.js';
  import {onDestroy} from "svelte";
  import {API_BASE_URL} from "../settings/api-settings.js";
  import OrgSelector from "./tools/org/org-selector.svelte";
  import MeetupSpotSelector from "./tools/meetup-spot/meetup-spot-selector.svelte";
  import PersonSelector from "./tools/person/person-selector.svelte";
  import FacilitySelector from "./tools/facility/facility-selector.svelte";
  import {navigate} from "svelte-routing";
  import store from "../stores/types.js";
  import {type Facility} from "../models/facility";
  import MyTools from './tools/my-tools.svelte';
  import Tools from './tools/tools.svelte';
  import UserService from "../services/user-service";
  import {type User} from "../models/user";
  import UserPreferenceService from "../services/user-preference-service";
  import Tool from './tools/tool.svelte';

  let mode = '';
  $: mode
  const setMode = (next: string): void => {
    mode = next;
    loginMode = false;
  }

  let toolName;
  $: toolName
  let preferences;
  const unsubPreferences = UserPreferencesStore.subscribe(stored => {
    preferences = stored;
    if (preferences.type === store.READ && preferences.payload) {
      const pref: UserPreference = preferences.payload;
      if (pref.name.startsWith('tool:')) {
        toolName = pref.name.split(':')[1];
        mode='tool';
      }
    }
  });

  let permissions;
  const unsubPermissions = PermissionsStore.subscribe(stored => {
    permissions = stored;
  });

  let userGroups;
  const unsubUserGroups = UserGroupsStore.subscribe(stored => {
    userGroups = stored;
  });

  let orgs;
  const unsubOrgs = OrgsStore.subscribe(async (stored) => {
    orgs = stored;
    await refreshFacilitys();
  });

  let facilitys: {
    selected?: any
  };
  const unsubFacilitys = FacilitysStore.subscribe(stored => {
    facilitys = stored;
  });

  let meetup_spots: {
    selected?: any
  };
  const unsubMeetupSpots = MeetupSpotsStore.subscribe(stored => {
    meetup_spots = stored;
  });

  let persons;
  $: persons
  const unsubPersons = PersonsStore.subscribe(async (stored) => {
    persons = stored;
  });


  /**                                .__  __                          __
    ______ ____   ____  __ _________|__|/  |_ ___.__.   ______ _____/  |_ __ ________
   /  ___// __ \_/ ___\|  |  \_  __ \  \   __<   |  |  /  ___// __ \   __\  |  \____ \
   \___ \\  ___/\  \___|  |  /|  | \/  ||  |  \___  |  \___ \\  ___/|  | |  |  /  |_> >
   /____  >\___  >\___  >____/ |__|  |__||__|  / ____| /____  >\___  >__| |____/|   __/
   \/     \/     \/                       \/           \/     \/           |__|

   * we overhaul system state any time the the security state is updated because
   * a lot of shit has to happen on the basis of the loggedInUser's details, eg:
   * user preferences
   * assigned orgs
   * assigned orgs' facilitys
   * the object hierarch dependencies need to be followed. so this is what we do:
   *
   * refresh the permissions & preferences
   *    we do this first because what we do with everything else we fetch depends on them
   *    they come from the api as arrays.
   *    we has them so we can do quick calls for :
   *      hasPermission(<permissionName>) and
   *      preferenceFor(<preferenceName>)
   * clear the orgs state, then because we know that
   * a user has 0-n assigned orgs, retrieve these.
   *    if there is a preference for one of them, set selected org to that preferenced org
   *    if there isn't a preference, and there's at least one org in the assigned orgs,
   *    set selected org to the first org in the set.
   *
   * if after all that, there is a selected org,
   */
  let userPreferenceTools;
  $: userPreferenceTools
  const refreshTools = (): void => {
    if (security && security.loggedInUser) {
      UserPreferenceService.find({
        name: 'tool:',
        user_id: security.loggedInUser.id
      }).then((response) => {
        // debugger;
        userPreferenceTools = response.data.data;
      })
    }
  }


  let security: {
    loggedInUser: User
  };
  $: security;
  const unsubSecurity = SecurityStore.subscribe(async stored => {
    security = stored as {
      loggedInUser: User
    };
    // console.log(`next security: ${JSON.stringify(security)}`)
    if (security && security['loggedInUser']) {
      const user_id = security['loggedInUser']['id'];
      await setupPermissions(user_id);
      await setupPreferences(user_id);
      await setupUserOrgs(user_id);

    }
    refreshTools();
  });

  onDestroy(()=>{
    unsubSecurity();
    unsubPermissions();
    unsubPreferences();
    unsubOrgs();
    unsubFacilitys();
    unsubMeetupSpots();
    unsubPersons();
    unsubUserPreferences();
  });

  let userPreferences;
  $: userPreferences
  const unsubUserPreferences = UserPreferencesStore.subscribe(async (stored) => {
    userPreferences = stored;
    refreshTools();
  });
  refreshTools();
  // ======================================================
  /**                           .__              .__
   ______   ___________  _____ |__| ______ _____|__| ____   ____   ______
   \____ \_/ __ \_  __ \/     \|  |/  ___//  ___/  |/  _ \ /    \ /  ___/
   |  |_> >  ___/|  | \/  Y Y  \  |\___ \ \___ \|  (  <_> )   |  \\___ \
   |   __/ \___  >__|  |__|_|  /__/____  >____  >__|\____/|___|  /____  >
   |__|        \/            \/        \/     \/               \/     \/
   */
  // ------------------------------------------------------
  async function setupPermissions(user_id) {
    const response = await fetch(`${API_BASE_URL}users/permission?user_id=${user_id}`, {
      method: 'GET'
    });
    const responseJson = await response.json();
    const permissionsArrayJson = JSON.parse(responseJson);
    const permissionsHash = permissionsArrayJson.reduce((acc, val) => {
      acc[val] = true;
      return acc;
    }, {});
    // console.log(`permissions hash: ${JSON.stringify(permissionsHash)}`);
    PermissionsStore.update(old => {
      return permissionsHash
    });

    const groupsResponse = await fetch(`${API_BASE_URL}users/user_groups?user_id=${user_id}`, {
      method: 'GET'
    });
    const groupsResponseJson = await groupsResponse.json();
    const groupsArrayJson = groupsResponseJson['user_groups'];
    const groupsHash = groupsArrayJson.reduce((acc, val) => {
      acc[val['name']] = true;
      return acc;
    }, {});
    // console.log(`groups hash: ${JSON.stringify(groupsHash)}`);
    UserGroupsStore.update(old => {
      return groupsHash
    });

  }
  /**                      _____
   * _____________   _____/ ____\___________   ____   ____   ____  ____   ______
   * \____ \_  __ \_/ __ \   __\/ __ \_  __ \_/ __ \ /    \_/ ___\/ __ \ /  ___/
   * |  |_> >  | \/\  ___/|  | \  ___/|  | \/\  ___/|   |  \  \__\  ___/ \___ \
   * |   __/|__|    \___  >__|  \___  >__|    \___  >___|  /\___  >___  >____  >
   * |__|               \/          \/            \/     \/     \/    \/     \/
   * * */
  async function setupPreferences(user_id) {
    const response = await fetch(`${API_BASE_URL}users/preference?user_id=${user_id}`, {
      method: 'GET'
    });
    debugger;
    const responseJson = await response.json();
    preferences = responseJson.data;

    const preferencesHash = preferences.reduce((acc, pref) => {
      acc[pref.name] = pref.value;
      return acc;
    }, {});
    UserPreferencesStore.update(old => {
      return preferencesHash
    });
  }
  /**   ___________  ____  ______
   *  /  _ \_  __ \/ ___\/  ___/
   * (  <_> )  | \/ /_/  >___ \
   *  \____/|__|  \___  /____  >
   *             /_____/     \/
   **/
  async function setupUserOrgs(user_id) {
    const response = await fetch(`${API_BASE_URL}users/orgs?user_id=${user_id}`);
    const orgsJson = await response.json();
    OrgsStore.update(old => {
      const next = {
        ...old,
        assigned: orgsJson.assigned,
        selected: null
      }
      // console.log(`stored assigned orgs: ${JSON.stringify(next.assigned)}`);
      if (orgsJson.assigned && orgsJson.assigned.length > 0) {
        if (preferences) {
          // console.log(`preferences: ${JSON.stringify(preferences)}`);
          if (preferences[PREF_SELECTED_ORG_ID]) {
            next.selected = orgsJson.assigned.find(org => {
              // console.log(`org.id ${org.id} vs ${parseInt(preferences[PREF_SELECTED_ORG_ID])}`);
              return org.id === parseInt(preferences[PREF_SELECTED_ORG_ID]);
            });
            console.log(`stored selected org: ${JSON.stringify(next.selected)}`);
          } else {
            console.log(`no selected org preference. unable to set selected org to preference`);
          }
        } else {
          console.log(`no preferences. unable to set selected org to preference`);
        }
      }

      if (!next.selected) {
        next.selected = orgsJson.assigned && orgsJson.assigned.length > 0 ? orgsJson[0] : null;
      }
      return next;
    });
  }
  /**  _____              .__.__  .__  __
   * _/ ____\____    ____ |__|  | |__|/  |_ ___.__. ______
   * \   __\\__  \ _/ ___\|  |  | |  \   __<   |  |/  ___/
   *  |  |   / __ \\  \___|  |  |_|  ||  |  \___  |\___ \
   *  |__|  (____  /\___  >__|____/__||__|  / ____/____  >
   *             \/     \/                  \/         \/
   * the facilitys set depends on selected org
   **/


  async function refreshFacilitys() {
    const next: {
      facilitys: Facility[]
    } = {
      facilitys: null
    };
    if (orgs.selected) {
      const response = await fetch(`${API_BASE_URL}facilitys?org_id=${orgs.selected.id}`, {
        method: 'GET'
      });
      const responseJson = await response.json();
      next.facilitys = responseJson.matched;
    }
    FacilitysStore.update(old => {
      return next;
    });
  }

  async function handleUserPreferenceSelectedOrgId(org_id) {
    const response = await fetch(`${API_BASE_URL}orgs/${org_id}`, {method: 'GET'});
    const orgJson = await response.json();
    OrgsStore.update(old => {
      return {
        ...old,
        selected: orgJson
      }
    })
  }

  $: orgSelector = false;
  function showOrgSelector(show) {
    orgSelector = show;
  }

  function toggleOrgSelector() {
    orgSelector = !orgSelector;
    meetupSpotSelector = false;
    facilitySelector = false;
    personSelector = false;
  }

  $: personSelector = false;
  function showPersonSelector(show) {
    personSelector = show;
  }

  function togglePersonSelector() {
    personSelector = !personSelector;
    meetupSpotSelector = false;
    facilitySelector = false;
    orgSelector = false;
  }

  $: meetupSpotSelector = false;
  function showMeetupSpotSelector(show) {
    meetupSpotSelector = show;
  }

  function toggleMeetupSpotSelector() {
    meetupSpotSelector = !meetupSpotSelector;
    orgSelector = false;
    facilitySelector = false;
    personSelector = false;
  }

  $: facilitySelector = false;
  function showFacilitySelector(show) {
    facilitySelector = show;
  }

  function toggleFacilitySelector() {
    facilitySelector = !facilitySelector;
    orgSelector = false;
    meetupSpotSelector = false;
    personSelector = false;
  }

  function isAdmin() {

    return !!userGroups['admins'];
  }

  async function onSelectOrg(dispatchEvent) {
    showOrgSelector(false);
    const org = dispatchEvent.detail;
    if (org) {

      const response = await fetch(`${API_BASE_URL}facilitys?org_id=${org.id}`, {
        method: 'GET'
      });
      const facilitysJson = await response.json();
      const next = {
        facilitys: facilitysJson.matched,
        selected: null
      }

      FacilitysStore.update(old => {
        if (next.facilitys && next.facilitys.length > 0) {
          next.selected = next.facilitys[0];
        } else {
          next.selected = null
        }
        return next;
      });
    }
  }

  async function onSelectPerson(dispatchEvent) {

    showPersonSelector(false);
    const person = dispatchEvent.detail;
    if (person) {
      PersonsStore.set({
        type: store.READ,
        payload: person
      });
    }
    const nextPersons = {
      ...persons
    }
    nextPersons.selected = person;
    persons = nextPersons;
  }

  async function onSelectMeetupSpot(dispatchEvent) {
    showMeetupSpotSelector(false);
    const meetupSpot = dispatchEvent.detail;
    if (meetupSpot) {
      MeetupSpotsStore.set({
        type: store.READ,

      });
    }
  }

  async function onSelectFacility(dispatchEvent) {
    showFacilitySelector(false);
    FacilitysStore.update(old => {
      return {
        ...old,
        selected: dispatchEvent.detail
      }
    });
    /**
     * unlike the way we retrieve all the facilities of an org,
     * we don't retrieve all the meetupSpots for a facility.
     * that would likely be a lot of meetupSpots. eg. we'd be retrieving rooms in a facility.
     * instead we retrieve a set of meetupSpots that the user has visited at the facility,
     * and allow the user to manage this list. eg.
     * if the user frequents a set of spots for some time and then things change and they
     * regularly visit a different set of spots, the user has the option of removing the spots
     * they no longer visit
     */
  }

  function navigateAdminTools() {
    navigate('/admin_tools')
  }

  let loginMode = false;
  $: loginMode
  const setLoginMode = (next: boolean): void => {
    loginMode = next;
  }


  let DEFAULT_USER_NAME = 'jitguruadmin';
  let username = DEFAULT_USER_NAME;
  let password = '';
  let canAuthenticate = false;
  $: canAuthenticate = username && username.trim().length > 0 && password && password.trim().length > 0
  let loggedInUser;
  $: loggedInUser

  const authenticateUser = async () => {
    loggedInUser = await UserService.authenticate(username, password);
    SecurityStore.set({
      loggedInUser
    });
    loginMode = false;
  }



</script>
<main class="flex flex-col text-black m-0 h-full w-screen w-min-500">
  <div id="banner" class="h-7 bg-garden-200 text-white mr-1 flex flex-row">
    <div id="banner" class=" bg-garden-200 text-white text-left logo-text pl-2" style="padding-top: 2px">jitguru</div>
    {#if security && security.loggedInUser}
      <div class="text-sm pt-1 ml-2">{security.loggedInUser.first_name.toLowerCase()}</div>
    {:else}
        <div  class="text-sm pt-1 ml-2 border border-amber-500 my-1 align-middle px-5"
            style="position: relative; width: 70px;"
      >
        <div on:click={() => setLoginMode(true)}
              class="hover:bg-amber-100 hover:text-amber-800 cursor-pointer"
              style="position: absolute; top: 0px; left: 0px; width: 70px;">
          login
        </div>
        {#if loginMode}
          <div style="position: absolute; top: 32px; left: 0px">
        <div class="p-1 bg-leather-600 border-2 border-leather-100 m-2 rounded-lg">
          <div class="text-white font-bold pb-2 text-xl">login</div>
          <div class="flex flex-col">
            <div class="flex flex-row mt-1">
            <div class="w-64 text-right bg-stone-700 pr-2 font-bold">username:</div>
            <div class="w-64"><input bind:value={username} class="w-64 bg-white pl-2 text-amber-950"></div>
          </div>
          <div class="flex flex-row mt-1">
            <div class="w-64 text-right bg-stone-700 pr-2 font-bold">password:</div>
            <div class="w-64"><input id='username' bind:value={password} type="password" class="w-64 bg-white pl-2 text-amber-950"></div>
          </div>
          {#if canAuthenticate}
            <div class="mt-1 font-bold">
              <button class=" pl-2 pr-2 bg-garden-800" on:click={authenticateUser}>authenticate</button>
            </div>
          {/if}
        </div>
        </div>
      </div>
        {/if}
      </div>
    {/if}
    <div  class="text-sm pt-1 ml-2 border border-amber-500 my-1 align-middle px-5"
          style="position: relative; width: 70px;"
    >
      <div on:click={() => setMode('tools')} class="hover:bg-amber-100 hover:text-amber-800 cursor-pointer"
           style="position: absolute; top: 0px; left: 0px; width: 70px;">
        tools
      </div>
    </div>
    <div class="bg-leather-800 ml-2 text-sm font-bold pt-1 pl-1 pr-1 cursor-pointer hover:bg-amber-400 hover:text-black relative">
      <div on:click={() => toggleOrgSelector()}>org</div>
      {#if orgSelector}
        <div class="absolute top-7 left-0 bg-white border-2 border-garden-200 w-fit text-sm">
          <OrgSelector on:selectedOrg={onSelectOrg} on:createdOrg={() => {showOrgSelector(false)}}></OrgSelector>
        </div>
      {/if}
    </div>
    {#if orgs}
      {#if orgs.selected}
        <div class="relative">
          <div class="text-sm pt-1 ml-2 cursor-pointer relative" on:click={() => toggleOrgSelector()} role="button" tabindex="0">
            @{orgs?.selected?.name}
          </div>
        </div>
      {:else if !orgs.selected}
        {#if permissions?.assign_org_to_self}
          <div class="ml-2 cursor:pointer" on:click={() => toggleOrgSelector()} role="button" tabindex="0">+</div>
        {/if}
      {/if}
    {/if}

<!--      _____              .__.__  .__  __-->
<!--    _/ ____\____    ____ |__|  | |__|/  |_ ___.__. ______-->
<!--    \   __\\__  \ _/ ___\|  |  | |  \   __<   |  |/  ___/-->
<!--    |  |   / __ \\  \___|  |  |_|  ||  |  \___  |\___ \-->
<!--    |__|  (____  /\___  >__|____/__||__|  / ____/____  >-->
<!--    \/     \/                  \/         \/-->

    <div class="relative mb-0 cursor-pointer">
      <div on:click={toggleFacilitySelector} role="button" class="flex flex-row cursor-pointer">
        <div class="cursor-pointer bg-leather-800 ml-2 text-sm font-bold pt-1 pl-1 pr-1 h-7">
          facility
        </div>
        {#if facilitys && facilitys.selected}
          <div class="text-sm pt-1 pl-1">{facilitys.selected?.name}</div>
        {:else}
          <div class="text-sm pt-1 pl-1">select a facility...</div>
        {/if}

      </div>
      {#if facilitySelector}
        <div class="absolute top-7 left-0 bg-white border-2 border-garden-200 w-fit text-sm text-black">
          <FacilitySelector on:selectedFacility={onSelectFacility}></FacilitySelector>
        </div>
      {/if}
    </div>

<!--                          __-->
<!--     ____________   _____/  |_  ______-->
<!--    /  ___/\____ \ /  _ \   __\/  ___/-->
<!--    \___ \ |  |_> >  <_> )  |  \___ \-->
<!--    /____  >|   __/ \____/|__| /____  >-->
<!--    \/ |__|                    \/-->

    <div class="relative mb-0 cursor-pointer">
      <div on:click={toggleMeetupSpotSelector} role="button" class="flex flex-row cursor-pointer">
        <div class="cursor-pointer bg-leather-800 ml-2 text-sm font-bold pt-1 pl-1 pr-1 h-7">
          spot
        </div>
        {#if meetup_spots && meetup_spots.selected}
          <div class="text-sm pt-1 pl-1">{meetup_spots.selected.name}</div>
        {:else}
          <div class="text-sm pt-1 pl-1">select a spot...</div>
        {/if}
      </div>
      {#if meetupSpotSelector}
        <div class="absolute top-7 left-0 bg-white border-2 border-garden-200 w-fit text-sm text-black">
          <MeetupSpotSelector on:selectedMeetupSpot={onSelectMeetupSpot}></MeetupSpotSelector>
        </div>
      {/if}
    </div>




    <div class="relative mb-0 cursor-pointer">
      <div on:click={togglePersonSelector} role="button" class="flex flex-row cursor-pointer">
        <div class="cursor-pointer bg-leather-800 ml-2 text-sm font-bold pt-1 pl-1 pr-1 h-7">
          persons
        </div>
        {#if persons && persons.selected}
          <div class="text-sm pt-1 pl-1">{persons.selected.last_name.toUpperCase()}, {persons.selected.first_name.toLowerCase()}</div>
        {:else}
          <div class="text-sm pt-1 pl-1">select a person...</div>
        {/if}
      </div>
      {#if personSelector}
        <div  class="bg-white border-2 border-garden-200 w-fit text-sm text-black"
              style="position: absolute; left: 71px; top: 34px;">
          <PersonSelector on:selectedPerson={onSelectPerson}></PersonSelector>
        </div>
      {/if}
    </div>

<!--                .___      .__           __                .__-->
<!--    _____     __| _/_____ |__| ____   _/  |_  ____   ____ |  |   ______-->
<!--    \__  \   / __ |/     \|  |/    \  \   __\/  _ \ /  _ \|  |  /  ___/-->
<!--     / __ \_/ /_/ |  Y Y  \  |   |  \  |  | (  <_> |  <_> )  |__\___ \-->
<!--    (____  /\____ |__|_|  /__|___|  /  |__|  \____/ \____/|____/____  >-->
<!--    \/      \/     \/        \/                                \/-->
    {#if isAdmin()}
    <div class="relative mb-0 cursor-pointer">
      <div on:click={navigateAdminTools} role="button" class="flex flex-row cursor-pointer">
        <div class="cursor-pointer bg-leather-800 ml-2 text-sm font-bold pt-1 pl-1 pr-1 h-7">
          tools
        </div>
      </div>
    </div>
    {/if}
  </div>
  {#if persons.selected}
    <div class="w-full text-left px-2"><b>person:</b> {persons.selected.last_name.toUpperCase()}, {persons.selected.first_name.toLowerCase()}</div>
  {/if}
  <div class="flex flex-row">
    {#if userPreferenceTools && userPreferenceTools.length > 0}
      <MyTools userPreferenceTools={userPreferenceTools}></MyTools>
    {/if}
    <div style="width: 100%; display: flex; flex-direction: column">
      {#if mode === 'tools'}
        <div class="border-b-2 border-garden-100 mb-4"
             style="width: calc(100% - 5px); position: relative"
        >
          &nbsp;
          <div class="bg-garden-200 text-amber-100 px-4"
               style="position: absolute; left: 10px; top: 12px;"
          >tools</div>
        </div>
        <div style="">
          <Tools></Tools>
        </div>
      {/if}
      {#if mode === 'tool'}
        <div>
          <Tool toolName={toolName}></Tool>
        </div>
      {/if}
    </div>
  </div>
</main>
