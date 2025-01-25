<script setup>
  import { ref } from 'vue';
  const cavasRef = ref(null)
  const score = ref(0)
</script>

<template>
  <section className="bg-base-100 max-w-screen-xl mx-auto py-14">
      <div className="mx-auto flex flex-col items-center">
        <div className=" "></div>
        <h1 className="text-3xl mb-5">Score : {{ score }} </h1>

        <canvas className="bg-blue-100 border-b-[15px] border-b-orange-950 "></canvas>

        <button className="btn mt-4" onClick={resetGame}>
          Reset Game helloworld
        </button>
        <div id="Totorial">
          <button class="btn btn-primary" onclick="ToB"> ? </button>
          <div id="Totorial-C">Totorial-content</div>
        </div>
      </div>
    </section>
</template>

<style scoped>
</style>