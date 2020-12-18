<template>
<div class="outcontainer">
  <div class="div">
    <span> {{notifymessage}} </span>
  </div>
</div>
</template>
<script>
export default {
  props:{
    notifymessage:String
  }
}
</script>

<style scoped>
.outcontainer{
  position:absolute;
}
.div{
  height: 25px;
  background-color: #333333;
  color:white;
  border-radius: 7px;
  z-index:9999;
  padding:2px 10px;

  }

</style>