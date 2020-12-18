<template>
  <el-dialog
    title="设置"
    :visible.sync="dialogShow"
    width="840px"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-divider class="dialogDivider"></el-divider>
    <el-form ref="idsForm" style="padding:0px 30px 0px 30px;font-size:16px">
      <el-form-item label="选择可享受此权益的人才卡:" v-if="cardlist && cardlist.length > 0">
        <br />
        <el-checkbox-group v-model="newform.cardIds">
          <el-checkbox
            v-for="(item, index) in cardlist"
            :key="index"
            :checked="item.checked"
            :label="item.cardId"
          >{{ `${item.title}/${item.initialWord}` }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="选择可享受此权益的主要人才荣誉："
        v-if="!cardOnly && canUserHonours && canUserHonours.length > 0"
      >
        <br />
        <el-checkbox-group v-model="newform.talentHonourIds">
          <el-checkbox
            v-for="item in canUserHonours"
            :key="item.value"
            :checked="item.checked"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="选择可享受此权益的人才类别："
        v-if="!cardOnly && canUserCategories && canUserCategories.length > 0"
      >
        <br />
        <el-checkbox-group v-model="newform.categoryIds">
          <el-checkbox
            v-for="item in canUserCategories"
            :key="item.value"
            :checked="item.checked"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item></el-form-item>

      <el-form-item label="选择可享受此权益的人才学历：" v-if="!cardOnly && educations && educations.length > 0">
        <br />
        <el-checkbox-group v-model="newform.educIds">
          <el-checkbox
            v-for="item in educations"
            :key="item.value"
            :checked="item.checked"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="选择可享受此权益的人才职称：" v-if="!cardOnly && titles && titles.length > 0">
        <br />
        <el-checkbox-group v-model="newform.titleIds">
          <el-checkbox
            v-for="item in titles"
            :key="item.value"
            :checked="item.checked"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        style="margin:0px;"
        label="选择可享受此权益的人才职业资格："
        v-if="!cardOnly && qualities && qualities.length > 0 "
      >
        <br />
        <el-checkbox-group v-model="newform.qualityIds">
          <el-checkbox
            v-for="item in qualities"
            :key="item.value"
            :checked="item.checked"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="selectTags">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "checkEquity",
  props: {
    dialogShow: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => {},
    },
    cardOnly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["canUserCategories", "canUserHonours"]),
    ...mapState({
      titles: (state) => state.options.titles,
      qualities: (state) => state.options.qualities,
      educations: (state) => state.options.educations,
      cardlist: (state) => state.options.cardlist,
    }),
  },
  data() {
    return {
      newform: {
        cardIds: [],
        categoryIds: [],
        educIds: [],
        titleIds: [],
        qualityIds: [],
        talentHonourIds: [],
      },
      isIndeterminate: false,
      checkAll: false,
    };
  },
  watch: {
    dialogShow(val) {
      if (val) {
        this.newform = {
          ...this.form,
        };
      }
    },
    newform: {
      handler: function (val) {
        const arr = [].concat(
          val.cardIds,
          val.categoryIds,
          val.educIds,
          val.titleIds,
          val.qualityIds,
          val.talentHonourIds
        );
        const length = arr.length;
        const {
          cardlist,
          canUserCategories,
          educations,
          qualities,
          titles,
          canUserHonours,
        } = this;
        const topArr = [].concat(
          cardlist,
          canUserCategories,
          educations,
          qualities,
          titles,
          canUserHonours,
        );
        const toplength = topArr.length;
        if (length == 0) {
          this.isIndeterminate = false;
          this.checkAll = false;
        } else if (length < toplength) {
          this.isIndeterminate = true;
          this.checkAll = false;
        } else {
          this.isIndeterminate = false;
          this.checkAll = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        if (this.cardOnly) {
          this.setIds(this.cardlist, "cardIds", "cardId");
          this.isIndeterminate = false;
          this.checkAll = false;
        } else {
          this.setIds(this.cardlist, "cardIds", "cardId");
          this.setIds(this.canUserCategories, "categoryIds");
          this.setIds(this.educations, "educIds");
          this.setIds(this.titles, "titleIds");
          this.setIds(this.qualities, "qualityIds");
          this.setIds(this.canUserHonours, "talentHonourIds");
          this.isIndeterminate = false;
          this.checkAll = false;
        }
      } else {
        this.$set(this.newform, "cardIds", []);
        this.$set(this.newform, "categoryIds", []);
        this.$set(this.newform, "educIds", []);
        this.$set(this.newform, "titleIds", []);
        this.$set(this.newform, "qualityIds", []);
        this.$set(this.newform, "talentHonourIds", []);
        this.isIndeterminate = false;
        this.checkAll = true;
      }
    },
    setIds(arr, keyStr, type = "value") {
      const ids = [];
      arr.map((item) => {
        ids.push(item[type]);
      });
      this.$set(this.newform, keyStr, ids);
    },
    selectTags() {
      this.$emit("submit", this.newform);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.dialogDivider {
  margin-top: -20px;
}
</style>
