<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">账号管理</div>
            <div class="fx align-items">
                <div>
                    <el-input
                        placeholder="输入用户名进行搜索"
                        size="small"
                        v-model="search"
                    >
                        <i
                            slot="prefix"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                </div>
                <div class="ml-10" @click="add">
                    <el-button type="primary" size="small" icon="el-icon-plus"
                        >增加</el-button
                    >
                </div>
            </div>
        </div>
        <el-table
            :data="
                tableData.filter(
                    (data) =>
                        !search ||
                        data.username
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                )
            "
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
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="roleName" label="角色"> </el-table-column>
            <el-table-column fixed="right" width="200">
                <template slot-scope="scope">
                    <div class="fx cursor">
                        <div
                            class="update w-32 bg-f2"
                            @click="update(scope.row, 1)"
                        >
                            <img src="../../assets/image/update-q.png" />
                        </div>
                        <div class="ml-10" @click="update(scope.row, 2)">
                            <img src="../../assets/image/delete-q.png" />
                        </div>
                        <div class="ml-10">
                            <el-button
                                type="primary"
                                class="cursor"
                                size="mini"
                                plain
                                @click="update(scope.row, 3)"
                                >修改密码</el-button
                            >
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
            :page-sizes="[10, 20, 30]"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="currents.currentTotal"
        >
        </el-pagination>
        <el-dialog
            title="账号管理"
            :visible.sync="dialogFormVisible"
            width="388px"
        >
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item
                    label="用户名称"
                    :label-width="formLabelWidth"
                    prop="username"
                    v-if="!isShowPwd"
                >
                    <el-input
                        v-model="form.username"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="用户密码"
                    :label-width="formLabelWidth"
                    prop="password"
                    v-if="isShowPwd || isAdd"
                >
                    <el-input
                        v-model="form.password"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="角色名称"
                    :label-width="formLabelWidth"
                    prop="roleId"
                    v-if="!isShowPwd"
                >
                    <el-select
                        v-model="form.roleId"
                        placeholder="请选择角色名称"
                        :disabled="disabled"
                    >
                        <el-option
                            v-for="(item, index) in roleList"
                            :key="index"
                            :value="item.id"
                            :label="item.roleName"
                        ></el-option>
                    </el-select>
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
        var checkRoleId = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('角色不能为空'));
            }
            setTimeout(() => {
                if (value < 0) {
                    callback(new Error('请选择角色'));
                } else {
                    callback();
                }
            }, 1000);
        };
        return {
            dqChannel: 0,
            erro: false,
            checkAll: false,
            checkId: [],
            channelDate: [],
            currents: {
                currentPage: 1,
                currentTotal: 0,
            },
            ps: {
                pageNo: 1,
                pageSize: 10,
            },
            search: '',
            tableData: [],
            dialogFormVisible: false,
            form: {
                deleted: 0,
                roleId: 0,
                id: 0,
                password: '',
                username: '',
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名称',
                        trigger: 'blur',
                    },
                ],
                roleId: [{ validator: checkRoleId, trigger: 'blur' }],
            },
            roleList: [],
            formLabelWidth: '120px',
            isAdd: false,
            disabled: false,
            isShowPwd: false,
        };
    },
    mounted() {
        this.getInfo();
        this.getRole();
        // this.dqChannel = sessionStorage.getItem('channel')
        // let data = []
        // data = JSON.parse(sessionStorage.getItem('channelList'))
        // for (let key in data) {
        //   this.channelDate.push(data[key])
        // }
    },
    methods: {
        handleCheckAllChange(val) {
            this.checkId = val ? this.channelDate : [];
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.channelDate.length;
        },
        clear() {
            this.erro = false;
            this.checkId = [];
            let param = {
                deleted: 0,
                roleId: 0,
                id: 0,
                password: '',
                username: '',
                channelMap: {},
            };
            this.form = Object.assign(param);
            this.dialogFormVisible = false;
            this.isShowPwd = false;
        },
        add() {
            this.clear();
            this.isAdd = true;
            this.dialogFormVisible = true;
        },
        update(data, num) {
            if (num === 1 || num === 3) {
                if (num === 3) {
                    this.isShowPwd = true;
                }
                this.form = Object.assign(this.form, data);
                this.checkId = [];
                for (let key in data.channelMap) {
                    this.checkId.push(data.channelMap[key]);
                }
                if (data.id === parseInt(sessionStorage.getItem('id'))) {
                    this.disabled = true;
                } else {
                    this.disabled = false;
                }
                this.dialogFormVisible = true;
                this.isAdd = false;
            }
            if (num === 2) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        this.$set(data, `deleted`, 1);
                        this.form = Object.assign(this.form, data);
                        this.updateInfo(1);
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        });
                    });
            }
        },
        // 查询角色列表
        getRole() {
            this.$axios('post', '/sys/role/list').then((res) => {
                if (res.code === 200) {
                    this.roleList = res.data;
                }
            });
        },
        // 查询账号列表
        getInfo() {
            let param = {
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
            };
            this.$axios('post', '/sys/list', param).then((res) => {
                if (res.code === 200) {
                    this.tableData = res.data.dataList;
                    this.currents.currentTotal = res.data.countSize;
                }
            });
        },
        handleCurrentChange(val) {
            this.ps.pageNo = val;
            this.getInfo();
        },
        // 新增账号
        addSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$delete(this.form, 'id');
                    let param = this.form;
                    this.$axios('post', '/sys/reg', param).then((res) => {
                        if (res.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '新增成功!',
                            });
                            this.clear();
                            this.getInfo();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.code,
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        updateInfo(num) {
            let param = {
                newPwd: this.form.password,
                roleId: this.form.roleId,
                userName: this.form.username,
                id: this.form.id,
                deleted: num,
            };
            this.$axios('post', '/sys/editUserInfo', param).then((res) => {
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                    });
                    this.clear();
                    this.getInfo();
                }
            });
        },
        // 修改账号
        updateSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    // this.$delete(this.form, 'channel')
                    this.updateInfo(0);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped></style>
