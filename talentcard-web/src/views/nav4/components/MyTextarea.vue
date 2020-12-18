<template>
  <div>
    <el-input
      type="textarea"
      v-model="textareaValue"
      maxlength="500"
      style="width:400px"
      :rows="8"
      :disabled="disabled"
      :placeholder="tableValue"
      show-word-limit
      @change="loseFocus"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "Textarea",
  props: {
    tableValue: {
      type: String,
      default: "",
    },
    tableColumns: {
      type: Array,
      defualt: () => [],
    },
    textarea: {
      type: String,
      defualt: "",
    },
       disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      textareaValue:""
    };
  },
  computed: {
    // defaulttext() {
    //   return "请选择" + this.tableValue;
    // },
  },
  created() {},
  mounted() {},
  watch: {
    textarea: {
      handler: function (newvalue, oldvalue) {
        this.textareaValue = newvalue
      },
    },
  },
  methods: {
    loseFocus(value) {
      this.$emit("loseFocus", value);
    },
    // changeValue(value) {
    //   this.$emit("changeValue", value);
    // },
  },
};
</script>

<style scoped lang="less">
</style>
