<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">系统配置管理</div>
            <div class="fx align-items">
                <div class="ml-10">
                    <el-input
                        placeholder="输入参数名进行搜索"
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
                        data.name.toLowerCase().includes(search.toLowerCase()),
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
            <el-table-column prop="desc" label="描述"> </el-table-column>
            <el-table-column prop="name" label="参数名"> </el-table-column>
            <el-table-column prop="value" label="参数值"> </el-table-column>
            <el-table-column fixed="right">
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
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="系统配置管理"
            :visible.sync="dialogFormVisible"
            width="420px"
        >
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item
                    label="描述"
                    :label-width="formLabelWidth"
                    prop="desc"
                >
                    <el-input
                        v-model="form.desc"
                        autocomplete="off"
                        style="width: 238px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="参数名"
                    :label-width="formLabelWidth"
                    prop="name"
                    v-if="isAdd"
                >
                    <el-input
                        v-model="form.name"
                        autocomplete="off"
                        style="width: 238px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="参数值"
                    :label-width="formLabelWidth"
                    prop="value"
                >
                    <el-input
                        type="textarea"
                        :rows="10"
                        v-model="form.value"
                        autocomplete="off"
                        style="width: 238px"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button type="primary" @click="addSumbit" v-if="isAdd"
                    >确 定</el-button
                >
                <el-button type="primary" @click="updateSumbit" v-if="isUdate"
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
            userName: '',
            show: '',
            isUdate: false,
            isAdd: false,
            search: '',
            tableData: [],
            form: {
                desc: '',
                name: '',
                value: '',
                deleted: 0,
                id: 0,
            },
            formLabelWidth: '125px',
            dialogFormVisible: false,
            rules: {
                desc: [
                    { required: true, message: '请输入描述', trigger: 'blur' },
                ],
                name: [
                    {
                        required: true,
                        message: '请输入参数名',
                        trigger: 'blur',
                    },
                ],
                value: [
                    {
                        required: true,
                        message: '请输入参数值',
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
                desc: '',
                name: '',
                value: '',
                deleted: 0,
                id: 0,
            };
            this.form = Object.assign(this.form, param);
            this.dialogFormVisible = false;
        },
        deleteSumbit() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$set(this.form, `deleted`, 1);
                    this.updateSumbit();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    });
                });
        },
        add() {
            this.clear();
            this.isAdd = true;
            this.isDelete = false;
            this.isUdate = false;
            this.dialogFormVisible = true;
        },
        update(data, num) {
            this.form = Object.assign(this.form, data);
            if (num === 1) {
                this.isAdd = false;
                this.isUdate = true;
                this.dialogFormVisible = true;
            } else {
                this.isUdate = false;
                this.isAdd = false;
                this.deleteSumbit();
            }
        },
        // 查询系统配置列表
        getInfo() {
            this.$axios('post', '/systemConfig/backGetConfigList').then(
                (res) => {
                    if (res.code === 200) {
                        this.tableData = res.data;
                    }
                },
            );
        },
        addSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$delete(this.form, 'id');
                    let param = this.form;
                    this.$axios(
                        'post',
                        '/systemConfig/saveOrUpdateConfig',
                        param,
                    ).then((res) => {
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
                    });
                } else {
                    return false;
                }
            });
        },
        // 修改系统配置
        updateSumbit() {
            let param = this.form;
            this.$axios('post', '/systemConfig/saveOrUpdateConfig', param).then(
                (res) => {
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
                },
            );
        },
    },
};
</script>

<style scoped></style>
