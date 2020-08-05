<template>
  <div class="add-item">
    <v-card>
      <v-card-text>
        <form>
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            :counter="40"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="identifier"
            :error-messages="identifierErrors"
            :counter="40"
            label="Identifier"
            required
            @input="$v.identifier.$touch()"
            @blur="$v.identifier.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="version"
            :error-messages="versionErrors"
            :counter="30"
            label="Version"
            @input="$v.version.$touch()"
            @blur="$v.version.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="description_short"
            :error-messages="descriptionShortErrors"
            :counter="40"
            label="Short description"
            required
            @input="$v.description_short.$touch()"
            @blur="$v.description_short.$touch()"
          ></v-text-field>

          <div class="mt-2" style="margin-bottom:2.9em;">
            <span>Long description</span>
            <mavon-editor
              class="mt-3 mavon-editor"
              v-model="description_long"
              required
              language="en"
              placeholder="Insert some text here to describe the product"
              :toolbars="{bold: true, italic: true, ul: true, ol: true}"
            />
          </div>

          <v-layout justify-space-between row wrap>
            <v-flex md5>
              <v-text-field
                prepend-icon="monetization_on"
                type="number"
                v-model="price"
                :error-messages="priceErrors"
                label="Price"
                required
                @input="$v.price.$touch()"
                @blur="$v.price.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex md5>
              <v-text-field
                prepend-icon="local_shipping"
                type="number"
                v-model="weight"
                :error-messages="weightErrors"
                label="Weight"
                required
                @input="$v.weight.$touch()"
                @blur="$v.weight.$touch()"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout justify-space-between row wrap>
            <v-flex md5>
              <v-checkbox
                v-model="show_version"
                :error-messages="showVersionErrors"
                label="Show version ?"
                required
                @change="$v.show_version.$touch()"
                @blur="$v.show_version.$touch()"
              ></v-checkbox>
            </v-flex>
            <v-flex md5>
              <v-checkbox
                v-model="allow_indexing"
                :error-messages="allowIndexingErrors"
                label="Allow indexing ?"
                required
                @change="$v.allow_indexing.$touch()"
                @blur="$v.allow_indexing.$touch()"
              ></v-checkbox>
            </v-flex>
          </v-layout>

          <v-text-field
            v-model="image"
            :error-messages="imageErrors"
            label="Thumbnail image url"
            required
            @change="$v.image.$touch()"
            @blur="$v.image.$touch()"
          ></v-text-field>

          <v-layout
            class="my-4"
            row
            wrap
            justify-center
            align-center
            fill-height
            v-if="!$v.image.$invalid"
          >
            <v-flex xs8 md6>
              <v-card>
                <v-card-media :src="image" height="200px"></v-card-media>
              </v-card>
            </v-flex>
          </v-layout>

          <!-- add many images -->
          <v-layout justify-space-between row fill-height class="mt-4">
            <v-text-field
              v-model="image_to_add"
              :error-messages="imageToAddErrors"
              label="Galery image url"
              @change="$v.image_to_add.$touch()"
              @blur="$v.image_to_add.$touch()"
            ></v-text-field>
            <v-btn @click="addGaleryImage()" color="primary" icon>
              <v-icon>add</v-icon>
            </v-btn>
          </v-layout>
          <v-list>
            <v-list-item
              v-for="(image,index) in galery_images"
              :key="index"
              avatar>
              <v-list-item-action>
                <v-btn
                  ripple icon color="red" small
                  @click="galery_images.splice(index, 1)"
                >
                  <v-icon small>delete</v-icon>
                </v-btn>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title v-text="image"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar>
                <img :src="image" />
              </v-list-item-avatar>
            </v-list-item>
          </v-list>
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
import {
  required,
  maxLength,
  minValue,
  decimal,
  url
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(40) },
    show_version: { required },
    allow_indexing: { required },
    description_short: { required, maxLength: maxLength(40) },
    description_long: { required },
    version: { maxLength: maxLength(30) },
    identifier: { required, maxLength: maxLength(40) },
    weight: { required, minValue: minValue(1), decimal },
    price: { required, minValue: minValue(1), decimal },
    image: { required, url },
    image_to_add: { url }
  },
  data: () => ({
    name: '',
    show_version: false,
    allow_indexing: false,
    identifier: '',
    description_short: '',
    description_long: '',
    version: '',
    weight: 10.0,
    price: 10.0,
    image: '',
    galery_images: [],
    image_to_add: ''
  }),
  computed: {
    showVersionErrors () {
      return []
    },
    allowIndexingErrors () {
      return []
    },
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength &&
        errors.push('Name must be at most 40 characters long')
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
    versionErrors () {
      const errors = []
      if (!this.$v.version.$dirty) return errors
      !this.$v.version.maxLength &&
        errors.push('Version must be at most 30 characters long')
      return errors
    },
    identifierErrors () {
      const errors = []
      if (!this.$v.identifier.$dirty) return errors
      !this.$v.identifier.maxLength &&
        errors.push('Identifier must be at most 40 characters long')
      !this.$v.identifier.required && errors.push('Identifier is required.')
      return errors
    },
    weightErrors () {
      const errors = []
      if (!this.$v.weight.$dirty) return errors
      !this.$v.weight.decimal && errors.push('Weight must be an float')
      !this.$v.weight.minValue && errors.push('Weight must be at least to 1')
      !this.$v.weight.required && errors.push('Weight is required.')
      return errors
    },
    priceErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.price.decimal && errors.push('Price must be an float')
      !this.$v.price.minValue && errors.push('Price must be at least to 1')
      !this.$v.price.required && errors.push('Price is required.')
      return errors
    },
    imageErrors () {
      const errors = []
      if (!this.$v.image.$dirty) return errors
      !this.$v.image.url && errors.push('Image must be an url')
      !this.$v.image.required && errors.push('Image is required.')
      return errors
    },
    imageToAddErrors () {
      const errors = []
      if (!this.$v.image_to_add.$dirty) return errors
      !this.$v.image_to_add.url && errors.push('Image galery must be an url')
      return errors
    },
    descriptionShortErrors () {
      const errors = []
      if (!this.$v.description_short.$dirty) return errors
      !this.$v.description_short.maxLength &&
        errors.push('Short description must be at most 40 characters long')
      !this.$v.description_short.required &&
        errors.push('Short description is required.')
      return errors
    },
    descriptionLongErrors () {
      const errors = []
      if (!this.$v.description_long.$dirty) return errors
      !this.$v.description_long.required &&
        errors.push('Long description is required.')
      return errors
    }
  },
  methods: {
    onMounted () {},
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$apitator
          .query(this, {
            body: {
              query: `mutation ($item: ShopItemStoreInput!) {
                storeShopItem (item: $item) { id,saved }
              }`,
              variables: {
                item: {
                  title: this.name,
                  description_short: this.description_short,
                  description_long: this.description_long,
                  price: this.price,
                  weight: this.weight,
                  identifier: this.identifier,
                  image: this.image,
                  version: this.version,
                  show_version: this.show_version,
                  allow_indexing: this.allow_indexing,
                  category_id: this.$route.params.id,
                  images: this.galery_images.map((item) => {
                    return { url: item, is_main: this.galery_images.indexOf(item) === 0 }
                  })
                }
              }
            }
          })
          .then((response) => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Added a item!'
            })
            this.$router.push({
              name: 'ShopCategory',
              params: { id: this.$route.params.id }
            })
          })
      }
    },
    addGaleryImage () {
      this.$v.$touch()
      if (this.galery_images.indexOf(this.image_to_add) === -1) {
        this.galery_images.push(this.image_to_add)
      }
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Add a shop item')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
<style>
.mavon-editor {
  z-index: 0 !important;
}
.mavon-editor .v-note-op.shadow {
  background-color: #424242;
}
.mavon-editor .op-icon-divider {
  border-color: #757575 !important;
}
.mavon-editor .v-note-edit.divarea-wrapper.scroll-style {
  background-color: #424242;
}
.mavon-editor .v-note-edit.divarea-wrapper.scroll-style * {
  color: white;
}
.mavon-editor .v-show-content.scroll-style {
  background-color: #424242 !important;
}
.mavon-editor .v-show-content.scroll-style * {
  color: white;
}
</style>
