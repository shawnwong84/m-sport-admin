<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">主播开播记录</div>
        <div class="fx align-items">
            <div>开播时间：</div>
            <div>
              <el-date-picker
                      v-model="time"
                      type="datetimerange"
                      size="small"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
              </el-date-picker>
            </div>
          <div class="ml-10">主播名称：</div>
          <div><el-input
                  placeholder="主播名称"
                  size="small"
                  v-model="anchorName">
          </el-input></div>
      </div>
    </div>
    <div class="mr-10 fx align-items fx-end">
      <div>房间名：</div>
      <div ><el-input
              placeholder="房间名"
              size="small"
              v-model="roomName">
      </el-input></div>
      <div class="ml-10">直播类型：</div>
      <div  style="width: 100px;">
        <el-select v-model="sourceType"  size="small">
          <el-option value="0" label="直播"></el-option>
          <el-option value="1" label="卫星"></el-option>
        </el-select>
      </div>
      <div class="ml-10">赛事类型：</div>
      <div class="mr-10" style="width: 100px;">
        <el-select v-model="sportsId"  size="small">
          <el-option value="0" label="足球"></el-option>
          <el-option value="1" label="篮球"></el-option>
          <el-option value="2" label="其他"></el-option>
        </el-select>
      </div>
      <el-button  type="primary"  size="small"  @click="getInfo(1)">查询</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 10px"
      header-cell-class-name="bg-f5">
      <el-table-column
        fixed
        type="index"
        label="序号"
        align="center"
        width="50">
      </el-table-column>
<!--      <el-table-column-->
<!--              prop="hostUserId"-->
<!--              label="主播ID"-->
<!--              align="center">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="userName"
        label="主播昵称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="roomName"
        label="房间名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="matchTime"
        label="比赛时间"
        align="center">
      </el-table-column>
      <!--<el-table-column
              prop="receivedGold"
              label="收获金币"
              align="center">
      </el-table-column>-->
      <el-table-column
        label="开播时间"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.startTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="下播时间"
              align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
              prop="liveTime"
              label="直播时长"
              align="center">
      </el-table-column>
      <el-table-column
              prop="userAccessNum"
              label="直播间用户量"
              align="center">
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
      anchorName: '',
      time: '',
      roomName: '',
      sourceType: '',
      sportsId: '',
      tableData: []
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      let end = ''
      let start = ''
      if (this.time) {
        end = this.time[1]
        start = this.time[0]
      } else {
        end = ''
        start = ''
      }
      let param = {
        anchorName: this.anchorName,
        endTime: end,
        startTime: start,
        pageNum: this.ps.pageNo,
        pageSize: this.ps.pageSize,
        roomName: this.roomName,
        sourceType: this.sourceType,
        sportsId: this.sportsId
      }
      this.$axios('post', '/V1/record/getRoomHostRecordList', param).then((res) => {
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
    refresh () {
      this.buyStatus = ''
      this.buyTime = ''
      this.getInfo()
    },
    fromDate (date) {
      var d = new Date(date)
      var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      return datetime
    }
  }
}
</script>

<style scoped>
.w-100{
  width: 100px;
}
.w-150{
  width: 150px;
}
.w-185{
  width: 185px;
}
</style>
