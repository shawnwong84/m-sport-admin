<template>
  <div class="info-table">
    <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
      <div class="fs-18 fw-600">购买金币记录</div>
      <div class="fx align-items">
        <div class="ml-10">
          <el-date-picker
            v-model="buyTime"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="ml-10">
          <el-select v-model="rechargeStatus" placeholder="请选择" size="small" class="w-150">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select></div>
        <div class="ml-10">
          <el-select v-model="payChannelId" placeholder="请选择" size="small" class="w-150">
            <el-option
              v-for="(item,index) in payChannelsList"
              :key="index"
              :label="item.payNameEn"
              :value="item.id">
            </el-option>
          </el-select></div>
        <div class="ml-10"><el-button type="primary"  size="small" icon="el-icon-plus" @click="getInfo(1)">查询</el-button></div>
        <div class="ml-10"><el-button type="primary" size="small" plain icon="el-icon-refresh-right" @click="refresh">刷新</el-button></div>
      </div>
    </div>
    <el-table
      :data="tableData"
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
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="rechargeAmount"
        label="购买金币">
      </el-table-column>
      <el-table-column
        label="购买状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.rechargeStatus === -1">1支付失败</span>
          <span v-if="scope.row.rechargeStatus === 0">支付中</span>
          <span v-if="scope.row.rechargeStatus === 1">支付成功</span>
          <span v-if="scope.row.rechargeStatus === 2">未知状态</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="payName"
        label="充值渠道">
      </el-table-column>
      <el-table-column
        label="所属渠道">
        <template slot-scope="scope">
          <span v-if="scope.row.channelId === null">全部渠道</span>
          <span v-if="scope.row.channelId === 0">官方</span>
          <span v-if="scope.row.channelId && scope.row.channelId !== 0">渠道{{scope.row.channelId}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        label="购买时间">
        <template slot-scope="scope">
          <span>{{fromDate(scope.row.rechargeTime)}}</span>
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
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        payChannelsList: [],
        currents: {
          currentPage: 1,
          currentTotal: 0
        },
        ps: {
          pageNo: 1,
          pageSize: 15
        },
        phone: '',
        payChannelId: '',
        rechargeStatus: '',
        buyTime: '',
        tableData: [],
        options: [
          {
            value: '',
            label: '全部'
          },
          {
            value: -1,
            label: '支付失败'
          }, {
            value: 0,
            label: '支付中'
          }, {
            value: 1,
            label: '支付成功'
          }, {
            value: 2,
            label: '未知状态'
          }]
      }
    },
    mounted () {
      this.getPayChannels()
      this.getInfo()
    },
    methods: {
      getInfo (num) {
        if (num) {
          this.ps.pageNo = 1
        }
        let end = ''
        let start = ''
        if (this.buyTime) {
          end = this.buyTime[1] + ' 23:59:59'
          start = this.buyTime[0] + ' 00:00:00'
        } else {
          end = ''
          start = ''
        }
        let param = {
          buyEndTime: end,
          buyStartTime: start,
          payChannelId: parseInt(this.payChannelId),
          rechargeStatus: parseInt(this.rechargeStatus),
          channelId: parseInt(sessionStorage.getItem('channel')),
          pageNo: this.ps.pageNo,
          pageSize: this.ps.pageSize
        }
        this.$axios('post', '/recharge/goldRechargeList', param).then((res) => {
          if (res.code === '0') {
            this.tableData = res.data.dataList
            this.currents.currentTotal = res.data.countSize
          }
        })
      },
      getPayChannels () {
        this.$axios('get', '/recharge/getPayChannels').then((res) => {
          if (res.code === '0') {
            this.payChannelsList = res.data
          }
        })
      },
      handleCurrentChange (val) {
        this.ps.pageNo = val
        this.getInfo()
      },
      refresh () {
        this.buyTime = ''
        this.payChannelId = ''
        this.rechargeStatus = ''
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
