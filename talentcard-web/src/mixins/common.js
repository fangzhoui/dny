export default {
  data() {
    return {
      list: [],
      listState: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      tableData: {},
      formData: {},
      searchForm: {},
      loading: true,
    };
  },
  methods: {
    search(val) {
      val.honour == 6 ? val.honour = 0 : val.honour
      this.searchForm = {
        ...val,
      };
      this.listState = {
        ...this.listState,
        pageNum: 1
      }
      this.getTableList();
    },
    reset(val) {
      this.searchForm = {
        ...val,
      };
      this.listState = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
        this.getTableList();
    },
    handleCurrentChange(val) {
      this.listState = {
        ...this.listState,
        pageNum: val,
      };
      this.getTableList();
    },
    handleSizeChange(val) {
      this.listState = {
        ...this.listState,
        pageSize: val,
      };
      this.getTableList();
    },
  },
};
