<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">充值流水</div>
            <div class="fx align-items">
                <div>
                    <el-input
                        placeholder="输入手机号码查询"
                        size="small"
                        v-model="phone"
                        class="w-150"
                    >
                        <i
                            slot="prefix"
                            class="el-input__icon el-icon-mobile-phone"
                        ></i>
                    </el-input>
                </div>
                <div class="ml-10">
                    <el-date-picker
                        size="small"
                        style="width: 150px"
                        v-model="rechargeTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期"
                    >
                    </el-date-picker>
                </div>
                <div class="ml-10">
                    <el-input
                        placeholder="输入查询金额"
                        size="small"
                        v-model="rechargeAmount"
                        class="w-150"
                    >
                        <i
                            slot="prefix"
                            class="el-input__icon el-icon-money"
                        ></i>
                    </el-input>
                </div>
                <div class="ml-10">
                    <el-select
                        v-model="rechargeStatus"
                        placeholder="请选择"
                        size="small"
                        class="w-150"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="ml-10">
                    <el-button
                        type="primary"
                        size="small"
                        icon="el-icon-plus"
                        @click="getInfo"
                        >查询</el-button
                    >
                </div>
                <div class="ml-10">
                    <el-button
                        type="primary"
                        size="small"
                        plain
                        icon="el-icon-refresh-right"
                        @click="refresh"
                        >刷新</el-button
                    >
                </div>
            </div>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%"
            header-cell-class-name="bg-f5"
        >
            <el-table-column
                fixed
                type="index"
                label="序号"
                align="center"
                width="200"
            >
            </el-table-column>
            <el-table-column prop="userName" label="用户名"> </el-table-column>
            <el-table-column prop="phone" label="手机号"> </el-table-column>
            <el-table-column prop="rechargeAmount" label="充值金额">
            </el-table-column>
            <el-table-column prop="vipName" label="vip级别"> </el-table-column>
            <el-table-column prop="payName" label="充值渠道"> </el-table-column>
            <el-table-column label="渠道类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.payChannelType === 1"
                        >三方或者四方支付</span
                    >
                    <span v-if="scope.row.payChannelType === 2"
                        >固码个人收款</span
                    >
                </template>
            </el-table-column>
            <el-table-column label="充值状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.rechargeStatus === '-1'"
                        >1支付失败</span
                    >
                    <span v-if="scope.row.rechargeStatus === '0'">支付中</span>
                    <span v-if="scope.row.rechargeStatus === '1'"
                        >支付成功</span
                    >
                    <span v-if="scope.row.rechargeStatus === '2'"
                        >未知状态</span
                    >
                </template>
            </el-table-column>
            <el-table-column label="充值时间">
                <template slot-scope="scope">
                    <span>{{ fromDate(scope.row.rechargeTime) }}</span>
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
            :total="currents.currentTotal"
        >
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            currents: {
                currentPage: 1,
                currentTotal: 0,
            },
            ps: {
                pageNo: 1,
                pageSize: 15,
            },
            phone: '',
            rechargeAmount: '',
            rechargeStatus: '',
            rechargeTime: '',
            tableData: [],
            options: [
                {
                    value: '',
                    label: '全部',
                },
                {
                    value: '-1',
                    label: '支付失败',
                },
                {
                    value: '0',
                    label: '支付中',
                },
                {
                    value: '1',
                    label: '支付成功',
                },
                {
                    value: '2',
                    label: '未知状态',
                },
            ],
        };
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        getInfo() {
            let param = {
                phone: this.phone,
                rechargeAmount: this.rechargeAmount,
                rechargeStatus: this.rechargeStatus,
                rechargeTime: this.rechargeTime,
                channel: sessionStorage.getItem('channel'),
            };
            this.$axios(
                'post',
                '/recharge/list?pageNo=' +
                    this.ps.pageNo +
                    '&pageSize=' +
                    this.ps.pageSize,
                param,
            ).then((res) => {
                if (res.code === '0') {
                    this.tableData = res.data.list;
                    this.currents.currentTotal = res.data.total;
                }
            });
        },
        handleCurrentChange(val) {
            this.ps.pageNo = val;
            this.getInfo();
        },
        refresh() {
            this.phone = '';
            this.rechargeAmount = '';
            this.rechargeStatus = '';
            this.rechargeTime = '';
            this.getInfo();
        },
        fromDate(date) {
            var d = new Date(date);
            var datetime =
                d.getFullYear() +
                '-' +
                (d.getMonth() + 1) +
                '-' +
                d.getDate() +
                ' ' +
                d.getHours() +
                ':' +
                d.getMinutes() +
                ':' +
                d.getSeconds();
            return datetime;
        },
    },
};
</script>

<style scoped>
.w-100 {
    width: 100px;
}
.w-150 {
    width: 150px;
}
.w-185 {
    width: 185px;
}
</style>
