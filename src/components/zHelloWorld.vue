<template>
  <div class="hello">
   howdy
  <a href="/">dash</a>
  <div>
    <ch2>{{$route.params.hid}}</h2>
  </div>
  </div>
</template>

<script>
export default {
  
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App 12348'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
