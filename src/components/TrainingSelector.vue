<template>
  <v-row align="center">
    <v-col class="d-flex" cols="8" sm="6">
      <v-select :items="trainingTypes" v-model="trainingSelected" @change="checkTraining" filled :error-messages="errorMessageEmptyTraining" label="Type d'entrainement"
      ></v-select>
    </v-col>
    <v-col class="d-flex" cols="4" sm="6">
      <v-btn color="secondary" class="mr-10" @click="train" :disabled="checkLastTraining()">VALIDER</v-btn>
      <div v-if="checkLastTraining()">{{nextTrainingMessage}}{{`${nextTraining()}`}}</div>
    </v-col>
  </v-row>
</template>

<script>
import Constants from "@/constants";

export default {
  name: "trainingSelector",
  data() {
    return {
      trainingTypes: Constants.TRAINING.TRAINING_TYPES,
      errorMessageEmptyTraining: "",
      trainingSelected: "",
      nextTrainingMessage: Constants.TRAINING.NEXT_TRAINING
    }
  },
  props: {
    gladiator: {
      type: Object,
      required: true
    }
  },
  methods: {
    checkTraining() {
      this.trainingSelected === "" ? this.errorMessageEmptyTraining = Constants.ERROR_MESSAGES.SELECT_TRAINING : this.errorMessageEmptyTraining = ""
    },
    train() {
      this.checkTraining()
      this.$emit("increaseCapacities", this.trainingSelected, this.gladiator)
    },
    checkLastTraining() {
      return Date.now() - this.gladiator.last_training < 86400000;
    },
    nextTraining() {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(this.gladiator.last_training + 86400000).toLocaleDateString("fr", options);

    },
  },
  mounted() {
    this.nextTraining()
  }
}
</script>

<style scoped>

</style>