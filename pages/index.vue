<template>
  <main class="main pt-120">
    <div class="container">
      <ul class="videos">
        <vVideoCard
          v-for="n in 10"
          :key="n"
          :card="{
            title: 'Привет, мир!',
            views: 321412,
            time: '12:32',
            date: '12.22.2022',
            poster: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
            author: {
              name: 'ohyeah',
              id: 1,
            },
            id: 1,
          }"
        />
      </ul>
    </div>
  </main>
</template>

<script>
  import vVideoCard from "@/components/vVideoCard";

  export default {
    name: "MainPage",
    components: { vVideoCard, },
    layout: "default",
    head: { title: "Главная", },
  };
</script>
