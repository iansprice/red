<template>
  <footer class="relative w-full h-96 overflow-hidden">
    <!-- Distant fade to transparent -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-100/5 to-cyan-200/10 z-10"></div>

    <!-- Mid-distance waves - softer, blurred, fading -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 20%22%3E%3Cpath d=%22M0 20 Q25 15, 50 20 T100 20 T150 20 V25 H-25 Z%22 fill=%22%230ea5e9%22 opacity=%22.2%22/%3E%3C/svg%3E')]
         bg-repeat-x animate-[midWave_15s_linear_infinite] blur-[1px] opacity-30"></div>

    <!-- Transition layer -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-blue-500/30"></div>

    <!-- Detailed front waves -->
    <div class="absolute bottom-0 left-0 right-0 h-32">
      <!-- Main waves -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 10%22%3E%3Cpath d=%22M0 10 Q10 7, 20 10 T40 10 T60 10 V15 H-10 Z%22 fill=%22%23075985%22 opacity=%22.8%22/%3E%3C/svg%3E')]
           bg-repeat-x animate-[frontWave_8s_linear_infinite] opacity-80"></div>

      <!-- Detail waves -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 30 8%22%3E%3Cpath d=%22M0 8 Q7 6, 15 8 T30 8 T45 8 V12 H-10 Z%22 fill=%22%230c4a6e%22 opacity=%22.6%22/%3E%3C/svg%3E')]
           bg-repeat-x animate-[detailWave_6s_linear_infinite] opacity-70"></div>

      <!-- Surface highlights -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 5%22%3E%3Cpath d=%22M0 5 Q5 3, 10 5 T20 5 T30 5 V8 H-5 Z%22 fill=%22%237dd3fc%22 opacity=%22.2%22/%3E%3C/svg%3E')]
           bg-repeat-x animate-[highlightWave_4s_linear_infinite] opacity-30"></div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style>
@keyframes frontWave {
  0% { background-position: 0 0; }
  100% { background-position: 400px 0; }
}

@keyframes midWave {
  0% { background-position: 0 0; }
  100% { background-position: 800px 0; }
}

@keyframes detailWave {
  0% { background-position: 0 0; }
  100% { background-position: 300px 0; }
}

@keyframes highlightWave {
  0% { background-position: 0 0; }
  100% { background-position: 200px 0; }
}
</style>