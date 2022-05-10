<template>
  <div class="home" >
    <h1>PROJECT 52</h1>
    <div class="buttonsCo">
      <router-link to="/inscription"><v-btn class="ma-5" depressed elevation="2">INSCRIPTION</v-btn></router-link>
      <router-link to="/connection"><v-btn class="ma-5" depressed elevation="2">CONNEXION</v-btn></router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      lanistes: [],
      test:""
    }
  },
  mounted() {
    console.log(this.$store.state.connectedUser)
    if(this.$store.state.connectedUser.laniste) {
      this.$router.push("/dashboard")
    }
  }
}
</script>

<style scoped>
.buttonsCo {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  margin-top: 30px
}


</style>