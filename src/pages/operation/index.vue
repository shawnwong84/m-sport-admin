<template>
  <div>
    <div class="info-table">
      <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
        <div class="fs-18 fw-600">
          运营统计
        </div>
        <div class="fx">
          <div class="cx-box" :class="checkBox === 1?'xz':''" @click="checkBox = 1">查询总和</div>
          <div class="cx-box" :class="checkBox === 2?'xz':''" @click="checkBox = 2">按天数查询</div>
        </div>
      </div>
      <div class="fx align-items fx-end mb-15" v-if="checkBox === 1">
        <div class="ml-10">
          日期：
          <el-date-picker
            v-model="date"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="ml-10">可选择多个渠道：</div>
        <div>
          <el-select
            v-model="channel"
            multiple
            size="small"
            collapse-tags
            placeholder="请选择"
            @change="selectAll">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" style="margin-left: 10px;" size="small" icon="el-icon-plus" @click="getNowInfo(date[0],date[1],channel)">查询</el-button>
      </div>
      <div class="fx align-items fx-end mb-15" v-if="checkBox === 2">
        <div class="ml-10">
          日期：
          <el-date-picker
            v-model="date2"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="ml-10">渠道：</div>
        <div>
          <el-select
            v-model="channel2"
            size="small"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            v-if="item.value !== '-1'">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" style="margin-left: 10px;" size="small" icon="el-icon-plus" @click="getDayInfo(date2[0],date2[1],channel2)">查询</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%;"
        header-cell-class-name="bg-f5">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="已播放1次">
                <span>{{ props.row.playOne }}</span>
              </el-form-item>
              <el-form-item label="已播放2次">
                <span>{{ props.row.playTwo }}</span>
              </el-form-item>
              <el-form-item label="已播放3次">
                <span>{{ props.row.playThree }}</span>
              </el-form-item>
              <el-form-item label="播放率">
                <span>{{ props.row.playRentation }}</span>
              </el-form-item>
              <el-form-item label="月卡">
                <span>{{ props.row.monthCards }}</span>
              </el-form-item>
              <el-form-item label="季卡">
                <span>{{ props.row.quartCards }}</span>
              </el-form-item>
              <el-form-item label="半年卡">
                <span>{{ props.row.halfYearCards }}</span>
              </el-form-item>
              <el-form-item label="年卡">
                <span>{{ props.row.yearCards }}</span>
              </el-form-item>
              <el-form-item label="终身卡">
                <span>{{ props.row.allYearCards }}</span>
              </el-form-item>
              <el-form-item label="ARPPU">
                <span>{{ props.row.arrention }}</span>
              </el-form-item>
              <el-form-item label="充值金币总数">
                <span>{{ props.row.spendGoldCoins }}个</span>
              </el-form-item>
              <el-form-item label="充值金币人数">
                <span>{{ props.row.peopleConsumeGold }}人</span>
              </el-form-item>
              <el-form-item label="影片金币价格">
                <span>{{ props.row.movieGoldCoinPrice }}元</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="channelName"
          label="官方推广组">
        </el-table-column>
        <el-table-column
          prop="userNum"
          label="注册用户">
        </el-table-column>
        <el-table-column
          prop="androidNum"
          label="android用户">
        </el-table-column>
        <el-table-column
          prop="iosNum"
          label="ios用户">
        </el-table-column>
        <el-table-column
          prop="passionNum"
          label="推广数">
        </el-table-column>
        <el-table-column
          prop="vipUserNum"
          label="充值总数">
        </el-table-column>
        <el-table-column
          prop="payRention"
          label="付费率">
        </el-table-column>
        <el-table-column
          prop="todayNum"
          label="次留">
        </el-table-column>
        <el-table-column
          prop="threeNum"
          label="三留">
        </el-table-column>
        <el-table-column
          prop="sevenNum"
          label="七留">
        </el-table-column>
        <el-table-column
          prop="fourteenthNum"
          label="十四留">
        </el-table-column>
        <el-table-column
          prop="thirtyNum"
          label="三十留">
        </el-table-column>
        <el-table-column
          prop="recharge"
          label="充值金额">
        </el-table-column>
      </el-table>
<!--      <el-pagination-->
<!--        class="pagination"-->
<!--        background-->
<!--        :hide-on-single-page="true"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="currents.currentPage"-->
<!--        :page-sizes="[15, 20, 30]"-->
<!--        :page-size="15"-->
<!--        layout="total, prev, pager, next, jumper"-->
<!--        :total="currents.currentTotal">-->
<!--      </el-pagination>-->
    </div>
  </div>
