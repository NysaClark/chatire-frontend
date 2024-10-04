<template>
  <div class="container">
    <h1 class="text-center">Welcome to Chatire!</h1>
    <div id="auth-container" class="row">
      <div class="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <ul class="nav nav-tabs nav-justified" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              id="signup-tab"
              role="tab"
              aria-selected="true"
              class="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#signup"
              type="button"
              aria-controls="signup"
            >
              Sign Up
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              id="signin-tab"
              role="tab"
              aria-selected="true"
              class="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#signin"
              type="button"
              aria-controls="signin"
            >
              Sign In
            </button>
          </li>
        </ul>

        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="signup"
            role="tabpanel"
            aria-labelledby="signup-tab"
            tabindex="0"
          >
            <form @submit.prevent="signUp">
              <div class="form-group">
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  class="form-control"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div class="row mt-1 g-2">
                <div class="form-group col-md-6">
                  <input
                    v-model="username"
                    type="text"
                    id="username"
                    placeholder="Username"
                    required
                    class="form-control"
                  />
                </div>
                <div class="form-group col-md-6">
                  <input
                    v-model="password"
                    type="password"
                    id="password"
                    placeholder="Password"
                    required
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-group my-2">
                <div class="form-check">
                  <input
                    type="checkbox"
                    id="toc"
                    required
                    class="form-check-input"
                  />
                  <label for="gridCheck" class="form-check-label">
                    Add terms and Conditions
                  </label>
                </div>
              </div>
              <button type="submit" class="btn btn-block btn-primary">
                Sign up
              </button>
            </form>
          </div>

          <div
            class="tab-pane fade show"
            id="signin"
            role="tabpanel"
            aria-labelledby="signin-tab"
            tabindex="1"
          >
            <form @submit.prevent="signIn">
              <div class="form-group">
                <input
                  v-model="username"
                  class="form-control"
                  id="username"
                  placeholder="Username"
                  required
                  type="text"
                />
              </div>
              <div class="form-group pt-1 mb-2">
                <input
                  v-model="password"
                  type="password"
                  class="form-control mt-2"
                  id="password"
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-block btn-primary">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
    };
  },

  methods: {
    async signUp() {
      try {
        const { data } = await axios.post(
          "http://localhost:8000/auth/users/",
          this.$data
        );

        console.log(data);

        alert(
          "Your account has been created. You will be signed in automatically"
        );

        this.signIn();
      } catch (err) {
        console.log(err);
        alert(err);
      }
    },

    async signIn() {
      const credentials = { username: this.username, password: this.password };

      try {
        const { data } = await axios.post(
          "http://localhost:8000/auth/token/login/",
          credentials
        );

        localStorage.setItem("authToken", data.auth_token);
        localStorage.setItem("username", this.username);

        // this.$router.push("/chats");

        // Redirect to the originally intended route, or default to /chats/
        // console.log(this.$route.query.redirect);
        // const redirectPath = this.$route.query.redirect || "/chats/";

        this.$router.push('/chats/');
      } catch (err) {
        console.log(err);
        alert(err);
      }
    },

    // logout() {
    //   localStorage.removeItem("authToken");
    // },
  },
};
</script>

<style scoped>
.container {
  margin-top: 2rem;
}
#auth-container {
  margin-top: 50px;
}

.tab-content {
  padding-top: 20px;
}
</style>
