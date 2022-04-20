<template>
  <MainPage />
</template>

<script>
import MainPage from "./components/MainPage.vue";
export default {
  name: "App",
  components: {
    MainPage,
  },
};
</script>

<style>
body {
  background-image: url("./assets/bcg_Img.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
