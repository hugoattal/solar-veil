<template>
  <div>
      <input v-model="input" placeholder="Type something..." />
        <p>Result: <code>{{ result }}</code></p>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";

const input = ref("");
const result = ref("");

function debounce(func: Function, wait: number) {
  let timeout: number;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

watch(input, debounce(async (value: string) => {
    const session = await window.ai.assistant.create();
    result.value = await session.prompt(input.value);
}, 100));
</script>

<style>
html,
body {
  width: 300px;
  height: 400px;
  padding: 0;
  margin: 0;
}

body {
  background-color: rgb(36, 36, 36);
}

body > div {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

img {
  width: 200px;
  height: 200px;
}

h1 {
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin: 0;
}

p {
  color: white;
  opacity: 0.7;
  margin: 0;
}

code {
  font-size: 12px;
  padding: 2px 4px;
  background-color: #ffffff24;
  border-radius: 2px;
}
</style>
