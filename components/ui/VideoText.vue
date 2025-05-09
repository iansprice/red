<template>
  <div
      class="relative size-full"
      :class="props.class"
  >
    <div
        class="absolute inset-0 flex items-center justify-center overflow-hidden"
        :style="{
        maskImage: dataUrlMask,
        WebkitMaskImage: dataUrlMask,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }"
    >
      <iframe
          :class="['size-full object-cover opacity-0 transition-opacity delay-500 duration-1000', {'!opacity-100': mounted}]"
          :src="youtubeEmbedUrl"
          :style="{transform: 'scale(1.5)', transformOrigin: 'center center'}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          @click.stop="emit('cclick')"
      >
      </iframe>
    </div>
    <div class="sr-only flex flex-col">
      <div v-for="word in content.split(' ')" :key="word">{{ word }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch, computed} from "vue";

interface Props {
  src: string;
  class?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  fontSize?: string | number;
  fontWeight?: string | number;
  textAnchor?: string;
  dominantBaseline?: string;
  fontFamily?: string;
  start?: number;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  autoPlay: true,
  muted: true,
  loop: true,
  controls: false,
  fontSize: 20,
  fontWeight: "bold",
  textAnchor: "start",
  dominantBaseline: "middle",
  fontFamily: "sans-serif",
});

const emit = defineEmits(['cclick']);

const defaultSlot = useSlots().default;

const content = computed(
    () =>
        defaultSlot?.()
            .map((vnode) => vnode.children)
            .join("") ?? "",
);

const svgMask = ref("");

const dataUrlMask = computed(
    () => `url("data:image/svg+xml,${encodeURIComponent(svgMask.value)}")`,
);

// Parse YouTube URL and create proper embed URL with parameters
const youtubeEmbedUrl = computed(() => {
  // Extract video ID from different YouTube URL formats
  let videoId = "";
  const url = props.src;

  // Handle youtube.com/watch?v= format
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];

  // Handle youtu.be/ format
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) videoId = shortMatch[1];

  // Handle youtube.com/embed/ format
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
  if (embedMatch) videoId = embedMatch[1];

  // If we couldn't extract ID, just return the original URL
  if (!videoId) return props.src;

  // Construct embed URL with parameters
  let embedUrl = `https://www.youtube.com/embed/${videoId}?`;

  // Add parameters based on props
  const params = [];
  if (props.autoPlay) params.push("autoplay=1");
  if (props.muted) params.push("mute=1");
  if (props.loop) {
    params.push("loop=1");
    // Loop requires a playlist parameter with the same video ID
    params.push(`playlist=${videoId}`);
  }
  if (props.start) {params.push(`start=${props.start}`)}
  if (!props.controls) params.push("controls=0");

  // Join parameters
  embedUrl += params.join("&");

  return embedUrl;
});

function updateSvgMask() {
  const responsiveFontSize =
      typeof props.fontSize === "number" ? `${props.fontSize}vw` : props.fontSize;
  const words = content.value.split(" ")
  const divvy = 100 / words.length
  const texts = words.map((word, index) => `<text x='5vw' y='${33 + divvy * index}vh' font-size='${responsiveFontSize}' font-weight='${props.fontWeight}' text-anchor='${props.textAnchor}' dominant-baseline='${props.dominantBaseline}' font-family='${props.fontFamily}'>${word}</text>`)
  svgMask.value = `<svg xmlns='http://www.w3.org/2000/svg' width='150%' height='150%' >${texts.join('')}</svg>`;
}

watch(content, updateSvgMask);
const mounted = ref(false)
onMounted(() => setTimeout(() => mounted.value = true, 500))

watch(
    () => [
      props.fontSize,
      props.fontWeight,
      props.textAnchor,
      props.dominantBaseline,
      props.fontFamily,
    ],
    updateSvgMask,
);

onMounted(() => {
  updateSvgMask();
  window.addEventListener("resize", updateSvgMask);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateSvgMask);
});
</script>