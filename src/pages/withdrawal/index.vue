<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">提现记录</div>
            <div class="fx align-items">
                <div>
                    <el-input
                        placeholder="输入提款账号名"
                        size="small"
                        v-model="cardName"
                        class="w-150"
                    >
                    </el-input>
                </div>
                <div class="ml-10">
                    <el-input
                        placeholder="输入用户名"
                        size="small"
                        v-model="userName"
                        class="w-150"
                    >
                    </el-input>
                </div>
                <div class="ml-10">
                    <el-input
                        placeholder="输入提款金额"
                        size="small"
                        v-model="withdrawAmt"
                        class="w-150"
                    >
                    </el-input>
                </div>
                <div class="ml-10">
                    <el-select
                        v-model="status"
                        placeholder="请选择提款状态"
                        size="small"
                        class="w-150"
                    >
                        <el-option label="提现失败" :value="-1"></el-option>
                        <el-option label="提现中" :value="0"></el-option>
                        <el-option label="出款处理中" :value="1"></el-option>
                        <el-option label="出款成功" :value="2"></el-option>
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
                width="100"
            >
            </el-table-column>
            <el-table-column prop="userId" label="用户Id"> </el-table-column>
            <el-table-column width="100" prop="userName" label="用户名">
            </el-table-column>
            <el-table-column width="100px" label="提款前余额">
                <template slot-scope="scope">
                    <span>{{ scope.row.beforeAmt }}元</span>
                </template>
            </el-table-column>
            <el-table-column prop="withdrawAmt" label="提款金额">
                <template slot-scope="scope">
                    <span>{{ scope.row.beforeAmt }}元</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" label="提款手续费">
                <template slot-scope="scope">
                    <span>{{ scope.row.fee }}元</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" label="实际到账金额">
                <template slot-scope="scope">
                    <span>{{ scope.row.realAmount }}元</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" label="提款后余额">
                <template slot-scope="scope">
                    <span>{{ scope.row.afterAmt }}元</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="cardNo"
                width="150"
                align="center"
                label="提款卡号"
            >
            </el-table-column>
            <el-table-column prop="cardName" width="100px" label="提款账户名">
            </el-table-column>
            <el-table-column prop="bankName" label="提款银行">
            </el-table-column>
            <el-table-column label="提款状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === -1">提现失败</span>
                    <span v-if="scope.row.status === 0">提现中</span>
                    <span v-if="scope.row.status === 1">出款处理中</span>
                    <span v-if="scope.row.status === 2">出款成功</span>
                </template>
            </el-table-column>
            <el-table-column width="150" align="center" label="操作时间">
                <template slot-scope="scope">
                    <span>{{ fromDate(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" width="200">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.status === 0"
                        type="primary"
                        class="cursor"
                        size="mini"
                        plain
                        @click="comission(scope.row.id, 1)"
                        >通过</el-button
                    >
                    <el-button
                        v-if="scope.row.status === 0"
                        type="primary"
                        class="cursor"
                        size="mini"
                        plain
                        @click="comission(scope.row.id, -1)"
                        >拒绝</el-button
                    >
                    <el-button
                        v-if="scope.row.status === 1"
                        type="primary"
                        class="cursor"
                        size="mini"
                        plain
                        @click="comission(scope.row.id, 2)"
                        >确认成功</el-button
                    >
                    <el-button
                        v-if="scope.row.status === 1"
                        type="primary"
                        class="cursor"
                        size="mini"
                        plain
                        @click="comission(scope.row.id, -1)"
                        >转账失败</el-button
                    >
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
            cardName: '',
            userName: '',
            withdrawAmt: '',
            status: '',
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
                cardName: this.cardName,
                userName: this.userName,
                withdrawAmt: this.withdrawAmt,
                status: this.status,
            };
            this.$axios(
                'post',
                '/comission/withdrawList?pageNo=' +
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
            this.cardName = '';
            this.withdrawAmt = '';
            this.userName = '';
            this.status = '';
            this.getInfo();
        },
        comission(id, status) {
            this.$confirm('确定进行该操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$axios(
                        'post',
                        '/comission/update?id=' + id + '&status=' + status,
                    ).then((res) => {
                        if (res.code === '0') {
                            this.$message({
                                type: 'success',
                                message: '操作成功!',
                            });
                            this.getInfo();
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    });
                });
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
