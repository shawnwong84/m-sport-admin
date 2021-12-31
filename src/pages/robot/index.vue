<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">机器人管理</div>
            <div class="fx align-items">
                <!--        <div><el-input-->
                <!--          placeholder="输入机器人标题进行搜索"-->
                <!--          size="small"-->
                <!--          v-model="search">-->
                <!--          <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
                <!--        </el-input></div>-->
                <div class="ml-10" @click="add">
                    <el-button type="primary" size="small" icon="el-icon-plus"
                        >增加</el-button
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
            <el-table-column prop="nickName" label="发送人"> </el-table-column>
            <el-table-column prop="fakeMsg" width="350" label="文案">
            </el-table-column>
            <el-table-column width="150" label="更新时间">
                <template slot-scope="scope">
                    <span>{{ fromDate(scope.row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right">
                <template slot-scope="scope">
                    <div class="fx cursor">
                        <div
                            class="update w-32 bg-f2"
                            @click="update(scope.row)"
                        >
                            <img src="../../assets/image/update-q.png" />
                        </div>
                        <div class="ml-10" @click="deleteSumbit(scope.row)">
                            <img src="../../assets/image/delete-q.png" />
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
            :total="currents.currentTotal"
        >
        </el-pagination>
        <el-dialog
            title="机器人管理"
            :visible.sync="dialogFormVisible"
            width="490px"
        >
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item
                    label="机器人文案"
                    :label-width="formLabelWidth"
                    prop="fakeMsg"
                >
                    <el-input
                        type="textarea"
                        :rows="10"
                        placeholder="请输入内容"
                        v-model="form.fakeMsg"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button type="primary" @click="addSumbit" v-if="isAdd"
                    >确 定</el-button
                >
                <el-button type="primary" @click="updateSumbit" v-else
                    >确 定</el-button
                >
            </div>
        </el-dialog>
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
            search: '',
            tableData: [],
            form: {
                deleted: 0,
                fakeMsg: '',
                id: 0,
            },
            formLabelWidth: '160px',
            dialogFormVisible: false,
            isAdd: false,
            rules: {
                fakeMsg: [
                    {
                        required: true,
                        message: '请输入机器人文案',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        clear() {
            let param = {
                deleted: 0,
                fakeMsg: '',
                id: 0,
            };
            this.form = Object.assign(this.form, param);
            this.dialogFormVisible = false;
        },
        add() {
            this.clear();
            this.isAdd = true;
            this.dialogFormVisible = true;
        },
        update(data) {
            this.form = Object.assign(this.form, data);
            this.dialogFormVisible = true;
            this.isAdd = false;
        },
        deleteSumbit(data) {
            this.form = Object.assign({}, data);
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$set(this.form, `deleted`, 1);
                    this.updateInfo();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    });
                });
        },
        // 查询机器人列表
        getInfo() {
            let param = {
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
            };
            this.$axios('post', '/backRoom/getRobotMsgList', param).then(
                (res) => {
                    if (res.code === 200) {
                        this.tableData = res.data.dataList;
                        this.currents.currentTotal = res.data.countSize;
                    }
                },
            );
        },
        handleCurrentChange(val) {
            this.ps.pageNo = val;
            this.getInfo();
        },
        // 新增机器人
        addSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$delete(this.form, 'id');
                    let param = this.form;
                    this.$axios('post', '/backRoom/editRobotMsg', param).then(
                        (res) => {
                            if (res.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '新增成功!',
                                });
                                this.getInfo();
                                this.clear();
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: res.msg,
                                });
                            }
                        },
                    );
                } else {
                    return false;
                }
            });
        },
        updateInfo() {
            let param = this.form;
            this.$axios('post', '/backRoom/editRobotMsg', param).then((res) => {
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                    });
                    this.getInfo();
                    this.clear();
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.msg,
                    });
                }
            });
        },
        // 修改机器人
        updateSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.updateInfo();
                } else {
                    return false;
                }
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

<style scoped></style>
