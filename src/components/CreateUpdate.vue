<template>
<div>
  <v-tooltip top>
    <v-list-tile slot="activator" @click="" ripple>
        <v-list-tile-action>
          <v-icon>update</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{item.created_at | humanizeMoment}}</v-list-tile-title>
          <v-list-tile-sub-title>Created at</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <span>{{item.created_at}}</span>
  </v-tooltip>

  <v-tooltip top>
    <v-list-tile slot="activator" @click="" ripple>
      <v-list-tile-action />
      <v-list-tile-content>
        <v-list-tile-title>{{item.updated_at | humanizeMoment}}</v-list-tile-title>
        <v-list-tile-sub-title>Updated at</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
    <span>{{item.updated_at}}</span>
  </v-tooltip>
</div>
</template>

<script>

import moment from 'moment'
export default {
  props: {
    item: {}
  },
  filters: {
    humanizeMoment: function (datetime) {
        return moment(datetime).fromNow()
    }
  }
}
</script>
