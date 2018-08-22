<template>
  <div>
    <md-list class="md-double-line md-card">
      <
      <span class="divider orange">$1345 Due</span>
      <md-list-item v-for @click="transEdit">
          <md-icon>attach_money</md-icon>
          <div class="md-list-item-text">
              <span>3301 Highland ave kcmo</span>
              <span style="color:orange">Due 11/1</span>  
          </div>
          <div class="md-headline">
            $695
          </div>
      </md-list-item>
      <md-divider></md-divider>
      <md-list-item>
        <md-icon >attach_money</md-icon> 
        <div class="md-list-item-text">
            <span>6940 Kensington ave kcmo</span>
            <span>Due 11/1</span> 
        </div>
        <div class="md-headline">
            $650
        </div>
      </md-list-item>
      
          <span class="divider">October 12, 2017</span>
          
      <md-list-item>
        <md-icon  style="color:green;">attach_money</md-icon> 
        <div class="md-list-item-text">
            <span>3439 Highland ave kcmo</span>
            <span>Due 11/1</span> 
        </div>
        <div class="md-headline">
            $650
        </div>
      </md-list-item>
      <md-list-item>
        <md-icon  style="color:green;" >attach_money</md-icon> 
        <div class="md-list-item-text">
            <span>3516 Michigan ave kcmo</span>
            <span>Due 11/1</span> 
        </div>
        <div class="md-headline">
            $740
        </div>
      </md-list-item>
      
          <span class="divider">October 7, 2017</span>
          
      <md-list-item>
        <md-icon class="paid">attach_money</md-icon> 
        <div class="md-list-item-text">
            <span>2839 Sterlin ave Independence, MO</span>
            <span>Due 11/1</span> 
        </div>
        <div class="md-headline">
            $650
        </div>
      </md-list-item>
      <md-list-item>
        <md-avatar>
          <img src="https://d32ogoqmya1dw8.cloudfront.net/images/teacherprep/resources/activities/example_check.jpg" alt="check">
        </md-avatar> 
        <div class="md-list-item-text">
            <span>123 Main St kcmo</span>
            <span>Due 11/1</span> 
        </div>
        <div class="md-headline">
            $650
        </div>
      </md-list-item>
      <md-list-item>
        <md-avatar>
          <img src="https://d32ogoqmya1dw8.cloudfront.net/images/teacherprep/resources/activities/example_check.jpg" alt="check">
        </md-avatar> 
        <div class="md-list-item-text">
            <span>123 Main St kcmo</span>
            <span>Due 11/1</span> 
        </div>
        <div class="md-headline">
            $650
        </div>
      </md-list-item>
      <md-list-item>
        <md-icon class="paid">attach_money</md-icon> 
        <div class="md-list-item-text">
            <span>2839 Sterlin ave Independence, MO</span>
            <span>Due 11/1</span> 
        </div>
        <div class="md-headline">
            $650
        </div>
      </md-list-item>
          
    </md-list>
      
    <md-button class="md-fab md-fab-bottom-right" @click.native="newTrans">
      <md-icon>add</md-icon>
    </md-button>
   </div>
</template>

<script>
  import leaseTransService from '../services/leaseTrans';
  
  export default {
    name: 'tranAll',
    data: () => ({
      leasTransData: null,
    }),
    methods: {
      init() {
        if (navigator.onLine) {
          const token = localStorage.token;
          let tmp;
          leaseTransService.leaseTransAll(token).then((response) => {
            tmp = response.data[0][0];
            console.log('TransAll', tmp);
          });
        }
      },
      unit() {
        this.$router.push('/dash/unit');
      },
      transEdit() {
        this.$router.push('/dash/transEdit');
      },
    },
    mounted() {
      this.init();
    },
  };
  
</script>
<style>
  .paid {
    color: green;
  }
</style>

