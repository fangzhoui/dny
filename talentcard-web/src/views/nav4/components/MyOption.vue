<template>
  <div>
    <el-select v-model="policyTypes" :placeholder="defaulttext" @change="changeValue" :disabled="disabled">
      <el-option
        v-for="(item,i) in tableColumns"
        :key="i"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "MyOption",
  props: {
    tableValue: {
      type: String,
      default: "",
    },
    tableColumns: {
      type: Array,
      defualt: () => [],
    },
    policyType: {
      type: Number,
      default: 0,
    },
      disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      policyTypes: "",
    };
  },
  watch: {
     policyType: {
      handler: function (newvalue, oldvalue) {
        newvalue == 0?this.policyTypes = "" :this.policyTypes = newvalue /1
        // this.policyTypes = newvalue /1
      },
      immediate:true
    },
  },
  computed: {
    defaulttext() {
      return "请选择" ;
    },
  },
  created() {},
  mounted() {
    console.log();
  },
  methods: {
    changeValue(value) {
      this.$emit("changeValue", value );
    },
  },
};
</script>

<style scoped lang="less">
</style>
