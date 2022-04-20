<template>
  <form class="text-center">
    <div class="container">
      <h1>Register</h1>
      <p>Please fill all fields</p>
      <hr />

      <label for="username"><b>Username</b></label>
      <input
        type="text"
        placeholder="Enter your Username"
        name="username"
        required
      />

      <hr />
      <p class="">
        White
        <input type="radio" id="white_color" />
        or Black?
        <input type="radio" id="black_color" />
      </p>
      <hr />
      <button type="submit" class="registerbtn">Register</button>
    </div>
  </form>

  <div class="container">
    <h1 class="text-center">Queue</h1>
    <div v-for="item in queue" :key="item.id">
      <div class="d-flex">
        <p>{{ item.id }}</p>
        <p>{{ item.username }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MainPage",
  components: {},
  data() {
    return {
      queue: [
        {
          id: 1,
          username: "bob",
          colorPreferred: "white",
        },
        {
          id: 2,
          username: "sasha",
          colorPreferred: "white",
        },
        {
          id: 3,
          username: "aleg",
          colorPreferred: "any",
        },
        {
          id: 4,
          username: "shaman",
          colorPreferred: "black",
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
/*.row_top_space {
  margin-top: 20%;
}
.container {
  background-color: rgba(103, 99, 99, 0.474);
  background-size: cover;
  background-repeat: no-repeat;
}
.queue_form {
  padding-left: 4px;
  position: relative;
  right: 0%;
}
div {
  border: solid 1px rgb(29, 11, 11);
} */

* {
  box-sizing: border-box;
}

/* Add padding to containers */
.container {
  padding: 16px;
}

/* Full-width input fields */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type="text"]:focus,
input[type="password"]:focus {
  background-color: #ddd;
  outline: none;
}

/* Overwrite default styles of hr */
hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Set a style for the submit/register button */
.registerbtn {
  background-color: #4caf50;
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

.registerbtn:hover {
  opacity: 1;
}

/* Add a blue text color to links */
a {
  color: dodgerblue;
}

/* Set a grey background color and center the text of the "sign in" section */
.signin {
  background-color: #f1f1f1;
  text-align: center;
}
</style>
