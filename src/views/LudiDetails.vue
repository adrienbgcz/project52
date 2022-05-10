<template>
  <div>
    <ReturnArrow />

    <div class="title">
      <div>{{ludiInfos.nom}}</div>
      <div>SPECIALITÉ : {{ludiInfos.specialite}}</div>
    </div>
    <div v-for="gladiator in this.$store.state.gladiators" :key="gladiator.id" class="gladiatorBloc">
      <div class="gladiatorRow">{{gladiator.nom}} /// ADR : {{gladiator.adresse}} - FOR : {{gladiator.force}} - EQU : {{gladiator.equilibre}} - VIT : {{gladiator.vitesse}} - STR : {{gladiator.strategie}}
        <TrainingSelector :gladiator="gladiator" @increaseCapacities="increaseCapacities"/>
      </div>
    </div>
    <v-btn color="primary" class="mb-10 ml-10" @click="enroll($store.state.connectedUser.id)" :disabled="checkDeniers()">RECRUTER</v-btn>
  </div>
</template>

<script>
import axios from "axios";
import TrainingSelector from "@/components/TrainingSelector";
import ReturnArrow from "@/components/ReturnArrow";
import Constants from "@/constants"

export default {
  name: "LudiDetails",
  components: {TrainingSelector, ReturnArrow},
  data() {
    return {
      gladiators: [],
      allGladiators : [],
      ludiInfos: {}
    }
  },
  methods: {
    async getLudiGladiators() {
      this.allGladiators = await axios.get(" http://localhost:3000/gladiateurs");
      this.$store.state.gladiators = this.allGladiators.data.filter(gladiator => gladiator.ludiId === this.$route.params.idLudi)
    },

    async enroll(idLaniste) {
      await this.getLudiGladiators()
      const patchLaniste = await axios.patch(`http://localhost:3000/lanistes/${idLaniste}`, {deniers: this.getNewNumber()}  )
      const laniste = await axios.get(`http://localhost:3000/lanistes/${idLaniste}`)
      this.$store.commit("updateConnectedUser", laniste.data)

      let highestGladiatorId = 1
      this.allGladiators.data.forEach(gladiator => {if(gladiator.id > highestGladiatorId) highestGladiatorId = gladiator.id})

      let newGladiator = {
        "id": highestGladiatorId + 1,
        "nom": `Gladiateur ${highestGladiatorId + 1}`,
        "adresse": this.getRandomIntInclusive(0, 3),
        "force": this.getRandomIntInclusive(0, 3),
        "equilibre": this.getRandomIntInclusive(0, 3),
        "vitesse": this.getRandomIntInclusive(0, 3),
        "strategie": this.getRandomIntInclusive(0, 3),
        "ludiId": this.$route.params.idLudi
      }
      const postGladiator = await axios.post("http://localhost:3000/gladiateurs", newGladiator)

      this.$store.commit("addGladiator", newGladiator)
    },
    async increaseCapacities(trainingType, gladiator) {
      console.log(trainingType, gladiator)
      //values are rounded to 1 float and to 0 if negatives

      let capacitiesToUpdate = {}

      switch(trainingType) {
        case Constants.TRAINING.CONDITIONING :
          if(this.ludiInfos.specialite === Constants.LUDIS.CHARIOT_RACE) {
            capacitiesToUpdate = {
              adresse : Math.max(0, Math.round((gladiator.adresse + this.getPj(0.4, 2,4))*10)/10),
              force: Math.max(0, Math.round((gladiator.force + this.getPj(0.3, 2, 4))*10)/10),
              equilibre: Math.max(0, Math.round((gladiator.equilibre - this.getPj(0.1, 2, 4))*10)/10),
              vitesse: Math.max(0, Math.round((gladiator.vitesse + this.getPj(0.5, 2,4))*10)/10),
              strategie: Math.max(0, Math.round((gladiator.strategie - this.getPj(0.2, 2,4))*10)/10),
              last_training: Date.now()
            }
          } else if(this.ludiInfos.specialite === Constants.LUDIS.WRESTLING) {
            capacitiesToUpdate = {
              adresse : Math.max(0, Math.round((gladiator.adresse + this.getPj(0.4, 3,6))*10)/10),
              force: Math.max(0, Math.round((gladiator.force + this.getPj(0.3, 3, 6))*10)/10),
              equilibre: Math.max(0, Math.round((gladiator.equilibre - this.getPj(0.1, 3, 6))*10)/10),
              vitesse: Math.max(0, Math.round((gladiator.vitesse + this.getPj(0.5, 3,6))*10)/10),
              strategie: Math.max(0, Math.round((gladiator.strategie - this.getPj(0.2, 3,6))*10)/10),
              last_training: Date.now()
            }

          } else if(this.ludiInfos.specialite === Constants.LUDIS.ATHLETICS) {
            capacitiesToUpdate = {
              adresse : Math.max(0, Math.round((gladiator.adresse + this.getPj(0.4, 3,5))*10)/10),
              force: Math.max(0, Math.round((gladiator.force + this.getPj(0.3, 3, 5))*10)/10),
              equilibre: Math.max(0, Math.round((gladiator.equilibre - this.getPj(0.1, 3, 5))*10)/10),
              vitesse: Math.max(0, Math.round((gladiator.vitesse + this.getPj(0.5, 3,5))*10)/10),
              strategie: Math.max(0, Math.round((gladiator.strategie - this.getPj(0.2, 3,5))*10)/10),
              last_training: Date.now()
            }
          }

        break;

        case Constants.TRAINING.TACTICAL :
          if(this.ludiInfos.specialite === Constants.LUDIS.CHARIOT_RACE) {
            capacitiesToUpdate = {
              adresse : Math.max(0, Math.round((gladiator.adresse + this.getPj(0.4, 3,6))*10)/10),
              force: Math.max(0, Math.round((gladiator.force + this.getPj(0.3, 3, 6))*10)/10),
              equilibre: Math.max(0, Math.round((gladiator.equilibre - this.getPj(0.1, 3, 6))*10)/10),
              vitesse: Math.max(0, Math.round((gladiator.vitesse + this.getPj(0.5, 3,6))*10)/10),
              strategie: Math.max(0, Math.round((gladiator.strategie - this.getPj(0.2, 3,6))*10)/10),
              last_training: Date.now()
            }
          } else if(this.ludiInfos.specialite === Constants.LUDIS.WRESTLING) {
            capacitiesToUpdate = {
              adresse : Math.max(0, Math.round((gladiator.adresse + this.getPj(0.4, 1,3))*10)/10),
              force: Math.max(0, Math.round((gladiator.force + this.getPj(0.3, 1, 3))*10)/10),
              equilibre: Math.max(0, Math.round((gladiator.equilibre - this.getPj(0.1, 1, 3))*10)/10),
              vitesse: Math.max(0, Math.round((gladiator.vitesse + this.getPj(0.5, 1,3))*10)/10),
              strategie: Math.max(0, Math.round((gladiator.strategie - this.getPj(0.2, 1,3))*10)/10),
              last_training: Date.now()
            }

          } else if(this.ludiInfos.specialite === Constants.LUDIS.ATHLETICS) {
            capacitiesToUpdate = {
              adresse : Math.max(0, Math.round((gladiator.adresse + this.getPj(0.4, 2,3))*10)/10),
              force: Math.max(0, Math.round((gladiator.force + this.getPj(0.3, 2, 3))*10)/10),
              equilibre: Math.max(0, Math.round((gladiator.equilibre - this.getPj(0.1, 2, 3))*10)/10),
              vitesse: Math.max(0, Math.round((gladiator.vitesse + this.getPj(0.5, 2,3))*10)/10),
              strategie: Math.max(0, Math.round((gladiator.strategie - this.getPj(0.2, 2,3))*10)/10),
              last_training: Date.now()
            }
          }

        break;

        case Constants.TRAINING.COMBINED :
          if(this.ludiInfos.specialite === Constants.LUDIS.CHARIOT_RACE) {
            capacitiesToUpdate = {
              adresse : Math.max(0, Math.round((gladiator.adresse + this.getPj(0.4, 2,7))*10)/10),
              force: Math.max(0, Math.round((gladiator.force + this.getPj(0.3, 2, 7))*10)/10),
              equilibre: Math.max(0, Math.round((gladiator.equilibre - this.getPj(0.1, 2, 7))*10)/10),
              vitesse: Math.max(0, Math.round((gladiator.vitesse + this.getPj(0.5, 2,7))*10)/10),
              strategie: Math.max(0, Math.round((gladiator.strategie - this.getPj(0.2, 2,7))*10)/10),
              last_training: Date.now()
            }
          } else if(this.ludiInfos.specialite === Constants.LUDIS.WRESTLING) {
            capacitiesToUpdate = {
              adresse : Math.max(0, Math.round((gladiator.adresse + this.getPj(0.4, 1,5))*10)/10),
              force: Math.max(0, Math.round((gladiator.force + this.getPj(0.3, 1, 5))*10)/10),
              equilibre: Math.max(0, Math.round((gladiator.equilibre - this.getPj(0.1, 1, 5))*10)/10),
              vitesse: Math.max(0, Math.round((gladiator.vitesse + this.getPj(0.5, 1,5))*10)/10),
              strategie: Math.max(0, Math.round((gladiator.strategie - this.getPj(0.2, 1,5))*10)/10),
              last_training: Date.now()
            }

          } else if(this.ludiInfos.specialite === Constants.LUDIS.ATHLETICS) {
            capacitiesToUpdate = {
              adresse : Math.max(0, Math.round((gladiator.adresse + this.getPj(0.4, 3,9))*10)/10),
              force: Math.max(0, Math.round((gladiator.force + this.getPj(0.3, 3, 9))*10)/10),
              equilibre: Math.max(0, Math.round((gladiator.equilibre - this.getPj(0.1, 3, 9))*10)/10),
              vitesse: Math.max(0, Math.round((gladiator.vitesse + this.getPj(0.5, 3,9))*10)/10),
              strategie: Math.max(0, Math.round((gladiator.strategie - this.getPj(0.2, 3,9))*10)/10),
              last_training: Date.now()
            }
          }
        break;
      }
      let updateGladiator = await axios.patch(`http://localhost:3000/gladiateurs/${gladiator.id}`, capacitiesToUpdate)
      console.log(updateGladiator)
      await this.getLudiGladiators()
    },
    async getLudiInfos() {
      const ludi = await axios.get(`http://localhost:3000/ludis/${this.$route.params.idLudi}`)
      this.ludiInfos = ludi.data
    },
    getNewNumber() {
      this.$store.state.connectedUser.deniers >= 5 ? this.$store.state.connectedUser.deniers -= 5 : this.$store.state.connectedUser.deniers = 0
      return this.$store.state.connectedUser.deniers
    },
    getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getPj(coef, min, max) {
      return this.getRandomIntInclusive(min, max) * coef
    },
    checkDeniers() {
      return this.$store.state.connectedUser.deniers < 5
    }
  },
  mounted() {
    this.getLudiGladiators()
    this.getLudiInfos()
  }
}
</script>

<style scoped>
.gladiatorBloc {

}

.gladiatorRow {
  margin: 20px
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}
</style>