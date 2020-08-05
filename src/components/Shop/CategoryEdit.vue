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
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(30) },
    is_customizable: { required },
    locale: { required }
  },
  data: () => ({
    name: '',
    locale: '',
    is_customizable: false,
    locales: ['fr', 'en']
  }),
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
      !this.$v.name.maxLength &&
        errors.push('Name must be at most 30 characters long')
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    }
  },
  methods: {
    onMounted () {
      this.fetchData()
    },
    fetchData () {
      this.$apitator
        .query(this, {
          body: {
            query: `query ($id: String!){
              getOneShopCategory (id: $id) {
                id, locale, title, is_customizable
              }
            }`,
            variables: { id: this.$route.params.id }
          }
        })
        .then((response) => {
          this.name = response.data.data.getOneShopCategory.title
          this.locale = response.data.data.getOneShopCategory.locale
          this.is_customizable = response.data.data.getOneShopCategory.is_customizable
        })
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$apitator
          .query(this, {
            body: {
              query: `mutation ($category: ShopCategoryUpdateInput!) {
                updateShopCategory (category: $category)
              }`,
              variables: {
                category: {
                  id: this.$route.params.id,
                  title: this.name,
                  locale: this.locale,
                  is_customizable: this.is_customizable
                }
              }
            }
          })
          .then((response) => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Updated a category!'
            })
            this.$router.push({
              name: 'ShopCategory',
              params: { id: this.$route.params.id }
            })
          })
      }
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Update a shop category')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
