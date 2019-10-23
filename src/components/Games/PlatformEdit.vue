<template>
  <div>
    <v-card>
      <v-card-text>
        <form>
          <v-layout row wrap>
            <v-flex md12 px-3>
              <v-text-field
                required
                label="Name"
                v-model="platform.name"
              ></v-text-field>
            </v-flex>

            <v-flex md6 px-3>
              <v-text-field
                label="Short"
                v-model="platform.short"
              ></v-text-field>
            </v-flex>

            <v-flex md6 px-3>
              <v-text-field
                label="Manufacturer"
                v-model="platform.manufacturer"
              ></v-text-field>
            </v-flex>

            <v-flex md6 px-3>
              <v-text-field
                label="Cpu"
                v-model="platform.cpu"
              ></v-text-field>
            </v-flex>

            <v-flex md6 px-3>
              <v-text-field
                label="Memory"
                v-model="platform.memory"
              ></v-text-field>
            </v-flex>

            <v-flex md6 px-3>
              <v-text-field
                label="Sound"
                v-model="platform.sound"
              ></v-text-field>
            </v-flex>

            <v-flex md6 px-3>
              <v-text-field
                label="Graphics"
                v-model="platform.graphics"
              ></v-text-field>
            </v-flex>

            <v-flex md6 px-3>
              <v-text-field
                label="Display"
                v-model="platform.display"
              ></v-text-field>
            </v-flex>

            <v-flex md6 px-3>
              <v-text-field
                label="Max controllers (int)"
                type="number"
                v-model="platform.max_controllers"
              ></v-text-field>
            </v-flex>

            <v-flex md6 px-3>
              <v-menu
                v-model="datePicker"
                :close-on-content-click="false"
                full-width
                max-width="290"
              >
                <v-text-field
                  slot="activator"
                  :value="computedHumanReleaseDate"
                  clearable
                  label="Released at"
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="platform.released_at"
                  @change="datePicker = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex sm12 px-3>
              <v-textarea
                label="Description"
                v-model="platform.description"
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
  import moment from 'moment'
  export default {
    data() {
      return {
        create: false,
        datePicker: false,
        platform: {
          id: '',
          name: '',
          short: '',
          max_controllers: 0,
          display: '',
          released_at: '',
          manufacturer: '',
          cpu: '',
          memory: '',
          graphics: '',
          description: ''
        }
      }
    },
    computed: {
      computedHumanReleaseDate() {
        return this.platform.released_at ? moment(this.platform.released_at).format('dddd, MMMM Do YYYY') : ''
      },
      computedReleaseDate() {
        return this.platform.released_at ? moment(this.platform.released_at).format('YYYY-MM-DD HH:mm:ss') : ''
      }
    },
    watch: {
      '$route': function() {
        console.log('route changed')
        if (this.$route.params.id === undefined) {
          this.create = true;
          this.$store.commit('SET_TITLE', 'Create a platform');
        } else {
          this.create = false;
          this.$store.commit('SET_TITLE', 'Edit a platform');
        }
      }
    },
    methods: {
      onMounted: function () {
        if (!this.create) {
          this.fetchData()
        }
      },
      fetchData: function () {
        this.$apitator.query(this, {
          body: {
            query: `query($id: String!){
              getOneGamePlatform (id: $id){
                id
                name
                short
                manufacturer
                cpu
                graphics
                max_controllers
                display
                memory
                released_at
                created_at
                updated_at
              }
            }`,
            variables: {
              id: this.$route.params.id
            }
          }
        }).then((response) => {
          this.platform = response.data.data.getOneGamePlatform
          if (this.platform.max_controllers === null) {
            this.platform.max_controllers = 0
          }
        })
      },
      save: function () {
        if (this.create) {
          //create
          this.$apitator.query(this, {
            body: {
              query: `mutation ($platform: GamePlatformStoreInput!) {
                storeGamePlatform(platform: $platform) {
                  id,
                  saved
                }
              }`,
              variables: {
                platform: {
                  name: this.platform.name,
                  short: this.platform.short,
                  description: this.platform.description,
                  manufacturer: this.platform.manufacturer,
                  cpu: this.platform.cpu,
                  memory: this.platform.memory,
                  graphics: this.platform.graphics,
                  display: this.platform.display,
                  sound: this.platform.sound,
                  max_controllers: this.platform.max_controllers,
                  released_at: this.computedReleaseDate
                }
              }
            }
          }).then((response) => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Created a platform!'
            });
            this.$router.push({name: 'GamePlatformEdit', params: {id: response.data.data.storeGamePlatform.id}})
          })
        } else {
          this.$apitator.query(this, {
            body: {
              query: `mutation($platform: GamePlatformUpdateInput!){updateGamePlatform(platform: $platform)}`,
              variables: {
                platform: {
                  id: this.platform.id,
                  name: this.platform.name,
                  short: this.platform.short,
                  description: this.platform.description == null ? '' : this.platform.description,
                  manufacturer: this.platform.manufacturer == null ? '' : this.platform.manufacturer,
                  cpu: this.platform.cpu == null ? '' : this.platform.cpu,
                  memory: this.platform.memory == null ? '' : this.platform.memory,
                  graphics: this.platform.graphics == null ? '' : this.platform.graphics,
                  display: this.platform.display == null ? '' : this.platform.display,
                  sound: this.platform.sound == null ? '' : this.platform.sound,
                  max_controllers: this.platform.max_controllers == null ? '' : this.platform.max_controllers,
                  released_at: this.computedReleaseDate
                }
              }
            }
          }).then(() => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Updated a platform!'
            });
            this.$router.push({name: 'GamePlatforms', params: {id: this.$route.params.id}})
          })
        }
      }
    },
    created() {
      this.$store.commit('SET_LAYOUT', 'dashboard')
      console.log('component recreated!')
      if (this.$route.params.id === undefined) {
        this.create = true;
        this.$store.commit('SET_TITLE', 'Edit a platform');
      } else {
        this.$store.commit('SET_TITLE', 'Create a platform');
      }
    }
  }
</script>