</template>
<script>

export default {
  name: 'index',
  data () {
    return {
      checkBox: 1,
      date: '',
      date2: '',
      channel: '',
      channel2: '',
      options: [],
      oldOptions: [],
      tableData: [],
      channelDate: [],
      loading: false
    }
  },
  mounted () {
    this.getNowInfo()
    this.channelDate = JSON.parse(sessionStorage.getItem('channelList'))
    let c = [{value: '-1',
      label: '全部'}]
    for (let item in this.channelDate) {
      c.push({
        value: item,
        label: this.channelDate[item]
      })
    }
    this.options = c
  },
  methods: {
    selectAll (val) {
      let allValues = []
      // 保留所有值
      for (let item of this.options) {
        allValues.push(item.value)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.length === 1 ? [] : this.oldOptions[1]

      // 若是全部选择
      if (val.includes('-1')) this.channel = allValues

      // 取消全部选中  上次有 当前没有 表示取消全选
      if ((oldVal && oldVal.includes('-1')) && !val.includes('-1')) this.channel = []

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if ((oldVal && oldVal.includes('-1')) && val.includes('-1')) {
        const index = val.indexOf('-1')
        val.splice(index, 1) // 排除全选选项
        this.channel = val
      }

      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if ((oldVal && !oldVal.includes('-1')) && !val.includes('-1')) {
        if (val.length === allValues.length - 1) this.channel = ['-1'].concat(val)
      }

      // 储存当前最后的结果 作为下次的老数据
      this.oldOptions[1] = this.channel
    },
    getNowInfo (start, end, val) {
      this.loading = true
      if (end && start) {
        end = end + ' 23:59:59'
        start = start + ' 00:00:00'
      } else {
        end = new Date().toLocaleDateString().replace(/\//g, '-') + ' 23:59:59'
        start = new Date().toLocaleDateString().replace(/\//g, '-') + ' 00:00:00'
      }
      let channel = ''
      if (val && val.length !== 0) {
        if (val.includes('-1')) {
          val.shift()
          channel = val.join(',')
        } else {
          channel = val.join(',')
        }
      } else {
        channel = sessionStorage.getItem('channel')
      }
      this.$axios('post', '/user/nowInfo?channel=' + channel + '&end=' + end + '&start=' + start).then((res) => {
        if (res.code === '0') {
          this.tableData = res.data
          this.loading = false
          // this.currents.currentTotal = res.data.total
        }
      })
    },
    dateDiff (first, second) {
      const firstDate = new Date(first)
      const secondDate = new Date(second)
      const diff = Math.abs(firstDate.getTime() - secondDate.getTime())
      const result = parseInt(diff / (1000 * 60 * 60 * 24))
      return result ? result + 1 : 0
    },
    getDayInfo (start, end, val) {
      let conversationDateDiff = this.dateDiff(start, end)
      if (conversationDateDiff > 10) {
        this.$message({
          type: 'warning',
          message: '日期查询区间不能大于10天!'
        })
      } else if (val === '') {
        this.$message({
          type: 'warning',
          message: '渠道不能为空!'
        })
      } else {
        this.loading = true
        if (end && start) {
          end = end + ' 23:59:59'
          start = start + ' 00:00:00'
        } else {
          end = ''
          start = ''
        }
        this.$axios('post', '/user/dayInfo?channel=' + val + '&end=' + end + '&start=' + start).then((res) => {
          if (res.code === '0') {
            this.tableData = res.data
            this.loading = false
          }
        })
      }
    }
    // handleCurrentChange (val) {
    //   this.ps.pageNo = val
    //   this.getNowInfo()
    // }
  }
}
</script>

<style scoped>
.c-red{
  color: red;
}
.table{
  text-align: center;
  width: 100%;
}
.table th {
  background: #F5F7FA;
  color: rgb(144, 147, 154);
}
.table tr {
  line-height: 40px;
}
.table td{
  color: #6F6F6F;
}
.cx-box {
  border: 1px solid #2897ff;
  width: 100px;
  line-height: 30px;
  text-align: center;
  color: #2897ff;
}
.xz{
  background: #2897ff;
  color: white;
}
</style>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 25%;
}
</style>
