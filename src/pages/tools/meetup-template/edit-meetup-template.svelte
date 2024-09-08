<style>
  .edit-meetup-template {
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
import MeetupTemplatesStore from '../../../stores/meetup-templates-store';
import store from '../../../stores/types';
import {type MeetupTemplate} from '../../../models/meetup-template';
import MeetupTemplateService from '../../../services/meetup-template-service';
import OrgsStore from './../../../stores/orgs-store';
import {type Org} from '../../../models/org';
import {type Topic} from '../../../models/topic';
import {onDestroy} from "svelte";
import TopicService from "../../../services/topic-service";
import {type Facility} from "../../../models/facility";
import FacilityService from "../../../services/facility-service";
import {type MeetupSpot} from "../../../models/meetup_spot";
import MeetupSpotService from "../../../services/meetup-spot-service";
import {type CrewTemplate} from "../../../models/crew-template";
import CrewTemplateService from "../../../services/crew-template-service";
import {type Subject} from "../../../models/subject";
import SubjectService from "../../../services/subject-service";
import SearchCrewTemplate from './../crew-template/search-crew-template.svelte';
import ListCrewTemplates from './../crew-template/list-crew-templates.svelte';
import SearchMeetupSpot from './../meetup-spot/search-meetup-spot.svelte';
import ListMeetupSpots from './../meetup-spot/list-meetup-spots.svelte';
import SearchFacility from './../facility/search-facility.svelte';
import ListFacilitys from './../facility/list-facilitys.svelte';
import SearchOrg from './../org/search-org.svelte';
import ListOrgs from './../org/list-orgs.svelte';
import MessagesStore from './../../../stores/messages-store';
import OrgService from "../../../services/org-service";
export let editableMeetupTemplate: MeetupTemplate;
$: editableMeetupTemplate

let org: Org;
$: org

let facility: Facility;
$: facility

let meetup_spot: MeetupSpot;
$: meetup_spot

let crew_template: CrewTemplate;
$: crew_template

let subject: Subject;
$: subject

let mode = 'new';
const setMode = (next: string): void => {
  mode = next;
}
let topic: Topic;
$: topic

let topics: Topic[]
$: topics


const subjectForMeetupTemplate = async (meetupTemplate: MeetupTemplate): Promise<Subject> => {
  if (meetupTemplate) {
    if (meetupTemplate.subject) {
      const response = await SubjectService.find({
        id: meetupTemplate.subject
      });
      const subject = response.data.matched && response.data.matched.length > 0 ?
        response.data.matched[0] :
        null;
      return subject;
    }
    return null;
  }
  return null;
}

const orgForMeetupTemplate = async (meetupTemplate: MeetupTemplate): Promise<Org> => {
  if (meetupTemplate) {
    if (meetupTemplate.org) {
      const response = await OrgService.find({
        id: meetupTemplate.org
      });
      const org = response.data.matched && response.data.matched.length > 0 ?
        response.data.matched[0] :
        null;
      return org;
    }
    return null;
  }
  return null;
}

const crewTemplateForMeetupTemplate = async (meetupTemplate: MeetupTemplate): Promise<CrewTemplate> => {
  if (meetupTemplate) {
    if (meetupTemplate.crew_template) {
      const response = await CrewTemplateService.find({
        id: meetupTemplate.crew_template
      });
      const crewTemplate = response.data.matched && response.data.matched.length > 0 ?
        response.data.matched[0] :
        null;
      return crewTemplate;
    }
    return null;
  }
  return null;
}

const facilityForMeetupTemplate = async (meetupTemplate: MeetupTemplate): Promise<Facility> => {
  if (meetupTemplate) {
    if (meetupTemplate.facility) {
      const response = await FacilityService.find({
        id: meetupTemplate.facility
      });
      const facility = response.data.matched && response.data.matched.length > 0 ?
        response.data.matched[0] :
        null;
      return facility;
    }
    return null;
  }
  return null;
}

const meetupSpotForMeetupTemplate = async (meetupTemplate: MeetupTemplate): Promise<MeetupSpot> => {
  if (meetupTemplate) {
    if (meetupTemplate.meetup_spot) {
      const response = await MeetupSpotService.find({
        id: meetupTemplate.meetup_spot
      });
      const meetupSpot = response.data.matched && response.data.matched.length > 0 ?
        response.data.matched[0] :
        null;
      return meetupSpot;
    }
    return null;
  }
  return null;
}

facilityForMeetupTemplate(editableMeetupTemplate).then((found) =>  {
  facility = found;
});

meetupSpotForMeetupTemplate(editableMeetupTemplate).then((found) =>  {
  meetup_spot = found;
});

crewTemplateForMeetupTemplate(editableMeetupTemplate).then((found) =>  {
  crew_template = found;
});

subjectForMeetupTemplate(editableMeetupTemplate).then((found) =>  {
  subject = found;
});

orgForMeetupTemplate(editableMeetupTemplate).then((found) =>  {
  org = found;
});

if (editableMeetupTemplate) {
  if (editableMeetupTemplate.meetup_spot) {
    MeetupSpotService.find({
      id: editableMeetupTemplate.meetup_spot
    }).then((response) => {
      meetup_spot = response.data.matched && response.data.matched.length > 0 ?
        response.data.matched[0] :
        null;
    });
  }
}

let nextMeetupTemplate: Partial<MeetupTemplate> = {
  id: editableMeetupTemplate?.id,
  name: editableMeetupTemplate?.name,
  org: editableMeetupTemplate?.org,
  work_in_progress: editableMeetupTemplate?.work_in_progress
};

const unsubOrg = OrgsStore.subscribe((crud: any) => {
  if (crud && crud.type == store.READ) {
    org = crud.payload;
    // console.log(`org payload: ${org?.name}`)
  }
  // else if (crud && crud.selected) {
  //   org = crud.selected;
  //   editableMeetupTemplate.org_id = org.id;
  //   // console.log(`org selected: ${org?.name}`)
  // }
  // else {
  //   // console.log(`org store: ${JSON.stringify(crud)}`)
  // }
});

export let updatedMeetupTemplate = (updated: MeetupTemplate): void => {
  console.log(`updated ${JSON.stringify(updated)}`);
};
let canUpdate = false;
$: canUpdate = nextMeetupTemplate.name && nextMeetupTemplate.name.trim().length > 0;

const update = (): void => {
  MeetupTemplateService.update({
    ...nextMeetupTemplate
  }).then((response) => {
    const updated = response.data.updated;
    MeetupTemplatesStore.set({
      type: store.UPDATE,
      payload: updated
    });
    updatedMeetupTemplate(updated);
    nextMeetupTemplate = updated;
  });
}
// const selectedTopic = (next: Topic): void => {
//   topic = next;
//   setMode('edit');
//   TopicsStore.set({
//     type: store.READ,
//     payload: next
//   });
// }

const refreshTopics = (subject: MeetupTemplate): void => {
  if (subject) {
    TopicService.find({
      subject_id: subject.id
    }).then((response) => {
      topics = response.data.matched;
    });
  }

}

let unsubMeetupTemplate = MeetupTemplatesStore.subscribe((scrud) => {
  if (scrud.type == store.READ) {
    nextMeetupTemplate = scrud.payload;
    const meetupTemplate = scrud.payload;
    refreshTopics(meetupTemplate);
  }
});
onDestroy(unsubMeetupTemplate);



// const createdTopic =(next: Topic): void => {
//   TopicsStore.set({
//     type: store.CREATE,
//     payload: next
//   });
//   refreshTopics(subject);
// }
// const updatedTopic = (next: Topic): void => {
//   TopicsStore.set({
//     type: store.UPDATE,
//     payload: next
//   });
//   refreshTopics(subject);
// }
let editing = '';
$: editing
const setEditing = (next: string): void => {
  if (next === editing) {
    editing = null;
  } else {
    editing = next;
  }
}

let meetupSpots: MeetupSpot[];
$: meetupSpots
const foundMeetupSpots = (next: MeetupSpot[]): void => {
  meetupSpots = next;
}

const selectNextMeetupSpot = (next: MeetupSpot): void => {
  nextMeetupTemplate.crew_template_id = next.id
  meetup_spot = next;
  setEditing(null);
  update();
  MessagesStore.set({
    type: 'edit-meetup-template',
    message: `updated meetup_template with meetup_spot ${meetup_spot.name}`
  });
}

let crewTemplates: CrewTemplate[];
$: crewTemplates
const foundCrewTemplates = (next: CrewTemplate[]): void => {
  crewTemplates = next;
}

const selectNextCrewTemplate = (next: CrewTemplate): void => {
  nextMeetupTemplate.crew_template_id = next.id
  crew_template = next;
  setEditing(null);
  update();
  MessagesStore.set({
    type: 'edit-meetup-template',
    message: `updated meetup_template with crew_template ${crew_template.name}`
  });
}


let facilitys: Facility[];
$: facilitys
const foundFacilitys = (next: Facility[]): void => {
  facilitys = next;
}

const selectNextFacility = (next: Facility): void => {
  nextMeetupTemplate.facility_id = next.id
  facility = next;
  setEditing(null);
  update();
  MessagesStore.set({
    type: 'edit-meetup-template',
    message: `updated meetup_template with facility ${facility.name}`
  });
}


let orgs: Org[];
$: orgs
const foundOrgs = (next: Org[]): void => {
  orgs = next;
}

const selectNextOrg = (next: Org): void => {
  nextMeetupTemplate.org_id = next.id
  org = next;
  setEditing(null);
  update();
  MessagesStore.set({
    type: 'edit-meetup-template',
    message: `updated meetup_template with org ${org.name}`
  });
}



let message = ''
$: message
const unsubMessage = MessagesStore.subscribe((crud: any) => {
  if (crud && crud.type === 'edit-meetup-template') {
    message = crud.message;
    setTimeout(
      () => {message = ''},
      4000
    );
  }
});
onDestroy(unsubMessage);

</script>
<div class="edit-meetup-template flex flex-col">
  <div class="bg-amber-100 text-amber-950 px-2 flex flex-row">
    <div>meetup_template details: <b>{nextMeetupTemplate.name}[{nextMeetupTemplate.id}]</b></div>
    <div class="ml-4">work_in_progress = <b>{nextMeetupTemplate.work_in_progress}</b></div>
    <div class="ml-4" style="style: italic;">{message}</div>
  </div>
  <!--  edit org-->
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 450px; padding-left: 8px; margin-top: 8px;">
    <div>org</div>
    <div class="pl-2 hover:text-blue-950 hover:bg-blue-200 cursor-pointer"
         style="position: relative"
    ><div on:click={() => setEditing('org')}>{org?.name}</div>
      {#if editing === 'org'}
        <div style="min-height: 40px; min-width: 200px; position: absolute; left: 4px; top: 24px; z-index: 1000;"
             class="border-2 border-amber-700 bg-white rounded-sm">
          <SearchOrg found={foundOrgs}></SearchOrg>
          <ListOrgs selected={selectNextOrg} orgs={orgs}></ListOrgs>
        </div>
      {/if}
    </div>
  </div>
  <!--  edit facility-->
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 450px; padding-left: 8px; margin-top: 8px;">
    <div>facility</div>
    <div class="pl-2 hover:text-blue-950 hover:bg-blue-200 cursor-pointer"
         style="position: relative"
    ><div on:click={() => setEditing('facility')}>{facility?.name}</div>
    {#if editing === 'facility'}
      <div style="min-height: 40px; min-width: 200px; position: absolute; left: 4px; top: 24px; z-index: 1000;"
           class="border-2 border-amber-700 bg-white rounded-sm">
        <SearchFacility found={foundFacilitys}></SearchFacility>
        <ListFacilitys selected={selectNextFacility} facilitys={facilitys}></ListFacilitys>
      </div>
    {/if}
    </div>
  </div>
  <!--  edit meetup_spot-->
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 450px; padding-left: 8px; margin-top: 8px;">
    <div>meetup_spot</div>
    <div class="pl-2 hover:text-blue-950 hover:bg-blue-200 cursor-pointer"
         style="position: relative"
    ><div on:click={() => setEditing('meetup_spot')}>{meetup_spot?.name}</div>
    {#if editing === 'meetup_spot'}
      <div style="min-height: 40px; min-width: 200px; position: absolute; left: 4px; top: 24px; z-index: 1000;"
           class="border-2 border-amber-700 bg-white rounded-sm">
        <SearchMeetupSpot found={foundMeetupSpots}></SearchMeetupSpot>
        <ListMeetupSpots selected={selectNextMeetupSpot} meetupSpots={meetupSpots}></ListMeetupSpots>
      </div>
    {/if}
    </div>
  </div>
  <!--  edit crew_template-->
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 450px; padding-left: 8px; margin-top: 8px;">
    <div>crew_template&nbsp;{nextMeetupTemplate.crew_template ? `[${nextMeetupTemplate.crew_template}]` : ''}</div>
    <div class="pl-2 hover:text-blue-950 hover:bg-blue-200 cursor-pointer"
         style="position: relative"

    ><div on:click={() => setEditing('crew_template')}>{crew_template?.name}</div>
    {#if editing === 'crew_template'}
      <div style="min-height: 40px; min-width: 200px; position: absolute; left: 4px; top: 24px; z-index: 1000;"
           class="border-2 border-amber-700 bg-white rounded-sm">
        <SearchCrewTemplate found={foundCrewTemplates}></SearchCrewTemplate>
        <ListCrewTemplates selected={selectNextCrewTemplate} crewTemplates={crewTemplates}></ListCrewTemplates>
      </div>
    {/if}
    </div>
  </div>
  <!--  edit subject-->
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 450px; padding-left: 8px; margin-top: 8px;">
    <div>subject&nbsp;{nextMeetupTemplate.subject ? `[${nextMeetupTemplate.subject}]` : ''}</div>
    <div class="pl-2 hover:text-blue-950 hover:bg-blue-200 cursor-pointer"
         style="position: relative"
    ><div on:click={() => setEditing('subject')}>{subject?.name}</div>
    {#if editing === 'subject'}
      <div style="min-height: 40px; min-width: 200px; position: absolute; left: 4px; top: 24px"
           class="border-2 border:black bg-garden-100">
        &nbsp;asdfasdf
      </div>
    {/if}
    </div>
  </div>
  <!--  edit name-->
  <div style="display: grid; grid-template-columns: 1fr 2fr; max-width: 450px; padding-left: 8px; margin-top: 8px;">
    <div>name</div>
    <div><input bind:value={nextMeetupTemplate.name}
                placeholder="name"
                class="bg-white text-amber-950 pl-3 ml-1 "/>
    </div>
  </div>

  {#if canUpdate}
  <div on:click={update}
      class="bg-amber-700 text-amber-100 text-center hover:bg-blue-300 hover:text-blue-950"
      style="border-radius: 3px; min-width: 90px; max-width: 250px; margin-top:12px;"
  >update meetup_template</div>
  {/if}
  {#if subject}
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
  {/if}
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
<!--            <NewTopic subject={subject} createdTopic={createdTopic}></NewTopic>-->
          {/if}
          {#if mode === 'edit'}
<!--            <EditTopic topic={topic} updatedTopic={updatedTopic}></EditTopic>-->
          {/if}
        </div>
        <div class="ml-2 h-full">
          {#if !topics || topics.length === 0}
            <div>no topics for subject: {nextMeetupTemplate.name}</div>
          {:else}
            <div class="bg-amber-100 text-amber-950 px-2">assigned topics</div>
<!--            <ListTopics topics={topics} selected={selectedTopic}></ListTopics>-->
          {/if}
        </div>
      </div>
  </div>
</div>