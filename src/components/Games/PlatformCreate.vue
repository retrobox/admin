<template>
  <div>
    <v-card>
      <v-card-text>
        <form>
          <v-layout row wrap>
            <v-flex md6>
              <v-text-field
                required
                label="Name"
                v-model="name"
              ></v-text-field>
            </v-flex>

            <v-flex md6>
              <v-text-field
                label="Short"
                v-model="short"
              ></v-text-field>
            </v-flex>

            <v-flex md6>
              <v-text-field
                label="Manufacturer"
                v-model="manufacturer"
              ></v-text-field>
            </v-flex>

            <v-flex md6>
              <v-text-field
                label="Cpu"
                v-model="cpu"
              ></v-text-field>
            </v-flex>

            <v-flex md6>
              <v-text-field
                label="Memory"
                v-model="memory"
              ></v-text-field>
            </v-flex>

            <v-flex md6>
              <v-text-field
                label="Sound"
                v-model="sound"
              ></v-text-field>
            </v-flex>

            <v-flex md6>
              <v-text-field
                label="Graphics"
                v-model="graphics"
              ></v-text-field>
            </v-flex>

            <v-flex md12>
              <v-textarea
                label="Description"
                v-model="description"
              ></v-textarea>
            </v-flex>

          </v-layout>

        </form>
      </v-card-text>
      <v-card-actions>
        <v-layout justify-end>
          <v-btn @click="save" color="primary" flat>Submit</v-btn>
        </v-layout>

      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        name: '',
        short: '',
        manufacturer: '',
        description: '',
        cpu: '',
        memory: '',
        graphics: '',
        sound: '',
        display: '',
        media: '',
        max_controllers: '',
        thegamesdb_rating: 0
      }
    },
    methods: {
      onMounted: function () {
      },
      save: function () {

      }
    },
    created() {
      this.$store.commit('SET_TITLE', 'Create a platform');
      this.$store.commit('SET_LAYOUT', 'dashboard')
    }
  }
</script>