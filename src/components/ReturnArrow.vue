<template>
  <v-btn class="ma-5" @click="$router.go(-1)">
    <v-icon>mdi-arrow-left</v-icon>
    RETOUR
  </v-btn>
</template>

<script>
export default {
  name: "ReturnArrow"
}
</script>

