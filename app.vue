<script setup lang="ts">
import ImageUploader from '~/components/ImageUploader.vue';
import TextChecker from '~/components/TextChecker.vue';
import ThemeToggle from '~/components/ThemeToggle.vue';
import { useOCR } from '~/composables/useOCR';

const ocrText = ref('');
const isLoading = ref(false);
const showOcrText = ref(false);
const handleImage = async (imageFile: File) => {
  if (!imageFile) {
    ocrText.value = '';
    return;
  }
  try {
    isLoading.value = true;
    ocrText.value = await useOCR(imageFile);
  } catch (error) {
    console.error('Error');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="mx-auto p-6 space-y-6 h-screen overflow-y-auto dark:bg-gray-900 dark:text-white"
  >
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">O Conferidor</h1>
      <ThemeToggle />
    </div>
    <div
      class="grid justify-center outline outline-1 outline-gray-300 dark:outline-gray-600 p-4 rounded-lg lg:grid-cols-2 gap-8 dark:bg-gray-800"
    >
      <ImageUploader @image-selected="handleImage" />
      <div v-if="isLoading">
        <div class="flex justify-center items-center h-full">
          <div
            class="w-10 h-10 bg-blue-200 dark:bg-blue-600 rounded-full animate-ping duration-100"
          ></div>
        </div>
      </div>
      <div v-else class="flex flex-col gap-4">
        <TextChecker :ocrText="ocrText" />
        <div v-if="ocrText" class="whitespace-pre-wrap">
          <div>
            <button
              @click="showOcrText = !showOcrText"
              class="text-sm mb-4 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
            >
              {{ showOcrText ? 'Ocultar' : 'Ver' }} texto encontrado na imagem
            </button>
            <p
              v-if="showOcrText"
              class="text-xs text-gray-400 dark:text-gray-300"
            >
              {{ ocrText }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
