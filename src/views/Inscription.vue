<template>
  <div>

    <ReturnArrow />

    <v-stepper alt-labels>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">
            Adresse email
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">
            Nom du joueur
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3">
            Catégorie du premier Ludi
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="email" :error-messages="errorMessageMail" label="Email" filled/>
                    <v-text-field v-model="password" :error-messages="errorMessageEmptyPassword" label="Mot de passe" filled type="password"/>
                    <v-text-field v-model="confirmPassword" :error-messages="errorMessagePassword"  label="Confirmer mot de passe" filled type="password"/>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>

            <v-btn color="primary" @click="checkPasswordAndMail">Continue</v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="pseudo" :error-messages="errorMessagePseudo" label="Pseudo" filled></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>

            <v-btn color="primary" @click="checkPseudo">Continue</v-btn>
            <v-btn text @click="e1 = 1">Retour</v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-row align="center">
              <v-col class="d-flex" cols="12" sm="6">
                <v-select :items="ludisTypes" v-model="ludiSelected" @change="checkLudi" filled :error-messages="errorMessageEmptyLudi" label="Type de Ludi"
                ></v-select>
              </v-col>
            </v-row>

            <v-btn color="primary" @click="confirm" >Valider l'inscription</v-btn>
            <v-btn text @click="e1 = 2">Retour</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-stepper>
  </div>
</template>

<script>
  import axios from "axios";
  import ReturnArrow from "@/components/ReturnArrow";
  import Constants from "@/constants";

  export default {
    name: 'Home',
    components: {
      ReturnArrow
    },
    data () {
      return {
        e1: 1,
        ludisTypes: Constants.LUDIS.LUDI_TYPES,
        email:"",
        pseudo:"",
        password:"",
        lanistes:[],
        ludis: [],
        confirmPassword:"",
        errorMessagePassword: [],
        errorMessageEmptyPassword: "",
        ludiSelected: "",
        errorMessageMail: "",
        errorMessagePseudo: "",
        errorMessageEmptyLudi: ""
      }
    },
    methods: {
      async confirm() {
        if (this.ludiSelected !== "") {
          try {
            this.ludis = await axios.get(" http://localhost:3000/ludis");
          } catch(e) {
            console.error(e)
          }

          let highestLanisteId = 1
          let highestLudiId = 1
          this.lanistes.data.forEach(laniste => {if(laniste.id > highestLanisteId) highestLanisteId = laniste.id})
          this.ludis.data.forEach(ludi => {if(ludi.id > highestLudiId) highestLudiId = ludi.id})
          let newLaniste = { "id": highestLanisteId + 1, "email": this.email, "password": this.password, "laniste": this.pseudo, "deniers" : 10 }
          let newLudi = {"id": highestLudiId + 1, "nom": `Ludi de ${this.pseudo}`, "specialite": this.ludiSelected, "lanisteId": newLaniste.id}

          try {
            const response = await axios.post('http://localhost:3000/lanistes', newLaniste);
            const response2 = await axios.post('http://localhost:3000/ludis', newLudi);
            if((response.status === 200 || response.status === 201) || (response2.status === 200 || response2.status === 201)) {
              this.lanistes = await axios.get(" http://localhost:3000/lanistes");
              this.ludis = await axios.get(" http://localhost:3000/ludis");
              const user = this.lanistes.data.find(laniste => laniste.email === this.email && laniste.password === this.password)
              const ludis = this.ludis.data.filter(ludi => ludi.lanisteId === user.id)
              this.$store.commit("updateConnectedUser", user)
              this.$store.commit("updateLudisOfConnectedUser", ludis)
              await this.$router.push("/dashboard")
            }
          } catch(e) {
            console.error(e)
          }

        } else {
          this.checkLudi()
        }
      },
      checkLudi() {
        this.ludiSelected === "" ? this.errorMessageEmptyLudi = Constants.ERROR_MESSAGES.EMPTY_LUDIS : this.errorMessageEmptyLudi = ""
      },
      async checkPasswordAndMail() {
        this.email === "" ? this.errorMessageMail = Constants.ERROR_MESSAGES.EMPTY_MAIL : this.errorMessageMail = ""
        if(this.email !== "") {
          this.lanistes = await axios.get(" http://localhost:3000/lanistes");
          let isExistMail = this.lanistes.data.some(laniste => laniste.email === this.email)
          isExistMail ? this.errorMessageMail = Constants.ERROR_MESSAGES.EXISTING_MAIL : this.errorMessageMail = ""
        }

        this.password !== this.confirmPassword ? this.errorMessagePassword = Constants.ERROR_MESSAGES.MUST_BE_EQUAL_PASS : this.errorMessagePassword = ""
        this.password === "" ? this.errorMessageEmptyPassword = Constants.ERROR_MESSAGES.EMPTY_PASSWORD : this.errorMessageEmptyPassword = ""
        if(this.errorMessageMail === "" && (this.password === this.confirmPassword) && this.password !== "") this.e1 = 2
      },
      checkPseudo() {
        if(this.pseudo === "") {
          this.errorMessagePseudo = Constants.ERROR_MESSAGES.EMPTY_PSEUDO
        } else {
          this.errorMessagePseudo = ""
          this.e1 = 3
        }
      }
    }
  }
</script>
