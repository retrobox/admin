<template>
  <div class="edit-item">
    <v-layout align-center justify-end row fill-height>
      <v-btn icon @click="fetchData()">
        <v-icon>refresh</v-icon>
      </v-btn>
    </v-layout>
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
            v-model="version"
            :error-messages="versionErrors"
            :counter="30"
            label="Version"
            @input="$v.version.$touch()"
            @blur="$v.version.$touch()"
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
            v-model="description_short"
            :error-messages="descriptionShortErrors"
            :counter="40"
            label="Short description"
            required
            @input="$v.description_short.$touch()"
            @blur="$v.description_short.$touch()"
          ></v-text-field>

          <div class="mt-2" style="margin-bottom:2.9em;">
            <span> Long description </span>
            <mavon-editor
              class="mt-3 mavon-editor"
              v-model="description_long"
              required
              language="en"
              placeholder="Insert some text here to describe the product"
              :toolbars="{bold: true, italic: true, ul: true, ol: true}" />
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

          <v-checkbox
            v-model="show_version"
            :error-messages="showVersionErrors"
            label="Show version ?"
            required
            @change="$v.show_version.$touch()"
            @blur="$v.show_version.$touch()"
          ></v-checkbox>

          <v-text-field
            v-model="image"
            :error-messages="imageErrors"
            label="Thumbnail image url"
            required
            @change="$v.image.$touch()"
            @blur="$v.image.$touch()"
          ></v-text-field>

          <v-layout class="my-4" row wrap justify-center align-center fill-height v-if="!$v.image.$invalid">
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
            <v-btn @click="addGaleryImage()" color="primary" icon><v-icon>add</v-icon></v-btn>
           </v-layout>
           <v-list>
          <v-list-tile
            v-for="(image,index) in galery_images"
            :key="index"
            avatar
            @click=""
          >
            <v-list-tile-action>
              <v-btn ripple icon color="red" small @click="galery_images.splice(index, 1)"><v-icon small>delete</v-icon></v-btn>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title v-text="image"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-avatar>
              <img :src="image">
            </v-list-tile-avatar>
          </v-list-tile>
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
    import { required, maxLength, minValue, decimal, url } from 'vuelidate/lib/validators'

    export default {
        mixins: [validationMixin],

        validations: {
          name: { required, maxLength: maxLength(40) },
          show_version: { required },
          identifier: { required, maxLength: maxLength(40) },
          description_short: { required, maxLength: maxLength(40)},
          description_long: { required },
          version: { maxLength: maxLength(30) },
          weight: { required, minValue: minValue(1), decimal },
          price: { required, minValue: minValue(1), decimal },
          image: { required, url },
          image_to_add: { url }
        },
        data() {
            return {
              name: '',
              identifier: '',
              show_version: false,
              description_short: '',
              description_long: '',
              version: '',
              weight: 10.00,
              price: 10.00,
              image: '',
              galery_images: [],
              image_to_add: "",
              category: {}
            }
        },
        computed: {
          showVersionErrors () {
            return []
          },
          nameErrors () {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.maxLength && errors.push('Name must be at most 40 characters long')
            !this.$v.name.required && errors.push('Name is required.')
            return errors
          },
          versionErrors () {
            const errors = []
            if (!this.$v.version.$dirty) return errors
            !this.$v.version.maxLength && errors.push('Version must be at most 30 characters long')
            return errors
          },
          identifierErrors () {
            const errors = []
            if (!this.$v.identifier.$dirty) return errors
            !this.$v.identifier.maxLength && errors.push('Identifier must be at most 40 characters long')
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
            !this.$v.description_short.maxLength && errors.push('Short description must be at most 40 characters long')
            !this.$v.description_short.required && errors.push('Short description is required.')
            return errors
          },
          descriptionLongErrors () {
            const errors = []
            if (!this.$v.description_long.$dirty) return errors
            !this.$v.description_long.required && errors.push('Long description is required.')
            return errors
          }
        },
        methods: {
            fetchData: function () {
              this.$apitator.query(this, {
                body: {
                  query: `query($id: String!){
                    getOneShopItem(id: $id){
                      id,
                      description_short,
                      description_long,
                      title,
                      price,
                      weight,
                      image,
                      version,
                      identifier,
                      show_version,
                      images{id, url, is_main},
                      category{id, title, is_customizable}
                    }
                  }`,
                  variables: {
                    id: this.$route.params.id
                  }
                }
              }).then((response) => {
                var item = response.data.data.getOneShopItem
                this.name = item.title
                this.description_short = item.description_short
                this.description_long = item.description_long
                this.price = item.price
                this.weight = item.weight
                this.image = item.image
                this.version = item.version
                this.identifier = item.identifier
                this.show_version = item.show_version
                this.category = item.category
                this.galery_images = item.images.map((item) => {
                  return item.url
                })
              })
            },
            onMounted: function() {
              this.fetchData()
            },
            submit () {
              this.$v.$touch();
              if (!this.$v.$invalid) {
                  this.$apitator.query(this, {
                      body: {
                        query:`mutation($item: ShopItemUpdateInput!){updateShopItem(item: $item)}`,
                        variables: {
                          item: {
                            id: this.$route.params.id,
                            title: this.name,
                            description_short: this.description_short,
                            description_long: this.description_long,
                            price: this.price,
                            weight: this.weight,
                            image: this.image,
                            version: this.version,
                            identifier: this.identifier,
                            show_version: this.show_version,
                            category_id: this.category.id,
                            images: this.galery_images.map((item) => {
                              var is_main = this.galery_images.indexOf(item) == 0
                              return {url: item, is_main: is_main}})
                          }
                        }
                      }
                  }).then((response) => {
                    this.$store.commit('ADD_ALERT', {
                      color: 'success',
                      text: 'Updated a item!'
                    })
                    this.$router.push({name: 'ShopItem', params: {id: this.$route.params.id}})
                  })
              }
            },
            addGaleryImage () {
              this.$v.$touch();
              if (this.galery_images.indexOf(this.image_to_add) == -1) {
                this.galery_images.push(this.image_to_add)
              }
            }
        },
        created() {
            this.$store.commit('SET_TITLE', 'Edit a shop item')
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
.mavon-editor .op-icon-divider{
  border-color: #757575 !important;
}
.mavon-editor .v-note-edit.divarea-wrapper.scroll-style{
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
