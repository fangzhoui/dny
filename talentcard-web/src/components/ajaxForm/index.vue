<template>
  <el-form
    :inline="true"
    :model="searchForm"
    label-width="100px"
    :ref="formData.id"
    class="search-form-container"
  >
    <el-form-item
      v-for="item in formData.arr"
      :key="item.key"
      v-show="!item.show"
      :label="item.label"
    >
      <el-input
        v-if="item.type == 'input'"
        v-model="searchForm[item.key]"
        :placeholder="item.placeholder"
        class="input-width"
      ></el-input>
      <el-date-picker
        v-else-if="item.type == 'date-picker'"
        format="yyyy-MM-dd"
        v-model="searchForm[item.key]"
        class="input-width"
        type="date"
        placeholder="选择日期"
      ></el-date-picker>
      <el-date-picker
        v-else-if="item.type == 'month-picker'"
        v-model="searchForm[item.key]"
        format="yyyy-MM"
        value-format="yyyy-MM-dd"
        class="input-width"
        type="month"
        placeholder="选择月份"
      ></el-date-picker>
      <el-select
        clearable
        v-else-if="item.type == 'select'"
        class="input-width"
        v-model="searchForm[item.key]"
        placeholder="请选择"
      >
        <el-option
          v-for="item in item.option"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <template v-else-if="item.type == 'button'">
        <el-button
          v-for="(btn, index) in item.handles"
          :key="index"
          :type="btn.type"
          @click="(e) => btnFn(btn, e)"
          :native-type="btn.event || 'submit'"
          v-show="btn.show!=false"
        >{{ btn.text }}</el-button>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import { formatTime } from "@/utils";
export default {
  name: "ajax-form",
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          id: "demo",
          arr: [],
        };
      },
    },
  },
  data() {
    return {
      searchForm: {},
    };
  },
  computed: {},
  created() {
    this.formData.arr.map((item) => {
      if (item.key) {
        this.$set(this.searchForm, item.key, "");
      }
    });
  },
  methods: {
    btnFn(btn, e) {
      // enter el-form键阻止冒泡
      e && e.stopPropagation()
      e && e.preventDefault()
      const form = {};
      if (btn.event == "reset") {
        this.formData.arr.map((item) => {
          if (item.key) {
            this.$set(this.searchForm, item.key, "");
          }
        });
        btn.fn(this.searchForm);
      } else {
        this.formData.arr.map((item) => {
          if (item.type === "date-picker") {
            form[item.key] = this.searchForm[item.key]
              ? formatTime(this.searchForm[item.key], "yyyy-MM-dd")
              : "";
          } else {
            form[item.key] = item.format
              ? item.format(this.searchForm[item.key])
              : this.searchForm[item.key];
          }
        });
        btn.fn(form);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search-form-container {
  background-color: #fff;
  padding: 10px;
}
.input-width {
  width: 202px !important;
  box-sizing: border-box;
}
</style>
