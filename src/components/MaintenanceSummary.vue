<template>
  <md-card @click.native="onClick" md-with-hover>
    <md-ripple>
      <md-card-header>
        <div class="md-subheading">Maintenance Requests</div>
      </md-card-header>
      <md-card-content v-if="!unitid">
        <div class="md-ripple md-list-item-content md-disabled">
          <span class="md-title">Priority</span><span class="underline">&nbsp</span>
          <strong class="big orange">{{state.tasks.priorities.length}}</strong>
        </div>
        <div class="md-ripple md-list-item-content md-disabled">
          <span class="md-title">Later</span><span class="underline">&nbsp</span>
          <strong class="big">{{state.tasks.laters.length}}</strong>
        </div>
        <div class="md-ripple md-list-item-content md-disabled">
          <span class="md-title">Complete</span><span class="underline">&nbsp</span>
          <strong class="big">{{state.tasks.completes.length}}</strong>
        </div>
      </md-card-content>
    </md-ripple>
  </md-card>
</template>

<script>
  import dexie from '../services/dexie';
  
  export default {
    store: ['state'],
    props: {
      unitid: {
        type: Number,
        default: 0,
      },
    },
    data: () => ({
      unit: null,
    }),
    mounted() {
      if (this.unitid) {
        dexie.filter(dexie.UNIT_STORE_NAME, 'UnitID', this.unitid).then((results) => {
          this.unit = results[0];
        });
      }
    },
    methods: {
      onClick() {
        this.$emit('onPress');
      },
    },
  };

</script>