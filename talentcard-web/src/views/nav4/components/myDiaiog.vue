<template>
  <div>
    <el-dialog
      :title="setTitles"
      width="640px"
      :visible.sync="editpassdialogvis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <el-form ref="editpassdialogform" :model="findOneform" :rules="rules" label-width="160px">
        <el-form-item label="政策类型:" prop="ptname">
          <el-input
            class="newAccountInput"
            show-word-limit
            maxlength="10"
            v-model.trim="findOneform.ptname"
            :disabled="clickType==2 || clickType==3"
            placeholder="请填写政策类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="不可同享类型:">
          <el-tag
            class="tag-margin"
            v-for="item in findOneform.eids || []"
            :key="item"
            :closable="clickType==1 || clickType==2"
            @close="handleClose(item)"
          >{{ formatCategory(item) }}</el-tag>
          <el-button type="text" @click="newtypeVis = true" :disabled="clickType==3">添加不可同享政策类型</el-button>
        </el-form-item>
        <el-form-item label="描述:" prop="desc">
          <el-input
            type="textarea"
            v-model="findOneform.desc"
            maxlength="200"
            style="width:400px"
            :rows="4"
            :disabled="clickType==3"
            placeholder="请输入描述"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(false)">取 消</el-button>
        <el-button type="primary" @click="closeDialog(true)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="请选择要添加的不可同享政策类型："
      width="640px"
      :visible.sync="newtypeVis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-checkbox-group v-model="findOneform.eids  ">
        <el-checkbox-button
          v-for="item in canUserPolicy"
          :label="item.value"
          :key="item.value"
        >{{ item.label}}</el-checkbox-button>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTag">取 消</el-button>
        <el-button type="primary" @click="newtypeVis = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addPolicy, editPolicy } from "../../../api/api";
import { mapState, mapActions, mapGetters } from "vuex";

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
    titles: {
      type: String,
      default: "",
    },
    clickType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      newtypeVis: false,
      rules: {
        ptname: [
          {
            required: true,
            message: "请输入政策类型",
            trigger: ["blur"],
          },
        ],
        desc: [
          {
            required: true,
            message: "请输入政策类型描述",
            trigger: ["blur"],
          },
        ],
      },
    };
  },
  methods: {
    closeTag() {
      this.newtypeVis = false;
    },
    async closeDialog(val) {
      if (!val) {
        this.$emit(
          "closeseeDialog",
          val
        );
        return;
      }
      this.$refs.editpassdialogform.validate(async (valid) => {
        if (valid) {
          if (val && this.clickType == 2) {
            let res = await editPolicy(this.findOneform);
          }
          if (val && this.clickType == 1) {
            let res = await addPolicy(this.findOneform);
          }
          this.$message({
            message: this.titles + "成功",
            type: "success",
          });
        } else {
          return;
        }
        this.$emit(
          "closeseeDialog",
          val
        );
      });
    },
    handleClose(item) {
      this.$emit("handleClose", item);
    },
  },
  computed: {
    ...mapState({
      policy: (state) => state.options.policy,
    }),
    ...mapGetters(["canUserPolicy"]),
    setTitles() {
      return this.titles + "政策类型";
    },
    formatCategory() {
      return function (val) {
        for (let i = 0; i < this.policy.length; i++) {
          if (this.policy[i].value == val) {
            return this.policy[i].label;
          }
        }
      };
    },
  },
  watch: {
    "findOneform.eids"(newVal) {
      if (newVal) {
        this.findOneform.eids = newVal;
      } else {
        this.findOneform.eids = [];
      }
    },
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
.tag-margin {
  margin: 0 7px;
}
</style>
