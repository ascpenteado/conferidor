<template>
  <div>
    <label class="">
      Texto para conferir:
      <textarea
        v-model="inputText"
        placeholder="Digite o texto a ser verificado..."
        class="w-full p-2 border rounded-lg my-4 h-40 dark:bg-gray-900 dark:text-white"
      />
    </label>

    <div v-if="inputText" class="mb-2">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Resultado da busca (vermelho: não encontrado):
      </p>
      <div
        class="bg-gray-100 dark:bg-gray-900 p-2 text-sm whitespace-pre-wrap"
        v-html="highlightedText"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ ocrText: string }>();
const inputText = ref('');

const highlightedText = computed(() => {
  if (!inputText.value) return inputText.value;

  const inputWords = inputText.value.toLowerCase().split(/\s+/).filter(Boolean);
  const ocrWords = new Set(
    props.ocrText.toLowerCase().split(/\s+/).filter(Boolean)
  );

  let result = inputText.value;
  let offset = 0;

  const wordPositions: {
    start: number;
    end: number;
    word: string;
    shouldHighlight: boolean;
  }[] = [];
  inputWords.forEach((word) => {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedWord})\\b`, 'gi');
    let match;

    while ((match = regex.exec(inputText.value)) !== null) {
      wordPositions.push({
        start: match.index,
        end: match.index + match[0].length,
        word: match[0],
        shouldHighlight: !ocrWords.has(word.toLowerCase()),
      });
    }
  });

  wordPositions.sort((a, b) => a.start - b.start);

  wordPositions.forEach((pos) => {
    if (pos.shouldHighlight) {
      const before = result.slice(0, pos.start + offset);
      const after = result.slice(pos.end + offset);
      const highlight = `<mark class="bg-red-200">${pos.word}</mark>`;
      result = before + highlight + after;
      offset += highlight.length - pos.word.length;
    }
  });

  return result;
});
</script>
