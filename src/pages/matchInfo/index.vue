<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">消息分析</div>
      <div class="fx align-items">
        <div>赛程时间：</div>
        <div class="ml-10">
          <el-date-picker
              v-model="matchDate"
              type="date"
              size="small"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="ml-10">赛程名称：</div>
        <div>
          <el-input
              placeholder="输入赛程名称"
              size="small"
              v-model="matchName">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="ml-10"><el-button type="primary"  size="small"  @click="getInfo">查询</el-button></div>
      </div>
    </div>
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column
          fixed
          type="index"
          label="序号"
          align="center"
          width="50">
      </el-table-column>
      <el-table-column
          prop="matchName"
          width="180"
          label="赛程标题">
      </el-table-column>
      <el-table-column
          label="主队名称"
          width="120"
          align="center">
        <template slot-scope="scope">
          <span>{{scope.row.homeTeam.teamName}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="90"
          label="主队图片">
        <template slot-scope="scope">
          <div v-if="scope.row.homeTeam.teamIcon">
            <img  :src="scope.row.homeTeam.teamIcon" width="80px" height="80px"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="客队名称"
          width="120"
          align="center">
        <template slot-scope="scope">
          <span>{{scope.row.awayTeam.teamName}}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="90"
          label="客队图片">
        <template slot-scope="scope">
          <div v-if="scope.row.awayTeam.teamIcon">
            <img  :src="scope.row.awayTeam.teamIcon" width="80px" height="80px"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="消息类型"
          width="80"
          align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sportsType === 0">足球</span>
          <span v-if="scope.row.sportsType === 1">篮球</span>
          <!--          <span v-if="scope.row.adType === '3'">电影</span>-->
        </template>
      </el-table-column>
      <el-table-column
          label="赛程时间"
          width="150"
          align="center">
        <template slot-scope="scope">
          <span>{{scope.row.matchDate}} {{scope.row.matchTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          width="250">
        <template slot-scope="scope">
          <div class="fx align-items cursor">
              <div  @click="openLiveConfig(scope.row)">
                <el-button type="primary" class="cursor"
                           size="mini" plain >新增消息分析</el-button>
              </div>
              <div class="ml-10"  @click="updateConfig(scope.row.id, 'good')">
                <el-button type="primary" class="cursor"
                           size="mini" plain >修改有利消息</el-button>
              </div>
            </div>
          <div class="fx align-items cursor mt-10">
            <div  @click="updateConfig(scope.row.id, 'bad')">
              <el-button type="primary" class="cursor"
                         size="mini" plain >修改不利消息</el-button>
            </div>
            <div class="ml-10"  @click="updateConfig(scope.row.id, 'neutral')">
              <el-button type="primary" class="cursor"
                         size="mini" plain >修改中利消息</el-button>
            </div>
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
    <el-dialog title="消息管理" :visible.sync="dialogFormVisible"  width="550px">
      <el-form :model="form" ref="form">
        <el-form-item label="队伍名称" :label-width="formLabelWidth">
          <el-radio v-model="form.teamId" :label="homeTeam.id" @change="checkDy(1)">{{homeTeam.teamName}}</el-radio>
          <el-radio v-model="form.teamId" :label="awayTeam.id" @change="checkDy(2)">{{awayTeam.teamName}}</el-radio>
        </el-form-item>
        <el-form-item label="队伍主次" :label-width="formLabelWidth"  prop="sportsId" >
          {{form.homeAway}}
        </el-form-item>
        <el-form-item label="消息类型" :label-width="formLabelWidth"  prop="sportsId" >
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="good" value="good"></el-option>
            <el-option label="bad" value="bad"></el-option>
            <el-option label="neutral" value="neutral"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息内容" :label-width="formLabelWidth" prop="fakeMsg">
          <el-input
              type="textarea"
              :rows="10"
              placeholder="请输入内容"
              v-model="form.content">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" v-if="isAdd" @click="addSumbit">确 定</el-button>
        <el-button type="primary" v-if="!isAdd" @click="updateSumbit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="消息列表" :visible.sync="dialogFormVisible1"  width="80%">
      <el-table
          :data="matchIntelligence"
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
            prop="matchShortName"
            label="消息名称">
        </el-table-column>
        <el-table-column
            prop="teamName"
            label="队伍名称">
        </el-table-column>
        <el-table-column
            prop="homeAway"
            label="队伍类型">
        </el-table-column>
        <el-table-column
            prop="type"
            label="消息类型">
        </el-table-column>
        <el-table-column
            prop="content"
            label="消息内容">
        </el-table-column>
        <el-table-column
            fixed="right"
            width="130">
          <template slot-scope="scope">
            <div class="fx align-items">
              <div class="update  w-32 bg-f2" @click="openDialog(scope.row,1)"><img src="../../assets/image/update-q.png"></div>
              <div class="ml-10 mt-10"  @click="openDialog(scope.row,2)"><img src="../../assets/image/delete-q.png"></div>
            </div>
<!--            <el-button type="primary" class="cursor" size="mini" plain @click="openDialog(scope.row)">修改</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          background
          :hide-on-single-page="true"
          @current-change="handleCurrentChange1"
          :current-page="currents1.currentPage"
          :page-sizes="[15, 20, 30]"
          :page-size="15"
          layout="total, prev, pager, next, jumper"
          :total="currents1.currentTotal">
      </el-pagination>
    </el-dialog>
    <el-dialog title="修改消息内容" :visible.sync="dialogFormVisible2"  width="50%">
      <el-form :model="form" ref="form">
      <el-form-item label="消息内容" :label-width="formLabelWidth" prop="content">
        <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
            v-model="form.content">
        </el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear2">取 消</el-button>
        <el-button  type="primary"  @click="editMatchLiveConfig">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      currents: {
        currentPage: 1,
        currentTotal: 0
      },
      ps: {
        pageNo: 1,
        pageSize: 15
      },
      currents1: {
        currentPage: 1,
        currentTotal: 0
      },
      ps1: {
        pageNo: 1,
        pageSize: 15
      },
      matchDate: '',
      search: '',
      matchName: '',
      tableData: [],
      fileList: [],
      matchId: '',
      formLabelWidth: '100px',
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      isAdd: true,
      isAdd1: false,
      matchIntelligence: [],
      homeName: '',
      homeTeam: [],
      awayTeam: [],
      form: {
        content: '',
        deleted: 0,
        homeAway: '',
        id: 0,
        matchId: '',
        matchShortName: '',
        teamId: '',
        teamName: '',
        type: ''
      }
    }
  },
  mounted () {
    this.getInfo()
    // this.getTeamList()
  },
  methods: {
    clear () {
      this.isAdd = false
      let param = {
        content: '',
        deleted: 0,
        homeAway: '',
        id: 0,
        matchId: '',
        matchShortName: '',
        teamId: '',
        teamName: '',
        type: ''
      }
      this.form = Object.assign(param)
      this.dialogFormVisible = false
      this.dialogFormVisible1 = false
      this.dialogFormVisible2 = false
    },
    checkDy (num) {
      if (num === 1) {
        this.$set(this.form, `homeAway`, 'home')
        this.$set(this.form, `teamName`, this.homeTeam.teamName)
      }
      if (num === 2) {
        this.$set(this.form, `homeAway`, 'away')
        this.$set(this.form, `teamName`, this.awayTeam.teamName)
      }
    },
    openLiveConfig (item) {
      this.$set(this.form, `matchId`, item.id)
      this.$set(this.form, `matchShortName`, item.matchShortName)
      this.homeTeam = item.homeTeam
      this.awayTeam = item.awayTeam
      this.dialogFormVisible = true
    },
    clear2 () {
      this.dialogFormVisible2 = false
    },
    openDialog (data, num) {
      this.form = Object.assign(data)
      if (num === 1) {
        this.dialogFormVisible2 = true
      }
      if (num === 2) {
        this.deleteSumbit()
      }
    },
    updateConfig (id, type) {
      this.getMatchIntelligence(id, type)
      this.dialogFormVisible1 = true
    },
    add () {
      this.clear()
      this.isAdd = true
      this.dialogFormVisible = true
    },
    deleteSumbit () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$set(this.form, `deleted`, 1)
        this.updateSumbit()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查询消息列表
    getInfo () {
      let time = ''
      if (this.matchDate) {
        time = this.fromDate(this.matchDate)
      }
      let param = {
        pageNum: this.ps.pageNo,
        pageSize: this.ps.pageSize,
        endDate: '',
        matchDate: time,
        startDate: '',
        matchName: this.matchName
      }
      this.$axios('post', '/match/backGetMatchList', param).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.dataList
          this.currents.currentTotal = res.data.countSize
        }
      })
    },
    // 查询消息列表
    getMatchIntelligence (id, type) {
      let param = {
        pageNum: this.ps1.pageNo,
        pageSize: this.ps1.pageSize,
        matchId: id,
        type: type
      }
      this.$axios('post', '/articleBack/getMatchIntelligence', param).then((res) => {
        if (res.code === 200) {
          this.matchIntelligence = res.data.dataList
          this.currents1.currentTotal = res.data.countSize
        }
      })
    },
    handleCurrentChange (val) {
      this.ps.pageNo = val
      this.getInfo()
    },
    handleCurrentChange1 (val) {
      this.ps1.pageNo = val
      this.getTeamList()
    },
    // 修改消息内容
    editMatchLiveConfig () {
      this.updateSumbit()
    },
    // 新增消息
    addSumbit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$delete(this.form, 'id')
          let param = this.form
          this.$axios('post', '/articleBack/editMatchIntelligenceById', param).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
              this.getInfo()
              this.clear()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改消息
    updateSumbit () {
      let param = this.form
      this.$axios('post', '/articleBack/editMatchIntelligenceById', param).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getInfo()
          this.clear()
        }
      })
    },
    fromDate (date) {
      var d = new Date(date)
      var m = (d.getMonth() + 1)
      var day = d.getDate()
      if (m < 10) {
        m = '0' + (d.getMonth() + 1)
      }
      if (day < 10) {
        day = '0' + d.getDate()
      }
      var datetime = d.getFullYear() + '-' + m + '-' + day
      return datetime
    }
  }
}
</script>

<style scoped>

</style>
