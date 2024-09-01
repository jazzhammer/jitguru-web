<style>
  .tools {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .tools > *  {
    margin: 6px;
  }

  .tool-swatch {
    min-width: 200px;
    max-width: 400px;
    min-height: 80px;
    max-height: 150px;
    border-radius: 4px;
    text-align: left;
  }

  .tool-name {
    font-weight: bold;
    padding-left: 8px;
  }
  .tool-description {
    padding-left: 8px;
  }
</style>
<script lang="ts">
</script>
<div class="tools">
  <div class="tool-swatch border-2 border-amber-700 bg-amber-50 flex flex-col">
    <div class="tool-name bg-amber-900 text-amber-50">meetup templates</div>
    <div class="tool-description text-blue-950">a description of what should happen in a meetup, including but not limited to:
      <li>persons that are expected to attend,</li>
      <li>their respective roles and </li>
      <li>the meetup's expected outcomes</li>
    </div>
  </div>
</div>

