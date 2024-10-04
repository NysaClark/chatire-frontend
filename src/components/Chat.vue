<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <div v-if="uri" id="chat-container" class="card">
          <div
            class="card-header text-white text-center font-weight-bold subtle-blue-gradient"
          >
            Share the page URL to invite new friends
          </div>

          <div class="card-body">
            <div class="container chat-body">
              <div
                v-for="message in messages"
                :key="message.id"
                class="row chat-section"
              >
                <template v-if="username === message.user.username">
                  <div class="col-right">
                    <span
                      class="card-text speech-bubble-user speech-bubble text-white subtle-blue-gradient"
                    >
                      {{ message.message }}
                    </span>
                    <img
                      :src="`http://placehold.it/40/007bff/fff&rext=${message.user.username[0].toUpperCase()}`"
                      class="rounded-circle"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="col">
                    <img
                      class="rounded-circle"
                      :src="`http://placehold.it/40/333333/fff&text=${message.user.username[0].toUpperCase()}`"
                    />
                    <span class="card-text speech-bubble speech-bubble-peer">
                      {{ message.message }}
                    </span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="card-footer text-muted">
            <form @submit.prevent="postMessage">
              <div class="row">
                <div class="col-10">
                  <input
                    type="text"
                    v-model="message"
                    placeholder="Type a message"
                  />
                </div>
                <div class="col-2">
                  <button class="btn btn-primary">Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div v-else>
          <h3 class="text-center">Welcome!</h3>
          <br />
          <p class="text-center">
            To start chatting with friends click on the button below, it'll
            start a new chat session and then you can invite your friends over
            to chat!
          </p>
          <br />
          <button
            @click="startChatSession"
            class="btn btn-primary btn-lg d-flex mx-auto"
          >
            Start Chatting
          </button>
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
      username: "",
      messages: [],
      message: "",
    };
  },

  computed: {
    // Retrieve uri from route params
    // & puts the uri in data
    uri() {
      return this.$route.params.uri;
    },
  },

  mounted() {
    // Join chat & fetch messages if uri is present
    if (this.uri) {
      this.joinChatSession();
    }
  },

  created() {
    // takes the username from loccalStorage
    // temp code: can be removed so only 'Welcome!' is displayed
    this.username = localStorage.getItem("username");
  },

  watch: {
    // Whenever uri changes, try to join that chat session
    uri: "joinChatSession",
  },

  methods: {
    async startChatSession() {
      await axios
        .post("http://localhost:8000/api/chats/", null, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        })
        .then((data) => {
          alert(
            "A new session has been created. You'll be redirected automatically."
          );
          this.$router.push({
            name: "Chat",
            params: { uri: data.data.uri },
            replace: true,
          });
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    },

    async postMessage() {
      if (!this.uri) { // can't post messages if not in a chat session
        return;
      }

      const body = { message: this.message };

      await axios
        .post(`http://localhost:8000/api/chats/${this.uri}/messages/`, body, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        })
        .then((data) => {
          this.messages.push(data.data);
          this.message = "";
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    },

    async joinChatSession() {
      if (!this.uri) { // can't join a chat if there's no chat uri to join with
        return;
      }

      const body = { username: this.username };

      await axios
        .patch(`http://localhost:8000/api/chats/${this.uri}/`, body, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        })
        .then((data) => {
          const user = data.data.members.find(
            (member) => member.username === this.username
          );

          if (user) {
            // The user has been added to the chat
            // get past chat messages
            this.fetchChatSessionHistory();
          }
        });
    },

    async fetchChatSessionHistory() {
      if (!this.uri) { // can't get chat messages if there's no chat uri to fetch with
        return;
      }
      await axios
        .get(`http://localhost:8000/api/chats/${this.uri}/messages/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        })
        .then((data) => {
          this.messages = data.data.messages;
        });
    },
  },
};
</script>

<!-- Added 'scoped attribute to limit CSS to this component only' -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.btn {
  border-radius: 0 !important;
}

.card-footer input[type="text"] {
  background-color: #ffffff;
  color: #444444;
  padding: 7px;
  font-size: 13px;
  border: 2px solid #cccccc;
  width: 100%;
  height: 38px;
}

.card-header a {
  text-decoration: underline;
}

.card-body {
  background-color: #ddd;
  padding: 15px 5px 10px;
}

.chat-body {
  margin-top: -15px;
  margin-bottom: -5px;
  height: 380px;
  overflow-y: auto;
}

.col-right {
  width: fit-content;
  margin-left: auto;
  display: flex;
  justify-content: end;
  align-items: start;
}

.speech-bubble {
  display: inline-block;
  position: relative;
  border-radius: 0.4em;
  padding: 10px;
  background-color: #fff;
  font-size: 14px;
  vertical-align: top;
  max-width: calc(100% - 60px);
}

.col .speech-bubble {
  margin-left: 20px;
}

.col-right .speech-bubble {
  margin-right: 20px;
}

.subtle-blue-gradient {
  /* background: linear-gradient(45deg, #004bff, #007bff); */
  background: #007bff;
}

.speech-bubble-user:after {
  content: "";
  position: absolute;
  right: 5px;
  top: 10px;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-left-color: #007bff;
  border-right: 0;
  border-top: 0;
  margin-top: -10px;
  margin-right: -20px;
}

.speech-bubble-peer:after {
  content: "";
  position: absolute;
  left: 3px;
  top: 10px;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-right-color: #ffffff;
  border-top: 0;
  border-left: 0;
  margin-top: -10px;
  margin-left: -20px;
}

.chat-section:first-child {
  margin-top: 10px;
}

.chat-section {
  margin-top: 15px;
}

.send-section {
  margin-bottom: -20px;
  padding-bottom: 10px;
}
</style>
