<template>
  <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showSnackbar" md-persistent>
    <span>
      Data saved offline.
      <br />
      we'll complete the save when you go back online.
    </span>
    <md-button class="md-primary" @click="onClose">GOT IT</md-button>
  </md-snackbar>
</template>
<script>
  export default {
    props: {
      showSnackbar: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({
    }),
    mounted() {
    },
    methods: {
      onClose() {
        this.$emit('onClose');
      },
    },
    watch: {
      showSnackbar: {
        handler() {
        },
      },
    },
  };
</script>