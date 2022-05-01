<template>
  <div>
    <div>
      <div>
        <div class="board">
          <div class="box">&#9820;</div>
          <div class="box">&#9822;</div>
          <div class="box">&#9821;</div>
          <div class="box">&#9819;</div>
          <div class="box">&#9818;</div>
          <div class="box">&#9821;</div>
          <div class="box">&#9822;</div>
          <div class="box">&#9820;</div>
          <div class="box">&#9823;</div>
          <div class="box">&#9823;</div>
          <div class="box">&#9823;</div>
          <div class="box">&#9823;</div>
          <div class="box">&#9823;</div>
          <div class="box">&#9823;</div>
          <div class="box">&#9823;</div>
          <div class="box">&#9823;</div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box">&#9817;</div>
          <div class="box">&#9817;</div>
          <div class="box">&#9817;</div>
          <div class="box">&#9817;</div>
          <div class="box">&#9817;</div>
          <div class="box">&#9817;</div>
          <div class="box">&#9817;</div>
          <div class="box">&#9817;</div>
          <div class="box">&#9814;</div>
          <div class="box">&#9816;</div>
          <div class="box">&#9815;</div>
          <div class="box">&#9813;</div>
          <div class="box">&#9812;</div>
          <div class="box">&#9815;</div>
          <div class="box">&#9816;</div>
          <div class="box">&#9814;</div>
        </div>
      </div>
      <div class="queue_form">
        <h1 class="text-center">Queue</h1>
        <div v-for="item in queue" :key="item.id">
          <div class="d-flex">
            <p>{{ item.id }}</p>
            <p>{{ item.username }}</p>
            <p>{{ item.color }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChessPage",
  components: {},
  data() {
    return {
      queue: [
        {
          id: 1,
          username: "bob",
          colorPreferred: "white",
        },
      ],
      isOpenModal: false,
    };
  },
  methods: {
    openModal() {
      console.log("foo");
    },
  },
};
</script>

<style scoped>
.box {
  text-align: center;
  display: flex;
}
.queue_form {
  color: firebrick;
  background-color: #5ece74;
  width: 20%;
}
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: Verdana, sans-serif;
  font-size: 16px;
  font-size: 1rem;
  text-align: center;
  color: #fff;
  background-color: #6a6;
}

h1 {
  font-size: 1.5rem;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.75);
}

.board {
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  border: 4vw solid transparent;
  max-width: 480px;
  max-height: 480px;
  width: 100vw;
  height: 100vw;
  box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.75);
  font-size: 0;
  background-image: url("../assets/bamboo.jpg");
}

.box {
  width: 12.5%;
  height: 12.5%;
  font-size: 8vw;
  line-height: 12vw;
}

.box:nth-child(n + 1):nth-child(-n + 16) {
  color: #222;
}

.board .box:nth-child(n + 1):nth-child(-n + 8):nth-child(even),
.board .box:nth-child(n + 17):nth-child(-n + 25):nth-child(even),
.board .box:nth-child(n + 33):nth-child(-n + 40):nth-child(even),
.board .box:nth-child(n + 49):nth-child(-n + 56):nth-child(even),
.board .box:nth-child(n + 9):nth-child(-n + 16):nth-child(odd),
.board .box:nth-child(n + 25):nth-child(-n + 32):nth-child(odd),
.board .box:nth-child(n + 41):nth-child(-n + 48):nth-child(odd),
.board .box:nth-child(n + 57):nth-child(-n + 64):nth-child(odd) {
  background-color: rgba(159, 68, 8, 0.5);
}

@media screen and (min-width: 480px) {
  .board {
    border: 18px solid transparent;
    box-shadow: 0 15px 15px -5px rgba(0, 0, 0, 0.75);
  }
  .box {
    font-size: 2.5rem;
    line-height: 56px;
  }
}
</style>
