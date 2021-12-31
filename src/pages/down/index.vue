<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">下载管理</div>
            <div class="fx align-items">
                <div>
                    <el-input
                        placeholder="输入版本号进行搜索"
                        size="small"
                        v-model="search"
                    >
                        <i
                            slot="prefix"
                            class="el-input__icon el-icon-search"
                        ></i>
                    </el-input>
                </div>
                <!--        <div class="ml-10">选择渠道：</div>-->
                <!--        <div class="" style="width: 100px;">-->
                <!--          <el-select v-model="channel"  size="small">-->
                <!--            <el-option value="" label="全部"></el-option>-->
                <!--            <el-option v-for="(item,index) in channelList"-->
                <!--                       :key="index" :value="item.channel" :label="item.channelName"></el-option>-->
                <!--          </el-select>-->
                <!--        </div>-->
                <div class="ml-10" @click="getInfo(1)">
                    <el-button
                        type="primary"
                        size="small"
                        class="el-icon-search"
                        >查询</el-button
                    >
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
                        data.version
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
            <el-table-column label="设备">
                <template slot-scope="scope">
                    <span v-if="scope.row.device === 1" class="c-green"
                        >Android</span
                    >
                    <span v-if="scope.row.device === 2" class="c-red">ios</span>
                    <span v-if="scope.row.device === 3" class="c-red"
                        >其他系统</span
                    >
                </template>
            </el-table-column>
            <el-table-column prop="channelName" label="推广组名称">
            </el-table-column>
            <el-table-column label="推广唯一码">
                <template slot-scope="scope">
                    <span v-if="scope.row.channel === null">全部渠道</span>
                    <span v-if="scope.row.channel">{{
                        scope.row.channel
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="descr"
                width="250px"
                align="center"
                label="描述"
            >
            </el-table-column>
            <el-table-column prop="version" label="版本"> </el-table-column>
            <el-table-column align="center" label="是否强制更新">
                <template slot-scope="scope">
                    <span v-if="scope.row.isForce === 1" class="c-green"
                        >是</span
                    >
                    <span v-if="scope.row.isForce === 0" class="c-red">否</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="shareAdress"
                align="center"
                width="250px"
                label="h5推广地址"
            >
            </el-table-column>
            <el-table-column align="center" width="250px" label="下载地址">
                <template slot-scope="scope" v-if="scope.row.adress !== ''">
                    <!--          <span v-if="scope.row.device !== 2">{{apkUrl+scope.row.adress}}</span>-->
                    <span>{{ scope.row.adress }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="点击下载">
                <template slot-scope="scope" class="cursor">
                    <span
                        class="down-btn el-icon-download"
                        @click="download(scope.row.adress, scope.row.device)"
                    ></span>
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
            title="下载管理管理"
            :visible.sync="dialogFormVisible"
            width="400px"
        >
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item
                    label="设备"
                    :label-width="formLabelWidth"
                    prop="device"
                >
                    <el-radio
                        @change="changeDevice(1)"
                        v-model="form.device"
                        :label="1"
                        >Android</el-radio
                    >
                    <el-radio
                        @change="changeDevice(2)"
                        v-model="form.device"
                        :label="2"
                        >ios</el-radio
                    >
                    <el-radio
                        @change="changeDevice(3)"
                        v-model="form.device"
                        :label="3"
                        >其他系统</el-radio
                    >
                </el-form-item>
                <el-form-item
                    label="版本"
                    :label-width="formLabelWidth"
                    prop="version"
                >
                    <el-input
                        v-model="form.version"
                        autocomplete="off"
                        style="width: 238px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="是否强制更新"
                    :label-width="formLabelWidth"
                    prop="isForce"
                >
                    <el-radio v-model="form.isForce" :label="0">否</el-radio>
                    <el-radio v-model="form.isForce" :label="1">是</el-radio>
                </el-form-item>
                <!--        <el-form-item label="推广组名称" :label-width="formLabelWidth" prop="channelName" >-->
                <!--          <el-input  v-model="form.channelName" autocomplete="off" style="width: 238px;"></el-input>-->
                <!--        </el-form-item>-->
                <!--        <el-form-item label="推广唯一码" :label-width="formLabelWidth" prop="channel" >-->
                <!--          <el-input  v-model="form.channel" autocomplete="off" style="width: 238px;" :disabled="isChannel"></el-input>-->
                <!--        </el-form-item>-->
                <el-form-item
                    label="描述"
                    :label-width="formLabelWidth"
                    prop="descr"
                >
                    <el-input
                        v-model="form.descr"
                        autocomplete="off"
                        style="width: 238px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
                <!--        <el-form-item label="h5推广地址" :label-width="formLabelWidth" prop="shareAdress" v-if="form.device === 2 && !isDelete">-->
                <!--          <el-input   v-model="form.shareAdress" autocomplete="off" style="width: 238px;"></el-input>-->
                <!--        </el-form-item>-->
                <!--        <el-form-item label="渠道" :label-width="formLabelWidth" prop="channelMap">-->
                <!--          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
                <!--          <el-checkbox-group v-model="checkId">-->
                <!--            <el-checkbox  v-for="(item,index) in channelDate"-->
                <!--                          :key="index"-->
                <!--                          :label="item" @change="handleCheckedCitiesChange">-->
                <!--              <span v-if="item === '0'">官方</span>-->
                <!--              <span v-else>渠道{{item}}</span>-->
                <!--            </el-checkbox>-->
                <!--          </el-checkbox-group>-->
                <!--          <div style="color: red;" v-if="erro">*请选择渠道</div>-->
                <!--        </el-form-item>-->
                <el-form-item
                    label="请选择"
                    :label-width="formLabelWidth"
                    v-if="form.device !== 2 && isAdd"
                >
                    <el-radio v-model="isFile" :label="1">上传app包</el-radio>
                    <el-radio v-model="isFile" :label="2"
                        >输入app包地址</el-radio
                    >
                </el-form-item>
                <el-form-item
                    label="上传app包"
                    :label-width="formLabelWidth"
                    v-if="form.device !== 2 && isFile === 1 && isAdd"
                >
                    <!--          http://hszhibo.live/-->
                    <el-upload
                        class="upload-demo"
                        :action="'/sequoiaBack/file/fileUploadApk'"
                        :headers="headers"
                        :on-remove="handleRemove"
                        :on-change="handleChange"
                        :file-list="fileList"
                    >
                        <el-button size="small" type="primary"
                            >点击上传</el-button
                        >
                        <span class="fs-12 c-red" v-if="erro">请上传app包</span>
                    </el-upload>
                </el-form-item>
                <el-form-item
                    label="下载地址"
                    :label-width="formLabelWidth"
                    prop="adress"
                    v-if="
                        ((form.device === 2 || isFile === 2) && isAdd) ||
                        (!isAdd && !isDelete)
                    "
                >
                    <el-input
                        type="textarea"
                        :rows="4"
                        v-model="form.adress"
                        :disabled="isChannel"
                        autocomplete="off"
                        style="width: 238px; margin-right: 10px"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button type="primary" v-if="isAdd" @click="addSumbit"
                    >确 定</el-button
                >
                <el-button
                    type="primary"
                    v-if="!isAdd && !isDelete"
                    @click="updateSumbit"
                    >确 定</el-button
                >
                <!--        <el-button type="primary" v-if="isDelete" @click="deleteSumbit">确 定</el-button>-->
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { Cookie } from '../../api/util';
export default {
    name: 'index',
    data() {
        return {
            checkId: [],
            fillUrl: '',
            channelDate: [],
            channelList: [],
            checkAll: false,
            isDelete: false,
            erro: false,
            isFile: 0,
            apkUrl: '',
            isChannel: false,
            isDisabled: false,
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
            channel: '',
            form: {
                adress: '',
                deleted: 0,
                // channelName: '',
                descr: '',
                device: 1,
                // channel: '0',
                isForce: 0,
                id: 0,
                // shareAdress: '',
                channelMap: {},
                version: '',
            },
            formLabelWidth: '120px',
            dialogFormVisible: false,
            isAdd: false,
            fileList: [],
            rules: {
                version: [
                    {
                        required: true,
                        message: '请输入版本号',
                        trigger: 'blur',
                    },
                ],
                adress: [
                    {
                        required: true,
                        message: '请输入下载地址',
                        trigger: 'blur',
                    },
                ],
            },
            headers: {
                token: Cookie.get('token'),
            },
        };
    },
    mounted() {
        this.apkUrl = sessionStorage.getItem('domain');
        this.fillUrl = sessionStorage.getItem('fillDomain');
        this.getInfo();
        // this.$axios('post', '/system/config/getChannelList').then((res) => {
        //   if (res.code === 200) {
        //     this.channelList = res.data
        //     for (let i = 0; i < this.channelList.length; i++) {
        //       this.channelDate.push(this.channelList[i].channel)
        //     }
        //     console.log(this.channelDate)
        //   }
        // })
    },
    methods: {
        handleCheckAllChange(val) {
            this.checkId = val ? this.channelDate : [];
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.channelDate.length;
        },
        download(url, num) {
            if (num === 2) {
                window.open(url);
            } else {
                window.open(this.apkUrl + url);
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-1);
        },
        clear() {
            this.checkId = [];
            this.checkAll = false;
            let param = {
                adress: '',
                deleted: 0,
                descr: '',
                device: 1,
                // channel: '0',
                channelMap: {},
                isForce: 0,
                // channelName: '',
                id: 0,
                // shareAdress: '',
                version: '',
            };
            this.form = Object.assign(this.form, param);
            this.dialogFormVisible = false;
            this.date = '';
            this.fileList = [];
            this.isChannel = false;
            this.isDelete = false;
            this.isAdd = false;
            this.isDisabled = false;
        },
        changeDevice(num) {
            if (!this.isAdd) {
                if (num === 2) {
                    this.isDisabled = false;
                } else {
                    this.isDisabled = true;
                }
            }
        },
        add() {
            this.clear();
            this.isAdd = true;
            this.isDelete = false;
            this.dialogFormVisible = true;
        },
        deleteSumbit() {
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
        update(data, num) {
            this.checkId = [];
            this.checkId.push(data.channel);
            this.form = Object.assign(this.form, data);
            if (num === 1) {
                this.dialogFormVisible = true;
                this.isAdd = false;
                // this.isDelete = false
                this.isChannel = true;
                if (this.form.device === 2 && !this.isAdd) {
                    this.isDisabled = false;
                } else {
                    this.isDisabled = true;
                }
            } else {
                this.deleteSumbit();
            }
        },
        // 查询下载管理列表
        getInfo() {
            let param = {
                channel: this.channel,
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
            };
            this.$axios('post', '/download/list', param).then((res) => {
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
        addFile() {
            if (this.fileList.length !== 0) {
                let list = [];
                for (var i = 0; i < this.fileList.length; i++) {
                    list.push(this.fileList[i].response.data);
                }
                this.$set(this.form, `adress`, list.join(','));
            }
            // if (this.checkId.length !== 0) {
            //   let menus = {}
            //   for (let i = 0; i < this.checkId.length; i++) {
            //     for (let j = 0; j < this.channelList.length; j++) {
            //       if (this.checkId[i] === this.channelList[j].channel) {
            //         const source = JSON.parse(`{"${this.channelList[j].channel}":"${this.channelList[j].channelName}"}`)// 利用JSON.parse将对象
            //         Object.assign(menus, source)
            //       }
            //     }
            //   }
            //   this.$set(this.form, `channelMap`, menus)
            // } else {
            //   this.erro = true
            // }
        },
        // 新增下载管理
        addSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.addFile();
                    if (this.form.adress === '') {
                        this.erro = true;
                    } else {
                        this.erro = false;
                        this.$delete(this.form, 'id');
                        let param = this.form;
                        this.$axios('post', '/download/save', param).then(
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
                    }
                } else {
                    return false;
                }
            });
        },
        updateInfo() {
            this.addFile();
            let param = this.form;
            this.$axios('post', '/download/updateDownLoad', param).then(
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
        // 修改下载管理
        updateSumbit() {
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

<style scoped>
.down-btn {
    border: 1px solid #005cdb;
    color: #005cdb;
    border-radius: 4px;
    padding: 5px;
}
</style>
