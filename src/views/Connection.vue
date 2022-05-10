<template>
  <div>
    <ReturnArrow />
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="email" :error-messages="errorMessageMail" label="Email" filled/>
            <v-text-field v-model="password" :error-messages="errorMessageEmptyPassword" label="Mot de passe" filled type="password"/>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-btn color="primary" @click="checkInfos">CONNEXION</v-btn>
    <v-col class="mt-20" v-if="errorMessageConnection">{{errorMessageConnection}}</v-col>
  </div>
</template>

<script>
import axios from "axios";
import ReturnArrow from "@/components/ReturnArrow";
import Constants from "@/constants";

export default {
  name: "Connection",
  components : {
    ReturnArrow
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessageMail: "",
      errorMessageEmptyPassword: "",
      errorMessageConnection: "",
      lanistes: [],
      ludis: []
    }
  },
  methods: {
    async checkInfos() {
      this.email === "" ? this.errorMessageMail = Constants.ERROR_MESSAGES.EMPTY_MAIL : this.errorMessageMail = ""
      this.lanistes = await axios.get(" http://localhost:3000/lanistes");
      this.ludis = await axios.get(" http://localhost:3000/ludis");
      const user = this.lanistes.data.find(laniste => laniste.email === this.email && laniste.password === this.password)
      const ludis = this.ludis.data.filter(ludi => ludi.lanisteId === user?.id)

      if(user) {
        this.$store.commit("updateConnectedUser", user)
        this.$store.commit("updateLudisOfConnectedUser", ludis)
        await this.$router.push("/dashboard")
      } else {
        this.errorMessageConnection = Constants.ERROR_MESSAGES.BAD_IDENTIFIERS
      }
    }
  }
}
</script>

<style scoped>

</style>