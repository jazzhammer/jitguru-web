<script>
  import SecurityStore from "../stores/security-store.js";
  import PermissionsStore from "../stores/permissions-store.js";
  import FacilitysStore from "../stores/facilitys-store.js";
  import MeetupSpotsStore from "../stores/meetup_spots-store.js";
  import OrgsStore from "../stores/orgs-store.js";
  import UserGroupsStore from "../stores/user-groups-store.js";
  import UserPreferencesStore from '../stores/user-preferences-store.js';
  import {PREF_SELECTED_ORG_ID} from '../models/user-preference.js';
  import {onDestroy} from "svelte";
  import {API_BASE_URL} from "../settings/api-settings.js";
  import OrgSelector from "./org-selector.svelte";
  import MeetupSpotSelector from "./meetup-spot-selector.svelte";
  import FacilitySelector from "./facility-selector.svelte";
  import {navigate} from "svelte-routing";

  let preferences;
  const unsubPreferences = UserPreferencesStore.subscribe(stored => {
    preferences = stored;
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

  let facilitys = {};
  const unsubFacilitys = FacilitysStore.subscribe(stored => {
    facilitys = stored;
  });

  let meetup_spots = {};
  const unsubMeetupSpots = MeetupSpotsStore.subscribe(stored => {
    meetup_spots = stored;
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
  let security;
  const unsubSecurity = SecurityStore.subscribe(async stored => {
    security = stored;
    if (security && security['loggedInUser']) {
      const user_id = security['loggedInUser']['id'];
      await setupPermissions(user_id);
      await setupPreferences(user_id);
      await setupUserOrgs(user_id);

    }
  });

  onDestroy(()=>{
    unsubSecurity();
    unsubPermissions();
    unsubPreferences();
    unsubOrgs();
    unsubFacilitys();
    unsubMeetupSpots();
  });


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
    const responseJson = await response.json();
    const preferencesArrayJson = JSON.parse(responseJson);
    const preferencesHash = preferencesArrayJson.reduce((acc, pref) => {
      acc[pref.name] = pref.value;
      return acc;
    }, {});
    // console.log(`preferences hash: ${JSON.stringify(preferencesHash)}`);
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
              console.log(`org.id ${org.id} vs ${parseInt(preferences[PREF_SELECTED_ORG_ID])}`);
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
    const next = {};
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
  }

  $: meetupSpotSelector = false;
  function showMeetupSpotSelector(show) {
    meetupSpotSelector = show;
  }

  function toggleMeetupSpotSelector() {
    meetupSpotSelector = !meetupSpotSelector;
    orgSelector = false;
    facilitySelector = false;
  }

  $: facilitySelector = false;
  function showFacilitySelector(show) {
    facilitySelector = show;
  }

  function toggleFacilitySelector() {
    facilitySelector = !facilitySelector;
    orgSelector = false;
    meetupSpotSelector = false;
  }

  function isAdmin() {
    console.log(`userGroups['admins'] ${userGroups['admins']}`);
    return !!userGroups['admins'];
  }

  async function onSelectOrg(dispatchEvent) {
    showOrgSelector(false);
    const org = dispatchEvent.detail;
    if (org) {
      console.log(`retrieve facilitys for org[${org.id}]`)
      const response = await fetch(`${API_BASE_URL}facilitys?org_id=${org.id}`, {
        method: 'GET'
      });
      const facilitysJson = await response.json();
      const next = {
        facilitys: facilitysJson.matched
      }
      console.log(`retrieved facilitys ${next.facilitys?.length}`)
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

  async function onSelectMeetupSpot(dispatchEvent) {
    showMeetupSpotSelector(false);
    const meetupSpot = dispatchEvent.detail;
    if (meetupSpot) {

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


</script>
<main class="flex flex-col text-black m-0 h-full w-screen w-min-500">
  <div id="banner" class="h-7 bg-garden-200 text-white mr-1 flex flex-row">
    <div id="banner" class=" bg-garden-200 text-white text-left logo-text pl-2" style="padding-top: 2px">jitguru</div>
    <div class="text-sm pt-1 ml-2">{security?.loggedInUser?.first_name.toLowerCase()}</div>
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
</main>
