<template>
  <router-view />
</template>


<script>
export default {
  data() {
    return "OK";
  },
  methods: {
    created() {
      this.$soketio.on("/game/start", (data) => {
        console.log(data);
      });
    },
  },
};
</script>



<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {
  background-image: url("./assets/bcgim2.jpg");
}
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
