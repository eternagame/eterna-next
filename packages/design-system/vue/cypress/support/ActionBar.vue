<template>
  <header class="actionBar">
    <div class="actionBar-themeSelect">
      <span>Theme: </span>
      <select
        id="themeSwitcher"
        name="themeSwitcher"
        @:change="changeTheme"
      >
        <option value="dark">
          Dark
        </option>
        <option value="light">
          Light
        </option>
      </select>
    </div>
  </header>
  <main>
    <slot />
  </main>
</template>

<script setup lang="ts">
function changeTheme(event: Event) {
  const theme = (event.target as HTMLInputElement).value;
  document.querySelector('html')?.setAttribute('class', theme);
}
</script>

<style>
  .actionBar {
    width: 100%;
    padding: 4px;
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
  }

  .actionBar-themeSelect {
    align-self: flex-end;
  }

  select {
    border: none;
  }
</style>
