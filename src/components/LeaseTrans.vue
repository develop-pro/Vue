<template>
  <div>
    <md-card>
      <md-card-header class="orange">
        <div class="md-title" v-if="state.RentDue">
          <md-button v-on:click="" ><span class="md-display-1">${{state.RentDue}} Due</span></md-button>
          <md-button @click.native="editTrans(0)" style="float:right;">
            add new
          </md-button>
        </div> 
      </md-card-header>
      <md-list class="md-double-line">
        <md-list-item v-for="item of state.transList" :key="item.TransID" class="list-item" @click="editTrans(item.TransID)" md-ripple>
          <md-icon style="color:green;">attach_money</md-icon> 
          <div>
            {{item.PostDate}}
          </div>
          <div class="md-headline">
            ${{item.Amount}}
          </div>
        </md-list-item>
      </md-list>
    </md-card>
  </div>
</template>

<script>
  import store from '../services/store';

  export default{
    store: ['state'],
    props: {
      unitid: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        form: {
          RentDue: 0,
          transs: [],
        },
      };
    },
    methods: {
      editTrans(transid) {
        store.setSelectedTransID(transid);
      },
    },
    watch: {
      unitid: {
        handler() {
          store.getTransList(this.unitid);
        },
      },
    },
  };
</script>
<style type="text/css">
    
</style>