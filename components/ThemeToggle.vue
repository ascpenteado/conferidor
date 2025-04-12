<script setup lang="ts">
const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
    aria-label="Toggle theme"
  >
    {{ colorMode.value === 'dark' ? '🌞' : '🌙' }}
  </button>
</template>
