<template>
<div>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on" ripple>
        <v-list-item-action>
          <v-icon>update</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.created_at | fromNow }}</v-list-item-title>
          <v-list-item-subtitle>Created at</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <span>{{ item.created_at }}</span>
  </v-tooltip>

  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on" ripple>
        <v-list-item-action />
        <v-list-item-content>
          <v-list-item-title>{{ item.updated_at | fromNow }}</v-list-item-title>
          <v-list-item-subtitle>Updated at</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <span>{{ item.updated_at }}</span>
  </v-tooltip>
</div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({
        created_at: '',
        updated_at: ''
      })
    }
  }
}
</script>
