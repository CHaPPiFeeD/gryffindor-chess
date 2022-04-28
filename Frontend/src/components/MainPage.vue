<template>
  <div>
    <div class="text-center">
      <div class="container">
        <h1>Register</h1>
        <p>Please fill all fields</p>
        <hr />

        <label for="username"><b>Username</b></label>
        <input
          type="text"
          v-model="username"
          placeholder="Enter your Username"
          required
        />
        <div class="error_checker">
          <span v-if="isShowError == true">{{ errorMessage }}</span>
        </div>
        <hr />
        <p class="">
          <label class="white_chose">
            &#9813;

            <input
              v-model="chesscolor"
              type="radio"
              id="white_color"
              name="chess-color"
              value="white"
            />
          </label>
          or
          <label class="black_chose">
            &#9819; ?
            <input
              v-model="chesscolor"
              type="radio"
              id="black_color"
              name="chess-color"
              value="black"
            />
          </label>
        </p>
        <hr />
        <button @click="send" type="submit" class="registerbtn">
          Register
        </button>
      </div>
    </div>
  </div>
</template>
<!-- ----------------------Script part-------------------------  --->
<script>
export default {
  data() {
    return {
      username: "",
      chesscolor: "",
      isShowError: false,
      errorMessage: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.username && this.chesscolor) {
        this.isShowError = false;
        console.log(this.username);
        // some logic
      } else {
        this.errorMessage = "Warning";
        this.isShowError = true;
      }
    },
    send() {
      this.$soketio.emit("/queue/search", {
        color: [this.chesscolor],
        name: this.username,
      });
    },
  },
};
</script>

<!-- ----------------------Style part-------------------------  --->

<style scoped>
* {
  box-sizing: border-box;
}

/* Add padding to containers */
.container {
  padding: 16px;
  border: solid;
  border-radius: 10px 100px / 120px;
  background-image: url("../assets/bcgim.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

/* Full-width input fields */
input[type="text"] {
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
  width: 30%;
  opacity: 0.9;
  border-radius: 50% 20% / 10% 40%;
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
.white_chose {
  color: #ffffff;
}
.black_chose {
  color: rgb(0, 0, 0);
}
.error_checker span {
  color: red;
}
</style>
