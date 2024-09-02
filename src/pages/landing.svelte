<script>
  import TailwindCss from '../lib/TailwindCSS.svelte';
  import {API_BASE_URL} from "../settings/api-settings.js";
  import SecurityStore from "../stores/security-store.js";
  import {onDestroy} from "svelte";
  import {navigate} from'svelte-routing';
  let defaultUsername = import.meta.env.VITE_DEV_USERNAME
  let defaultPassword = import.meta.env.VITE_DEV_PASSWORD
  // if (defaultPassword) {
  //   document.getElementById('password').value = defaultPassword;
  // }

  let message = '';

  let security;
  const unsub = SecurityStore.subscribe(stored => {
    security = stored;
  });
  onDestroy(()=>{unsub()});

  let mode = 'login';
  function toggleMode(e) {
    mode = mode == 'login' ? 'register' : 'login';
  }

  let firstName;
  let lastName;
  let alreadyUsername = false;
  let username=defaultUsername;
  let password=defaultPassword;
  let repeatPassword;
  let matchPassword = true;
  let email;

  $: canAuthenticate = username?.length > 0 &&
    password?.length > 12;

  $: canCreate = matchPassword &&
    lastName?.length > 0 &&
    firstName?.length > 0 &&
    username?.length > 0 &&
    password?.length > 12 &&
    repeatPassword?.length == password?.length &&
    matchPassword && validEmail();

  async function authenticateUser() {
    // debugger;
    if (canAuthenticate) {
      let response = await fetch(
        `${API_BASE_URL}users`
        , {
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password
          })
        }
      );
      let responseJson = await response.json();
      let loggedInUser = responseJson.authenticated;
      SecurityStore.update(old => {
        return {
          ...old,
          loggedInUser: loggedInUser,
          permissions: []
        }
      });
      if (loggedInUser) {
        navigate('/home');
      } else {
        message = 'authentication failed'
      }
    } else {
      message = 'unable to authenticate';
    }
  }

  async function checkDupeUsername(e) {
    username = e.target.value;
    if (username?.trim().length > 0) {
      let response = await fetch(
        `${API_BASE_URL}users`
      , {
          method: 'POST',
          body: JSON.stringify({username: username})
        }
      );
      let responseJson = await response.json();
      alreadyUsername = !!responseJson.matched;
    }
  }
  async function createUser() {
    let createResponse = await fetch(`${API_BASE_URL}users`, {
      method: 'POST',
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        username,
        password,
        email
      })
    });
    let createJson = await createResponse.json();
    if (createJson.created) {
      SecurityStore.update(old =>{
        return {...old, loggedInUser: createJson.created}
      });
      navigate('/home');
    } else {
      console.log(`created user failed: ${createJson.message}`);
    }
  }

  function checkMatchPasswords(e) {
    if (password && repeatPassword) {
      matchPassword = password === repeatPassword;
    }
  }

  function updateUsername(e) {
    username = e.target.value;
    username = username?.trim();
  }
  function updatePassword(e) {
    password = e.target.value;
    password = password?.trim();
    checkMatchPasswords();
    if (e.key==='Enter') {
      authenticateUser();
    }
  }
  function updateRepeatPassword(e) {
    repeatPassword = e.target.value;
    repeatPassword = repeatPassword?.trim();
    checkMatchPasswords();
  }

  function updateFirstName(e) {
    firstName = e.target.value;
    firstName = firstName?.trim()
  }
  function updateLastName(e) {
    lastName = e.target.value;
    lastName = lastName?.trim();
  }
  function updateEmailAddress(e) {
    email = e.target.value;
    email = email?.trim();
  }
  function validEmail() {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim());
  }

</script>
<TailwindCss/>

