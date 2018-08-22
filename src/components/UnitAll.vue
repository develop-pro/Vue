<template>
  
  <div>
   <md-card>
      <md-card-content>
        <md-list class="md-double-line">
          <md-list-item v-for="unit in state.units" @click="gotoDetail(unit.UnitID)" :key="unit.UnitID" class="list-item" md-ripple>
            <div class="md-list-item-text">
              <span>
                <span>{{ unit.Address1 }} {{ unit.Address2 }}</span> 
              </span>
              <div>
                <div v-for="tenant in unit.Tenants" class="tenant">
                  <span v-if="tenant.FirstName">{{tenant.FirstName}} {{tenant.LastName}}</span>
                </div>
              </div>
            </div>
            <div>
              <span v-if="unit.RentDue" class="md-title orange">
                ${{ unit.RentDue }}  
              </span>
              <span v-if="!unit.RentDue && unit.Rent" class="md-title">
                ${{ unit.Rent }}  
              </span>
             <md-button class="md-list-action" v-if="!unit.Rent">
               <md-chip >vacant</md-chip>
             </md-button>
            </div>
          </md-list-item>
        </md-list>
        <md-card-actions  md-alignment="space-between">
          <md-button @click.native="gotoAdd">                
            add new unit
          </md-button>
        </md-card-actions>
      </md-card-content>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </md-card>
  </div>
</template>

<style>
  .tenant {
    float: left;
    width: 100px;
  }
  .tenant span{
    color: rgba(0, 0, 0, 0.54);
  }
</style>
<script>
export default {
  data() {
    return {
      sending: false,
    };
  },
  store: ['state'],
  methods: {
    setUnit(selectedTerm) {
      this.$emit('onSelectUnit', Number(selectedTerm.ID));
    },
    gotoDetail(unitid) {
      this.$router.push(`/dash/unit/${unitid}`);
    },
    gotoAdd() {
      this.$router.push('/dash/unitAdd');
    },
  },
  mounted() {
  },
};
</script>