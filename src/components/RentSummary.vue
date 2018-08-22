<template>
  <md-card @click.native="onClick" md-with-hover>
    <md-ripple>
      <md-card-content>
        <div class="md-ripple md-list-item-content md-disabled">
          <span class="md-title">Rent&nbsp;Due</span><span class="underline">&nbsp</span>
          <strong class="big orange" v-if="!unitid">${{state.rentDue}}</strong>
          <strong class="big orange" v-if="unitid && unit">${{unit.RentDue}}</strong>
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
