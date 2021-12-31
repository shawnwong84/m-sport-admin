<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">角色管理</div>
            <div class="fx align-items">
                <div>
                    <el-input
                        placeholder="输入角色名称进行搜索"
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
                        data.roleName
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
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
            <el-table-column label="角色栏目">
                <template slot-scope="scope">
                    <span v-for="i in scope.row.menus" class="mr-10">{{
                        i
                    }}</span>
                </template>
            </el-table-column>
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
                    label="角色名称"
                    :label-width="formLabelWidth"
                    prop="roleName"
                >
                    <el-input
                        v-model="form.roleName"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="角色描述"
                    :label-width="formLabelWidth"
                    prop="roleDesc"
                >
                    <el-input
                        v-model="form.roleDesc"
                        autocomplete="off"
                        style="width: 217px"
                    ></el-input>
                </el-form-item>
                <el-form-item label="可操作栏目" :label-width="formLabelWidth">
                    <el-checkbox
                        :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @change="handleCheckAllChange"
                        >全选</el-checkbox
                    >
                    <el-checkbox-group
                        v-model="checkedCities"
                        @change="handleCheckedCitiesChange"
                    >
                        <el-checkbox
                            v-for="(item, index) in menuList"
                            :label="item"
                            :key="index"
                            >{{ item }}</el-checkbox
                        >
                    </el-checkbox-group>
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
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                deleted: 0,
                id: 0,
                menus: [],
                roleDesc: '',
                roleName: '',
            },
            formLabelWidth: '120px',
            checkAll: false,
            checkedCities: [],
            menuList: [],
            menuListData: [],
            isIndeterminate: true,
            isAdd: false,
            rules: {
                roleName: [
                    {
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur',
                    },
                ],
                roleDesc: [
                    {
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    mounted() {
        this.getInfo();
        this.getMenu();
    },
    methods: {
        clear() {
            let param = {
                deleted: 0,
                id: 0,
                menus: [],
                roleDesc: '',
                roleName: '',
            };
            this.form = Object.assign(this.form, param);
            this.dialogFormVisible = false;
            this.checkedCities = [];
        },
        add() {
            this.clear();
            this.isAdd = true;
            this.dialogFormVisible = true;
        },
        update(data, num) {
            this.checkedCities = [];
            this.form = Object.assign(this.form, data);
            for (let key in data.menus) {
                this.checkedCities.push(data.menus[key]);
            }
            if (this.checkedCities.length === this.menuList.length) {
                this.isIndeterminate = true;
            } else {
                this.isIndeterminate = false;
            }
            if (num === 1) {
                this.dialogFormVisible = true;
                this.isAdd = false;
            } else {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        this.$set(data, `deleted`, 1);
                        this.form = Object.assign(this.form, data);
                        this.updateInfo();
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        });
                    });
            }
        },
        handleCheckAllChange(val) {
            this.checkedCities = val ? this.menuList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.menuList.length;
            this.isIndeterminate =
                checkedCount > 0 && checkedCount < this.menuList.length;
        },
        getMenu() {
            this.$axios('post', '/sys/menu/list').then((res) => {
                if (res.code === 200) {
                    this.menuListData = res.data;
                    for (var i = 0; i < res.data.length; i++) {
                        this.menuList.push(res.data[i].name);
                    }
                }
            });
        },
        // 查询角色列表
        getInfo() {
            this.$axios('post', '/sys/role/list').then((res) => {
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
        fromInfo() {
            if (this.checkedCities) {
                let menus = {};
                let mid = [];
                for (var i = 0; i < this.checkedCities.length; i++) {
                    for (var k = 0; k < this.menuListData.length; k++) {
                        if (
                            this.checkedCities[i] === this.menuListData[k].name
                        ) {
                            mid.push(this.menuListData[k].id);
                            const source = JSON.parse(
                                `{"${this.menuListData[k].id}":"${this.menuListData[k].name}"}`,
                            ); // 利用JSON.parse将对象
                            Object.assign(menus, source);
                        }
                    }
                }
                this.$set(this.form, `menuId`, mid.join(','));
                this.$set(this.form, `menus`, menus);
            }
        },
        // 新增角色
        addSumbit() {
            this.fromInfo();
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$delete(this.form, 'id');
                    let param = this.form;
                    this.$axios('post', '/sys/role', param).then((res) => {
                        if (res.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '新增成功!',
                            });
                            this.getInfo();
                            this.clear();
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        updateInfo() {
            let param = this.form;
            this.$axios('post', '/sys/role/updateRole', param).then((res) => {
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                    });
                    this.getInfo();
                    if (
                        this.form.id ===
                        parseInt(sessionStorage.getItem('roleId'))
                    ) {
                        location.reload();
                    }
                    this.clear();
                }
            });
        },
        // 修改角色
        updateSumbit() {
            this.fromInfo();
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.updateInfo();
                } else {
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped></style>
