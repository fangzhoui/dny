<template>
  <div>
    <el-dialog
      :title="title"
      width="640px"
      :visible.sync="createNewAccountVis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <el-form ref="newaccountform" :model="newaccountform" label-width="160px" :rules="rules">
        <el-form-item :label="titles" prop="name">
          <el-input
            class="newAccountInput"
            v-model="newaccountform.name"
            :placeholder="placeholder"
            maxlength="10"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input
            class="newAccountInput"
            type="textarea"
            :rows="4"
            v-model="newaccountform.description"
            placeholder="请填写描述"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitNewaccount">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addTalentCategory, addTalentHonor } from "../../../api/api";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {},
  props: {
    createNewAccountVis: {
      type: Boolean,
      default: false,
    },
    titles: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      newaccountform: { name: "", description: "" },
      rules: {
        description: [
          {
            required: true,
            message: "请输入描述",
            trigger: ["change", "blur"],
          },
        ],
        name: [
          {
            required: true,
            message: "请输入"+this.titles,
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  computed: {},
  methods: {
    ...mapActions(["getHonours", "getCategories"]),
    submitNewaccount() {
      this.$refs.newaccountform.validate((valid) => {
        if (valid) {
          this.createdNewAccount();
        }
      });
    },
    async createdNewAccount() {
      let para = {
        ...this.newaccountform,
      };
      try {
        this.type == 1
          ? await addTalentCategory(para)
          : await addTalentHonor(para);
        this.$message.success("新增成功");
        this.type == 1 ? this.getCategories() : this.getHonours();
        this.$refs.newaccountform.resetFields();
        this.$emit("submitNewaccount");
      } catch (e) {
        if(e&&e.status == 2730 ){
          this.$message.error('该'+this.titles+'已存在，请重新输入');
        }
      }
    },
    closeDialog() {
      this.$emit("closeDialog",this.$refs.newaccountform.resetFields);
    },
  },
  computed: {
    title() {
      return "新增" + this.titles;
    },
    placeholder(){
      return "请填写" + this.titles;
    }
  },
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
