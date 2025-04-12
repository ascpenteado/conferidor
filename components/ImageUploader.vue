<template>
  <div class="h-[80vh] p-4">
    <div class="flex flex-col items-center justify-center">
      <label
        v-if="!previewImage"
        for="file-upload"
        class="mb-4 cursor-pointer text-sm text-gray-500 dark:text-gray-400"
        @click="handleUpload"
      >
        Enviar imagem
      </label>
      <input
        type="file"
        id="file-upload"
        class="hidden"
        accept="image/*"
        @change="handleUpload"
        ref="fileInput"
      />
      <button
        class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        @click="fileInput?.click()"
        v-if="!previewImage"
      >
        Selecionar Imagem
      </button>
    </div>

    <div class="img-preview">
      <p v-if="previewImage" class="text-sm text-gray-500 dark:text-gray-400">
        Imagem selecionada
        <button
          class="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
          @click="zoomLevel = Math.min(zoomLevel + 0.1, 2)"
        >
          <span class="inline-block">🔍+</span>
        </button>
        <button
          class="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
          @click="zoomLevel = Math.max(zoomLevel - 0.1, 0.5)"
        >
          <span class="inline-block">🔍-</span>
        </button>
      </p>
      <div class="flex overflow-hidden p-2 mt-2">
        <img
          class="max-h-[68vh] object-contain cursor-move"
          v-if="previewImage"
          :src="previewImage"
          alt="Image Preview"
          :style="{
            transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s',
          }"
          @mousedown="startDrag"
          @mousemove="drag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
        />
      </div>
    </div>
    <button
      v-if="previewImage"
      class="px-3 py-1 mt-4 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
      @click="handleClearImage"
    >
      Limpar imagem
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['image-selected']);

const previewImage = ref('');

const fileInput = ref<HTMLInputElement | null>(null);

const zoomLevel = ref(1);

// Add new refs for drag functionality
const isDragging = ref(false);
const position = ref({ x: 0, y: 0 });
const dragStart = ref({ x: 0, y: 0 });

const startDrag = (e: MouseEvent) => {
  if (zoomLevel.value <= 1) return;
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  };
};

const drag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  position.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y,
  };
};

const stopDrag = () => {
  isDragging.value = false;
};

const handleUpload = (event: any) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) return;
  emit('image-selected', file);
  previewImage.value = URL.createObjectURL(file);
};

const handleClearImage = () => {
  previewImage.value = '';
  emit('image-selected', null);
};
</script>
