<template>
<div>
  <v-container v-for="ludi in ludis" :key="ludi.id">
    <v-col cols="4">
      <v-card class="mx-auto" max-width="344" outlined >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="text-h5 mb-1">{{ludi.nom}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <router-link :to="{path:`/ludis/${ludi.id}`}"><v-btn outlined rounded text>Voir</v-btn></router-link>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-container>
  <v-col cols="4">
    <v-row>
      <v-text-field v-model="ludiName" :error-messages="errorMessageLudiName" label="Nom du ludi" filled/>
    </v-row>
    <v-row>
      <v-select :items="ludisTypes" v-model="ludiSelected" @change="checkLudi" filled :error-messages="errorMessageEmptyLudi" label="Type de Ludi"
      ></v-select>
    </v-row>
  </v-col>

  <v-btn color="primary" class="mb-10 ml-10" @click="addLudi" >AJOUTER UN LUDI</v-btn>
</div>

</template>

<script>
import axios from "axios";
import Constants from "@/constants";

export default {
  name: "Dashboard",
  data() {
    return {
      user: this.$store.state.connectedUser,
      ludiName: "",
      ludiSelected: "",
      errorMessageEmptyLudi: "",
      ludisTypes: Constants.LUDIS.LUDI_TYPES,
      errorMessageLudiName: "",
      allLudis: []
    }
  },
  computed: {
    ludis() {
      return this.$store.state.ludis
    }
  },
  methods: {
    async addLudi() {
      this.checkLudi()
      if(this.errorMessageLudiName === "" && this.errorMessageEmptyLudi === "") {
        try {
          this.allLudis = await axios.get(" http://localhost:3000/ludis");
        } catch(e) {
          console.error(e)
        }

        let highestLudiId = 1
        this.allLudis.data.forEach(ludi => {if(ludi.id > highestLudiId) highestLudiId = ludi.id})
        let newLudi = {"id": highestLudiId + 1, "nom": `${this.ludiName}`, "specialite": this.ludiSelected, "lanisteId": this.user.id}

        try {
          const response = await axios.post('http://localhost:3000/ludis', newLudi);
          if((response.status === 200 || response.status === 201)) {
            const ludisUpdated = await axios.get(" http://localhost:3000/ludis");
            const ludisFiltered = ludisUpdated.data.filter(ludi => ludi.lanisteId === this.user.id)
            this.$store.commit("updateLudisOfConnectedUser", ludisFiltered)
          }
        } catch(e) {
          console.error(e)
        }
      }
    },

    checkLudi() {
      this.ludiName === "" ? this.errorMessageLudiName = Constants.ERROR_MESSAGES.EMPTY_LUDI_NAME : this.errorMessageLudiName = ""
      this.ludiSelected === "" ? this.errorMessageEmptyLudi = Constants.ERROR_MESSAGES.EMPTY_LUDIS : this.errorMessageEmptyLudi = ""
    },
  }
}
</script>

<style scoped>
.allCards {
  display: grid;
  grid-column: auto;
}

</style>