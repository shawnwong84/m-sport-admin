<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">栏目管理</div>
            <div class="fx align-items">
                <div>
                    <el-input
                        placeholder="输入栏目名称进行搜索"
                        size="small"
                        v-model="search"
                    >
                        <i
                            slot="prefix"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                </div>
                <div class="ml-10" @click="dialogFormVisible = true">
                    <el-button
                        type="primary"
                        size="small"
                        icon="el-icon-plus"
                        @click="add"
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
                prop="sort"
                label="序号"
                align="center"
                width="200"
            >
            </el-table-column>
            <el-table-column prop="name" label="栏目名称"> </el-table-column>
            <el-table-column prop="menuDes" label="栏目描述"> </el-table-column>
            <el-table-column prop="jumpPath" label="关联path">
            </el-table-column>
            <el-table-column fixed="right" width="150">
                <template slot-scope="scope">
                    <div
                        class="update cursor w-32 bg-f2"
                        @click="update(scope.row)"
                    >
                        <img src="../../assets/image/update-q.png" />
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
            title="角色管理"
            :visible.sync="dialogFormVisible"
            width="388px"
        >
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item
                    label="栏目序号"
                    :label-width="formLabelWidth"
                    prop="sort"
                >
                    <el-input
                        type="age"
                        v-model.number="form.sort"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="栏目名称"
                    :label-width="formLabelWidth"
                    prop="name"
                >
                    <el-input
                        v-model="form.name"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="栏目描述"
                    :label-width="formLabelWidth"
                    prop="menuDes"
                >
                    <el-input
                        v-model="form.menuDes"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="关联路径"
                    :label-width="formLabelWidth"
                    prop="jumpPath"
                >
                    <el-input
                        v-model="form.jumpPath"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="菜单类型"
                    :label-width="formLabelWidth"
                    prop="type"
                >
                    <el-radio v-model="form.type" :label="1">菜单</el-radio>
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
        var checSort = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('栏目序号不能为空'));
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    if (value < 0) {
                        callback(new Error('序号必须大于0'));
                    } else {
                        callback();
                    }
                }
            }, 1000);
        };
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
            showUpdate: false,
            tableData: [],
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                deleted: 0,
                id: 0,
                menuDes: '',
                name: '',
                jumpPath: '',
                sort: 0,
                type: 1,
            },
            rules: {
                sort: [{ validator: checSort, trigger: 'blur' }],
                name: [
                    {
                        required: true,
                        message: '请输入栏目名称',
                        trigger: 'blur',
                    },
                ],
                menuDes: [
                    {
                        required: true,
                        message: '请输入栏目描述',
                        trigger: 'blur',
                    },
                ],
                jumpPath: [
                    {
                        required: true,
                        message: '请输入栏目路径',
                        trigger: 'blur',
                    },
                ],
                type: [
                    {
                        required: true,
                        message: '请输入栏目类型',
                        trigger: 'change',
                    },
                ],
            },
            formLabelWidth: '120px',
            isAdd: false,
        };
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        clear() {
            let param = {
                deleted: 0,
                id: 0,
                menuDes: '',
                name: '',
                jumpPath: '',
                sort: 0,
                type: 1,
            };
            this.form = Object.assign(this.form, param);
            this.dialogFormVisible = false;
        },
        add() {
            this.isAdd = true;
            this.dialogFormVisible = true;
        },
        update(data) {
            this.form = Object.assign(this.form, data);
            this.dialogFormVisible = true;
            this.isAdd = false;
        },
        // 查询栏目列表
        getInfo() {
            this.$axios('post', '/sys/menu/list').then((res) => {
                if (res.code === 200) {
                    this.tableData = res.data;
                    this.currents.currentTotal = res.data.total;
                }
            });
        },
        handleCurrentChange(val) {
            this.ps.pageNo = val;
            this.getInfo();
        },
        // 新增栏目
        addSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$delete(this.form, 'id');
                    let param = this.form;
                    this.$axios('post', '/sys/menu', param).then((res) => {
                        if (res.code === 200) {
                            this.dialogFormVisible = false;
                            this.$refs['form'].resetFields();
                            this.getInfo();
                            this.clear();
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 修改栏目
        updateSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let param = this.form;
                    this.$axios('post', '/sys/menu/updateMenu', param).then(
                        (res) => {
                            if (res.code === 200) {
                                this.dialogFormVisible = false;
                                this.$refs['form'].resetFields();
                                this.getInfo();
                                this.clear();
                            }
                        },
                    );
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
