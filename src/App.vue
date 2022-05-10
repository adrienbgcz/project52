<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center" v-if="this.$store.state.connectedUser.laniste">
        Bienvenue {{this.$store.state.connectedUser.laniste}} !
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center" v-if="this.$store.state.connectedUser.laniste">
        {{this.$store.state.connectedUser.deniers}} deniers
      </div>

      <v-spacer></v-spacer>

      <router-link to="/" v-if="this.$store.state.connectedUser.laniste"><v-btn depressed elevation="2" @click="disconnect">DECONNEXION</v-btn></router-link>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data(){
    return {
      user: this.$store.state.connectedUser,
      ludis: this.$store.state.ludis
    }
  },
  methods: {
    disconnect() {
      this.user = {}
      this.ludis = []
      this.$store.commit("updateConnectedUser", this.user)
      this.$store.commit("updateLudisOfConnectedUser", this.ludis)
    }
  }

};
</script>

<style>
html {
  width: 75%;
  margin:auto;
}


</style>
