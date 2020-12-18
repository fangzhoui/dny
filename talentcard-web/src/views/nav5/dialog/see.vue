<template>
  <div>
    <el-dialog
      title="查看详情"
      width="640px"
      :visible.sync="editpassdialogvis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <el-form ref="editpassdialogform" :model="findOneform" label-width="160px">
        <el-form-item :label="titles">
          <el-input class="newAccountInput" v-model="findOneform.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="状态：" v-if="findOneform.status==1">上架</el-form-item>
        <el-form-item label="状态：" v-else>下架</el-form-item>
        <el-form-item label="描述">
          <el-input
            class="newAccountInput"
            type="textarea"
            :rows="4"
            v-model="findOneform.description"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findOneTalentCategory } from "../../../api/api";
export default {
  components: {},
  props: {
    editpassdialogvis: {
      type: Boolean,
      default: false,
    },
    findOneform: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
    titles: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit("closeseeDialog");
    },
  },
  computed: {},
  filters: {},
  created() {},
};
</script>

<style scoped>
.dialogDivider {
  margin-top: -20px;
}
.newAccountInput {
  width: 300px;
  margin-left: 0px;
}
</style>
