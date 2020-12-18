<template>
  <div>
    <span class="select-ids" @click="dialogShow = true" v-show="!isRead">设置</span>
    <el-row v-if="form.cardIds.length > 0">人才卡：</el-row>
    <el-row>
      <template v-for="item in cardlist">
        <el-tag
          :key="item.label"
          effect="dark"
          style="margin-right:10px;"
          v-if="form.cardIds.includes(item.cardId)"
          closable
          @close="removetag(item.cardId, 'cardIds')"
        >{{ `${item.title}/${item.initialWord}` }}</el-tag>
      </template>
    </el-row>
    <el-row v-if="form.talentHonourIds.length > 0">人才荣誉：</el-row>
    <el-row>
      <template v-for="item in canUserHonours">
        <el-tag
          :key="item.value"
          effect="dark"
          style="margin-right:10px;"
          v-if="form.talentHonourIds.includes(item.value)"
          closable
          @close="removetag(item.value, 'talentHonourIds')"
        >{{ item.label }}</el-tag>
      </template>
    </el-row>
    <el-row v-if="form.categoryIds.length > 0">人才类别：</el-row>
    <el-row>
      <template v-for="item in canUserCategories">
        <el-tag
          :key="item.value"
          effect="dark"
          style="margin-right:10px;"
          v-if="form.categoryIds.includes(item.value)"
          closable
          @close="removetag(item.value, 'categoryIds')"
        >{{ item.label }}</el-tag>
      </template>
    </el-row>
    <el-row v-if="form.educIds.length > 0">人才学历：</el-row>
    <el-row>
      <template v-for="item in educations">
        <el-tag
          :key="item.value"
          effect="dark"
          style="margin-right:10px;"
          closable
          v-if="form.educIds.includes(item.value)"
          @close="removetag(item.value, 'educIds')"
        >{{ item.label }}</el-tag>
      </template>
    </el-row>
    <el-row v-if="form.titleIds.length > 0">人才职称：</el-row>
    <el-row>
      <template v-for="item in titles">
        <el-tag
          :key="item.value"
          effect="dark"
          style="margin-right:10px;"
          closable
          v-if="form.titleIds.includes(item.value)"
          @close="removetag(item.value, 'titleIds')"
        >{{ item.label }}</el-tag>
      </template>
    </el-row>
    <el-row v-if="form.qualityIds.length > 0">人才职业资格：</el-row>
    <el-row>
      <template v-for="item in qualities">
        <el-tag
          :key="item.value"
          effect="dark"
          style="margin-right:10px;"
          closable
          v-if="form.qualityIds.includes(item.value)"
          @close="removetag(item.value, 'qualityIds')"
        >{{ item.label }}</el-tag>
      </template>
    </el-row>
    <select-equity
      :dialogShow="dialogShow"
      :cardList="cardList"
      @close="close"
      @submit="submit"
      :form="form"
      :cardOnly="cardOnly"
    />
  </div>
</template>

<script>
import SelectEquity from "./select";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "checkEquityIndex",
  components: {
    SelectEquity,
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: Number,
      default: 1,
    },
    cardOnly: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      dialogShow: false,
      cardList: [],
    };
  },
  methods: {
    removetag(tag, arrkey) {
      if (this.isRead) {
        return
      }
      const index = this.form[arrkey].indexOf(tag);
      this.form[arrkey].splice(index, 1);
    },
    submit(val) {
      this.$emit("submit", val);
      this.dialogShow = false;
    },
    close() {
      this.dialogShow = false;
    },
  },
  mounted() {
    console.log(this.qualities, 'qualities')
  },
  computed: {
    ...mapGetters(["canUserCategories", "canUserHonours"]),
    ...mapState({
      titles: (state) => state.options.titles,
      qualities: (state) => state.options.qualities,
      educations: (state) => state.options.educations,
      cardlist: (state) => state.options.cardlist,
    }),
    talentListCop() {
      if (this.type && this.type == 1) {
        return this.canUserHonours.filter((item) => item.type !== 100);
      } else if (this.type && this.type == 2) {
        return this.canUserHonours;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.select-ids {
  cursor: pointer;
  height: 20px;
  font-size: 14px;
  color: rgba(54, 152, 233, 1);
  text-decoration: underline;
}
</style>