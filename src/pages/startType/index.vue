<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">主播审核</div>
      <div class="fx align-items">
        <div><el-input
          placeholder="请输入主播昵称"
          size="small"
          v-model="search">
        </el-input></div>
      </div>
    </div>
    <el-table
        :data="tableData.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;"
        header-cell-class-name="bg-f5">
      <el-table-column
        fixed
        type="index"
        label="序号"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="昵称">
      </el-table-column>
      <el-table-column
          prop="realName"
          label="真实名字">
      </el-table-column>
      <el-table-column
          label="身份证号">
        <template slot-scope="scope">
          <span>{{scope.row.idCard}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="身份证正面图">
        <template slot-scope="scope">
            <img v-if="scope.row.cardPhotoPositive" :src="scope.row.cardPhotoPositive" width="100px"/>
        </template>
      </el-table-column>
      <el-table-column
          label="身份证反面图">
        <template slot-scope="scope">
          <img v-if="scope.row.cardPhotoReverse" :src="scope.row.cardPhotoReverse" width="100px"/>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="申请时间">
        <template slot-scope="scope">
          <span>{{scope.row.applyTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="200"
        fixed="right">
        <template slot-scope="scope">
          <div class="cursor">
            <el-button type="success" size="mini"   @click="update(scope.row.id, 1)">通过</el-button>
            <el-button type="primary" plain  size="mini" @click="update(scope.row.id, 2)">驳回</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      :hide-on-single-page="true"
      @current-change="handleCurrentChange"
      :current-page="currents.currentPage"
      :page-sizes="[15, 20, 30]"
      :page-size="15"
      layout="total, prev, pager, next, jumper"
      :total="currents.currentTotal">
    </el-pagination>
    <el-dialog title="主播审核" :visible.sync="dialogFormVisible"  width="388px">
      <el-form>
        <el-form-item label="驳回原因" :label-width="formLabelWidth" prop="reason">
          <el-input v-model="reason" autocomplete="off" style="width: 217px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" @click="updateSumbit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      name: '',
      currents: {
        currentPage: 1,
        currentTotal: 0
      },
      ps: {
        pageNo: 1,
        pageSize: 15
      },
      search: '',
      tableData: [],
      reason: '',
      imgUrl: '',
      fileList: [],
      userId: '',
      formLabelWidth: '125px',
      dialogFormVisible: false,
      isAdd: false
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    clear () {
      this.reason = ''
      this.dialogFormVisible = false
    },
    update (userId, num) {
      if (num === 1) {
        this.reason = '审核通过'
        this.editUserApply(userId, 0)
      } else {
        this.userId = userId
        this.dialogFormVisible = true
      }
    },
    updateSumbit () {
      this.editUserApply(this.userId, 1)
    },
    editUserApply (userId, status) {
      let param = {
        status: status,
        id: userId,
        reason: this.reason
      }
      this.$axios('post', '/backUser/editUserApply', param).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '审核成功!'
          })
          this.dialogFormVisible = false
          this.getInfo(1)
        }
      })
    },
    // 查询列表
    getInfo (num) {
      if (num) {
        this.ps.pageNo = 1
      }
      let param = {
        pageNum: this.ps.pageNo,
        pageSize: this.ps.pageSize
      }
      this.$axios('post', '/backUser/userApplyAnchorList', param).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.dataList
          this.currents.currentTotal = res.data.countSize
        }
      })
    },
    handleCurrentChange (val) {
      this.ps.pageNo = val
      this.getInfo()
    }
  }
}
</script>

<style scoped>

</style>