<main class="flex flex-col text-black items-center justify-center w-screen m-0 h-full">
  <div class="logo-text text-9xl">jitguru</div>
  {#if mode === 'login'}
    <div class="p-1 bg-leather-600 border-2 border-leather-100 m-2 rounded-lg">
      <div class="text-white font-bold pb-2 text-xl">login</div>
      <div class="flex flex-col">
        <div class="flex flex-row mt-1">
          <div class="w-64 text-right bg-stone-700 pr-2 font-bold">username:</div>
          <div class="w-64"><input on:keyup={updateUsername} class="w-64 bg-white pl-2" value="{defaultUsername ? defaultUsername : null}"></div>
        </div>
        <div class="flex flex-row mt-1">
          <div class="w-64 text-right bg-stone-700 pr-2 font-bold">password:</div>
          <div class="w-64"><input id='username' on:keyup={updatePassword} type="password" class="w-64 bg-white pl-2"></div>
        </div>
        {#if canAuthenticate}
          <div class="mt-1 font-bold">
            <button class=" pl-2 pr-2 bg-garden-800" on:click={authenticateUser}>authenticate</button>
          </div>
        {/if}
      </div>
      <div class="bg-leather-900 mt-2 mb-2 font-bold text-xl text-white">or</div>
      <div on:click={toggleMode} class="text-white hover:text-stone-800 cursor-pointer font-bold pb-2 text-xl">register</div>
    </div>
  {:else}
    <div class="p-1 bg-leather-600 border-2 border-leather-100 m-2 rounded-lg">
      <div class="text-white font-bold pb-2 text-xl">register</div>
      <div class="flex flex-col">
        <div class="flex flex-row">
          <div class="w-64 text-right bg-stone-700 pr-2 font-bold">first name:</div>
          <div class="w-64"><input on:keyup={updateFirstName} class="w-64 bg-white pl-2"></div>
        </div>
        <div class="flex flex-row mt-1">
          <div class="w-64 text-right bg-stone-700 pr-2 font-bold">last name:</div>
          <div class="w-64"><input on:keyup={updateLastName} class="w-64 bg-white pl-2"></div>
        </div>
        <div class="flex flex-row mt-1">
          <div class="w-64 text-right bg-stone-700 pr-2 font-bold">email address:</div>
          <div class="w-64"><input on:keyup={updateEmailAddress} class="w-64 bg-white pl-2"></div>
        </div>
        <div class="flex flex-row mt-1">
          <div class="w-64 text-right bg-stone-700 pr-2 font-bold">username:</div>
          <div class="w-64"><input on:keyup={checkDupeUsername} class="w-64 bg-white pl-2"></div>
        </div>
        {#if alreadyUsername}
          <div class="text-sm text-red-500 bg-white mt-1">username is unavailable</div>
        {/if}
        <div class="flex flex-row mt-1">
          <div class="w-64 text-right bg-stone-700 pr-2 font-bold">password:{password && password.length < 12 ? `${password?.length}/12` : ``}</div>
          <div class="w-64"><input on:keyup={updatePassword} type="password" class="w-64 bg-white pl-2"></div>
        </div>
        <div class="flex flex-row mt-1">
          <div class="w-64 text-right bg-stone-700 pr-2 font-bold">repeat password:</div>
          <div class="w-64"><input on:keyup={updateRepeatPassword} type="password" class="w-64 bg-white pl-2"></div>
        </div>
        {#if !matchPassword}
          <div class="text-sm text-red-500 bg-white mt-1">password & repeat password must match</div>
        {/if}
        {#if canCreate}
          <div class="mt-1 font-bold">
            <button class=" pl-2 pr-2 bg-garden-800" on:click={createUser}>create user account</button>
          </div>
        {/if}
      </div>
      <div class="bg-leather-900 mt-2 mb-2 font-bold text-xl text-white">or</div>
      <div on:click={toggleMode} class="text-white hover:text-stone-800 cursor-pointer font-bold pb-2 text-xl">login</div>
    </div>
  {/if}
  {#if message}
    <div class="bg-white text-leather-500">{message}</div>
  {/if}
</main>