<template>
  <div class="add-category">
    <v-card>
      <v-card-text>
        <form>
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            :counter="30"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
          <v-select
            v-model="locale"
            :items="locales"
            :error-messages="localeErrors"
            label="Locale"
            required
            @change="$v.locale.$touch()"
            @blur="$v.locale.$touch()"
          ></v-select>
          <v-checkbox
            v-model="is_customizable"
            :error-messages="isCustomizableErrors"
            label="Is customizable ?"
            required
            @change="$v.is_customizable.$touch()"
            @blur="$v.is_customizable.$touch()"
          ></v-checkbox>
        </form>
      </v-card-text>
      <v-card-actions>
          <v-btn @click="submit" color="primary">submit</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
    import { validationMixin } from 'vuelidate'
    import { required, maxLength, email } from 'vuelidate/lib/validators'

    export default {
        mixins: [validationMixin],

        validations: {
          name: { required, maxLength: maxLength(30) },
          is_customizable: { required },
          locale: { required }
        },
        data() {
            return {
              name: '',
              locale: '',
              is_customizable: false,
              locales: [
                'fr',
                'en'
              ]
            }
        },
        computed: {
          isCustomizableErrors () {
            const errors = []
            if (!this.$v.is_customizable.$dirty) return errors
            return errors
          },
          localeErrors () {
            const errors = []
            if (!this.$v.locale.$dirty) return errors
            !this.$v.locale.required && errors.push('Locale is required')
            return errors
          },
          nameErrors () {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.maxLength && errors.push('Name must be at most 30 characters long')
            !this.$v.name.required && errors.push('Name is required.')
            return errors
          }
        },
        methods: {
            onMounted: function() {
            },
            submit () {
              this.$v.$touch();
              if (!this.$v.$invalid) {
                  this.$apitator.query(this, {
                      body: {
                        query:`mutation($category: ShopCategoryStoreInput!){storeShopCategory(category: $category){id,saved}}`,
                        variables: {
                          category: {
                            title: this.name,
                            locale: this.locale,
                            is_customizable: this.is_customizable
                          }
                        }
                      }
                  }).then((response) => {
                    this.$store.commit('ADD_ALERT', {
                      color: 'success',
                      text: 'Added a category!'
                    })
                    this.$router.push({name: 'ShopCategory', params: {id: response.data.data.storeShopCategory.id}})
                  })
              }
            }
        },
        created() {
            this.$store.commit('SET_TITLE', 'Add a shop category')
            this.$store.commit('SET_LAYOUT', 'dashboard')
        }
    }
</script>
