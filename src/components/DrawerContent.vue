<template>
  <md-list>
    <md-list-item @click="gotoPage('')" class="home-drawer-menu">
      <md-icon>keyboard_arrow_left</md-icon>
      <span class="md-list-item-text">816 Realty, llc</span>
    </md-list-item>
    <md-list-item @click="gotoPage('/dash')">
      <md-icon>label_outline</md-icon>
      <span class="md-list-item-text">Home</span>
    </md-list-item>

    <md-list-item @click="gotoPage('/dash/unitAll')">
      <md-icon>home</md-icon>
      <span class="md-list-item-text">Units</span>
    </md-list-item>
    <md-list-item @click="gotoPage('/dash/taskAll')">
      <md-icon>change_history</md-icon>
      <span class="md-list-item-text">Tasks</span>
    </md-list-item>
    <!--<md-list-item @click="gotoPage('/dash/unitAdd')">-->
    <!--  <md-icon>add</md-icon>-->
    <!--  <span class="md-list-item-text">New Unit</span>-->
    <!--</md-list-item>-->
    <md-list-item @click="gotoPage('/dash/personEdit')">
      <md-icon>person</md-icon>
      <span class="md-list-item-text" v-if="state.user">{{state.user.FirstName}}&nbsp;{{state.user.LastName}}</span>
    </md-list-item>
    <!--<md-list-item @click="signOut">-->
    <!--  <md-icon>directions_run</md-icon>-->
    <!--  <span class="md-list-item-text" v-if="state.user">signout</span>-->
    <!--</md-list-item>-->
    
  </md-list>
</template>
<style>
  .home-drawer-menu {
    display: none;
  }
  @media only screen and (max-width: 950px) {
    .home-drawer-menu {
      display: block;
    }
  }
</style>
<script>
export default {
  data: () => ({
  }),
  store: ['state'],
  mounted() {
  },
  methods: {
    gotoPage(route) {
      this.$emit('gotoPage', route);
    },
    signOut() {
      this.$emit('signOut');
    },
  },
};
</script>

