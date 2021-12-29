<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">红榜配置</div>
      <div class="fx align-items">
        <div>赛程名称：</div>
        <div class="ml-10">
          <el-input v-model="match" size="small"></el-input>
        </div>
        <div class="ml-10">专家名称：</div>
        <div class="ml-10">
          <el-input v-model="user" size="small" style="width: 100px;"></el-input>
        </div>
        <div class="ml-10">创建时间：</div>
        <div class="ml-10">
          <el-date-picker
              v-model="matchTime"
              type="date"
              size="small"
              style="width: 150px"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="ml-10"><el-button type="primary"  size="small"  @click="getInfo">查询</el-button></div>
        <div class="ml-10"><el-button type="primary"  size="small" icon="el-icon-plus" @click="add">增加</el-button></div>
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
          prop="title"
          width="150"
          label="标题">
      </el-table-column>
      <el-table-column
          prop="matchName"
          width="150"
          label="赛程名称">
      </el-table-column>
      <el-table-column
          label="主队vs客队"
          width="150"
          align="center">
        <template slot-scope="scope">
          <span>{{scope.row.homeVsAway}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="专家名称"
          width="150"
          align="center">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--          label="内容"-->
<!--          width="250"-->
<!--          align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{scope.row.content}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
          label="胜负"
          align="center">
        <template slot-scope="scope">
          <span>{{scope.row.winOrLose}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="下注位"
          align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.betPosition === 0">主胜</span>
          <span v-if="scope.row.betPosition === 1">平</span>
          <span v-if="scope.row.betPosition === 2">客胜</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="homeWinOdds"
          align="center"
          label="主胜倍率">
      </el-table-column>
      <el-table-column
          prop="awayWinOdds"
          align="center"
          label="客胜倍率">
      </el-table-column>
      <el-table-column
          prop="flatOdds"
          align="center"
          label="平倍率">
      </el-table-column>
      <el-table-column
          prop="createTime"
          width="200"
          align="center"
          label="创建时间">
      </el-table-column>
      <el-table-column
          fixed="right">
        <template slot-scope="scope">
          <div class="fx  cursor">
            <div class="update w-32 bg-f2" @click="update(scope.row, 1)"><img src="../../assets/image/update-q.png"></div>
            <div class="ml-10" @click="update(scope.row, 2)"><img src="../../assets/image/delete-q.png"></div>
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
    <el-dialog title="红榜管理" :visible.sync="dialogFormVisible"  width="70%">
      <el-form :model="form" ref="form">
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title"  style="width: 200px;margin-right: 10px;"></el-input>
        </el-form-item>
        <el-form-item label="赛事" :label-width="formLabelWidth"  prop="homeId" >
          {{matchInfo}}
          <el-button type="primary"  size="small" @click="openTeam(1)">选择</el-button>
        </el-form-item>
        <el-form-item label="专家" :label-width="formLabelWidth"  prop="awayId" >
          {{userName}}
          <el-button type="primary"  size="small" @click="openTeam(2)">选择</el-button>
        </el-form-item>
        <el-form-item label="下注位" :label-width="formLabelWidth" prop="betPosition">
          <el-radio v-model="form.betPosition" :label="0">主胜</el-radio>
          <el-radio v-model="form.betPosition" :label="1">平</el-radio>
          <el-radio v-model="form.betPosition" :label="2">客胜</el-radio>
        </el-form-item>
        <el-form-item label="主胜倍率" :label-width="formLabelWidth" prop="homeWinOdds">
          <el-input v-model.number="form.homeWinOdds"  style="width: 200px;margin-right: 10px;"></el-input>
        </el-form-item>
        <el-form-item label="客胜倍率" :label-width="formLabelWidth" prop="awayWinOdds">
          <el-input v-model.number="form.awayWinOdds"  style="width: 200px;margin-right: 10px;"></el-input>
        </el-form-item>
        <el-form-item label="平倍率" :label-width="formLabelWidth" prop="flatOdds">
          <el-input v-model.number="form.flatOdds"  style="width: 200px;margin-right: 10px;"></el-input>
        </el-form-item>
        <el-form-item label="推荐理由" :label-width="formLabelWidth" prop="content">
          <quill-editor ref="text" v-model="form.content"  class="myQuillEditor" :options="editorOption" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" v-if="isAdd" @click="addSumbit">确 定</el-button>
        <el-button type="primary" v-if="!isAdd" @click="updateSumbit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="赛事列表" :visible.sync="dialogFormVisible1"  width="80%">
      <div class="fx align-items fx-end">
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
        <div class="ml-10"><el-button type="primary"  size="small"  @click="getBackGetMatchList">查询</el-button></div>
      </div>
      <el-table
          :data="macthData"
          style="width: 100%;margin-top: 20px"
          header-cell-class-name="bg-f5">
        <el-table-column
            fixed
            type="index"
            label="序号"
            align="center"
            width="200">
        </el-table-column>
        <el-table-column
            prop="matchName"
            width="150"
            label="赛程标题">
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
            label="主队名称"
            align="center">
          <template slot-scope="scope">
            <span>{{scope.row.homeTeam.teamName}}</span>
          </template>
        </el-table-column>
        <el-table-column
            width="100"
            label="主队图片">
          <template slot-scope="scope">
            <div v-if="scope.row.homeTeam.teamIcon">
              <img  :src="scope.row.homeTeam.teamIcon" width="80px" height="80px"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="主队得分"
            align="center">
          <template slot-scope="scope">
            <span>{{scope.row.homeTeam.score}}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="客队名称"
            align="center">
          <template slot-scope="scope">
            <span>{{scope.row.awayTeam.teamName}}</span>
          </template>
        </el-table-column>
        <el-table-column
            width="100"
            label="客队图片">
          <template slot-scope="scope">
            <div v-if="scope.row.awayTeam.teamIcon">
              <img  :src="scope.row.awayTeam.teamIcon" width="80px" height="80px"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="客队得分"
            align="center">
          <template slot-scope="scope">
            <span>{{scope.row.awayTeam.score}}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="赛事类型"
            align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sportsType === 0">足球</span>
            <span v-if="scope.row.sportsType === 1">篮球</span>
            <!--          <span v-if="scope.row.adType === '3'">电影</span>-->
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            width="130">
          <template slot-scope="scope">
            <el-button type="primary" class="cursor" size="mini" plain @click="checkTeam(scope.row)">选中</el-button>
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
    <el-dialog title="专家列表" :visible.sync="dialogFormVisible2"  width="80%">
      <el-table
          :data="userData"
          style="width: 100%;"
          header-cell-class-name="bg-f5">
        <el-table-column
            fixed
            type="index"
            label="序号"
            align="center"
            width="50">
        </el-table-column>
        <el-table-column
            align="center"
            prop="sort"
            label="排序">
        </el-table-column>
        <el-table-column
            width="150"
            align="center"
            label="头像">
          <template slot-scope="scope" v-if="scope.row.userIcon">
            <img :src="scope.row.userIcon" width="100px" height="90px"/>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="userName"
            label="专家名称">
        </el-table-column>
        <el-table-column
            align="center"
            prop="follows"
            label="粉丝数">
        </el-table-column>
        <el-table-column
            align="center"
            prop="userDesc"
            label="描述">
        </el-table-column>
        <el-table-column
            fixed="right">
          <template slot-scope="scope">
            <div class="fx cursor">
              <el-button type="primary" class="cursor" size="mini" plain @click="checkUser(scope.row)">选中</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          background
          :hide-on-single-page="true"
          @current-change="handleCurrentChange2"
          :current-page="currents2.currentPage"
          :page-size="15"
          layout="total, prev, pager, next, jumper"
          :total="currents2.currentTotal">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
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
      currents2: {
        currentPage: 1,
        currentTotal: 0
      },
      ps2: {
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
      search: '',
      tableData: [],
      editorOption: {},
      macthData: [],
      userData: [],
      matchInfo: '',
      matchName: '',
      userName: '',
      matchId: '',
      type: '0',
      time: '',
      phone: '',
      form: {
        betPosition: 0,
        content: '',
        deleted: 0,
        id: 0,
        matchId: '',
        flatOdds: 0,
        awayWinOdds: 0,
        homeWinOdds: 0,
        title: '',
        userId: ''
      },
      matchDate: '',
      matchTime: '',
      formLabelWidth: '100px',
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      isAdd: false,
      isAdd1: false,
      match: '',
      user: ''
    }
  },
  mounted () {
    this.getInfo()
    this.getUserInfo()
    this.getBackGetMatchList()
  },
  components: {
    quillEditor
  },
  methods: {
    clear () {
      this.isAdd = false
      let param = {
        betPosition: 0,
        content: '',
        deleted: 0,
        id: 0,
        matchId: '',
        title: '',
        flatOdds: 0,
        awayWinOdds: 0,
        homeWinOdds: 0,
        userId: ''
      }
      this.form = Object.assign(param)
      this.dialogFormVisible = false
    },
    checkTeam (item) {
      this.matchInfo = item.matchShortName
      this.$set(this.form, `matchId`, item.id)
      this.dialogFormVisible1 = false
    },
    checkUser (item) {
      this.userName = item.userName
      this.$set(this.form, `userId`, item.id)
      this.dialogFormVisible2 = false
    },
    deleteInfo (item) {
      this.$set(item, `deleted`, 1)
    },
    clear2 () {
      this.isAdd1 = false
      this.dialogFormVisible2 = false
    },
    updateConfig (id) {
      this.matchId = id
      this.isAdd1 = false
      this.getMatchLiveConfigList(id)
      this.dialogFormVisible2 = true
    },
    add () {
      this.clear()
      this.isAdd = true
      this.dialogFormVisible = true
    },
    openTeam (num) {
      if (num === 1) {
        this.dialogFormVisible1 = true
      }
      if (num === 2) {
        this.dialogFormVisible2 = true
      }
    },
    update (data, num) {
      this.isAdd = false
      this.form = Object.assign({}, data)
      if (num === 1) {
        this.matchInfo = data.matchName
        this.userName = data.userName
        this.dialogFormVisible = true
      } else {
        this.deleteSumbit()
      }
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
    // 查询赛事列表
    getBackGetMatchList () {
      let time = ''
      if (this.matchDate) {
        time = this.fromDate(this.matchDate)
      }
      let param = {
        pageNum: this.ps1.pageNo,
        pageSize: this.ps1.pageSize,
        endDate: '',
        matchDate: time,
        startDate: '',
        matchName: this.matchName
      }
      this.$axios('post', '/match/backGetMatchList', param).then((res) => {
        if (res.code === 200) {
          this.macthData = res.data.dataList
          this.currents1.currentTotal = res.data.countSize
        }
      })
    },
    // 查询用户列表
    getUserInfo () {
      let param = {
        pageNum: this.ps.pageNo,
        pageSize: this.ps.pageSize
      }
      this.$axios('post', '/match/getHotExpertList', param).then((res) => {
        if (res.code === 200) {
          this.userData = res.data.dataList
          this.currents2.currentTotal = res.data.countSize
        }
      })
    },
    getInfo () {
      let time = ''
      if (this.matchTime) {
        time = this.fromDate(this.matchTime)
      }
      let param = {
        matchName: this.match,
        pageNum: this.ps.pageNo,
        pageSize: this.ps.pageSize,
        userName: this.user,
        startCreateTime: time,
        endCreateTime: time
      }
      this.$axios('post', '/match/getHotRankList', param).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.dataList
          this.currents.currentTotal = res.data.countSize
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
    handleCurrentChange2 (val) {
      this.ps2.pageNo = val
      this.getUserInfo()
    },
    // 新增红榜
    addSumbit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$delete(this.form, 'id')
          let param = this.form
          this.$axios('post', '/match/editHotRankInfo', param).then((res) => {
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
    // 修改红榜
    updateSumbit () {
      console.log(this.form)
      let param = this.form
      this.$axios('post', '/match/editHotRankInfo', param).then((res) => {
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

<style>
.ql-editor{
  min-height: 200px;
}
</style>
