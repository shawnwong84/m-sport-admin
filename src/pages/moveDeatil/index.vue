<template>
    <div class="info-table">
        <div class="fx align-items justify-between mt-15 mb-15 ml-10 mr-10">
            <div class="fs-18 fw-600">联赛详情</div>
            <div>
                <div class="fx align-items">
                    <div style="margin-left: -120px">是否显示在积分榜：</div>
                    <div class="" style="width: 100px">
                        <el-select v-model="ranking" size="small">
                            <el-option value="0" label="不显示"></el-option>
                            <el-option
                                value="1"
                                label="显示在联赛积分榜"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="ml-10">是否显示在文章搜索top上：</div>
                    <div class="" style="width: 100px">
                        <el-select v-model="searchTop" size="small">
                            <el-option value="0" label="不显示"></el-option>
                            <el-option
                                value="1"
                                label="显示在文章搜索top上"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="ml-10">是否显示在赛程页面：</div>
                    <div class="" style="width: 100px">
                        <el-select v-model="showMatch" size="small">
                            <el-option value="0" label="不显示"></el-option>
                            <el-option
                                value="1"
                                label="显示在赛程页面"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="fx align-items mt-15">
                    <div>短名称：</div>
                    <div>
                        <el-input
                            placeholder="输入短名称"
                            size="small"
                            v-model="competitionShortName"
                        >
                        </el-input>
                    </div>
                    <div class="ml-10">联赛名称：</div>
                    <div>
                        <el-input
                            placeholder="输入联赛名称"
                            size="small"
                            v-model="competitionName"
                        >
                        </el-input>
                    </div>
                    <div class="ml-10">类型：</div>
                    <div class="" style="width: 100px">
                        <el-select v-model="sportsId" size="small">
                            <el-option value="0" label="足球"></el-option>
                            <el-option value="1" label="篮球"></el-option>
                        </el-select>
                    </div>
                    <div class="ml-10">
                        <el-button
                            type="primary"
                            size="small"
                            icon="el-icon-plus"
                            @click="getInfo(1)"
                            >查询</el-button
                        >
                    </div>
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
                width="50"
            >
            </el-table-column>
            <el-table-column prop="competitionName" label="联赛名称">
            </el-table-column>
            <el-table-column label="英文名" prop="competitionNameEn">
            </el-table-column>
            <el-table-column label="短名称" prop="competitionShortName">
            </el-table-column>
            <el-table-column align="center" label="联赛类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.competitionType === 'league'"
                        >联赛</span
                    >
                    <span v-if="scope.row.competitionType === 'cup'">杯赛</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="country" label="举办国">
            </el-table-column>
            <el-table-column align="center" prop="currSeason" label="当前赛季">
            </el-table-column>
            <!--      <el-table-column-->
            <!--        align="center"-->
            <!--        label="性别类型">-->
            <!--        <template slot-scope="scope">-->
            <!--          <span v-if="scope.row.gender === 'male'">男子</span>-->
            <!--          <span v-if="scope.row.gender === 'female'">女子</span>-->
            <!--          <span v-if="scope.row.gender === 'youthMale'">青年男子</span>-->
            <!--          <span v-if="scope.row.gender === 'youthFemale'">青年女子</span>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
            <!--      <el-table-column-->
            <!--        label="比赛常规时间节数">-->
            <!--        <template slot-scope="scope">-->
            <!--          <span>{{scope.row.quarterNum}}</span>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
            <!--      <el-table-column-->
            <!--        label="每节比赛时间"-->
            <!--      prop="scope.row.quarterTime">-->
            <!--      </el-table-column>-->
            <el-table-column label="是否显示在积分榜">
                <template slot-scope="scope">
                    <span v-if="scope.row.ranking === 0">不显示</span>
                    <span v-if="scope.row.ranking === 1">显示在联赛积分榜</span>
                </template>
            </el-table-column>
            <el-table-column label="是否显示在文章搜索top上">
                <template slot-scope="scope">
                    <span v-if="scope.row.searchTop === 0">不显示</span>
                    <span v-if="scope.row.searchTop === 1"
                        >显示在文章搜索top上</span
                    >
                </template>
            </el-table-column>
            <el-table-column label="是否显示在赛程页面">
                <template slot-scope="scope">
                    <span v-if="scope.row.showMatch === 0">不显示</span>
                    <span v-if="scope.row.showMatch === 1">显示在赛程页面</span>
                </template>
            </el-table-column>
            <el-table-column label="来源类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.sourceType === 0">Leyu</span>
                    <span v-if="scope.row.sourceType === 1">AlStat</span>
                </template>
            </el-table-column>
            <el-table-column width="150" label="联赛颜色">
                <template slot-scope="scope">
                    <span :style="{ background: scope.row.sportsColor }">{{
                        scope.row.sportsColor
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.sportsId === 0">足球</span>
                    <span v-if="scope.row.sportsId === 1">篮球</span>
                </template>
            </el-table-column>
            <el-table-column label="参与的所有赛季" prop="seasons">
            </el-table-column>
            <!--      <el-table-column-->
            <!--          label="参加球队的类型">-->
            <!--        <template slot-scope="scope">-->
            <!--          <span v-if="scope.row.teamType === 'club'">俱乐部</span>-->
            <!--          <span v-if="scope.row.teamType === 'national'">国家队</span>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
            <el-table-column width="200" fixed="right">
                <template slot-scope="scope">
                    <div class="fx cursor">
                        <div>
                            <el-button
                                type="primary"
                                class="cursor"
                                size="mini"
                                plain
                                @click="
                                    getBackLeaguePointsRank(
                                        scope.row.id,
                                        scope.row.sportsId,
                                    )
                                "
                                >积分详情</el-button
                            >
                        </div>
                        <div class="ml-10">
                            <el-button
                                type="primary"
                                class="cursor"
                                size="mini"
                                plain
                                @click="openMatch(scope.row)"
                                >联赛详情</el-button
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
            :page-sizes="[15, 20, 30]"
            :page-size="15"
            layout="total, prev, pager, next, jumper"
            :total="currents.currentTotal"
        >
        </el-pagination>
        <el-dialog
            title="联赛详情"
            :visible.sync="dialogFormVisible"
            width="80%"
        >
            <el-form
                :model="form"
                ref="form"
                :rules="rules"
                style="display: flex"
            >
                <div>
                    <el-form-item
                        label="联赛名称"
                        :label-width="formLabelWidth"
                        prop="competitionName"
                    >
                        <el-input
                            v-model="form.competitionName"
                            autocomplete="off"
                            style="width: 238px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="英文名"
                        :label-width="formLabelWidth"
                        prop="competitionNameEn"
                    >
                        <el-input
                            v-model="form.competitionNameEn"
                            autocomplete="off"
                            style="width: 238px; margin-right: 10px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="短名称"
                        :label-width="formLabelWidth"
                        prop="competitionShortName"
                    >
                        <el-input
                            v-model="form.competitionShortName"
                            autocomplete="off"
                            style="width: 238px; margin-right: 10px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="联赛类型"
                        :label-width="formLabelWidth"
                        prop="competitionType"
                    >
                        <el-radio
                            v-model="form.competitionType"
                            :label="'league'"
                            >联赛</el-radio
                        >
                        <el-radio v-model="form.competitionType" :label="'cup'"
                            >杯赛</el-radio
                        >
                    </el-form-item>
                    <el-form-item
                        label="性别类型"
                        :label-width="formLabelWidth"
                        prop="gender"
                    >
                        <el-radio v-model="form.gender" :label="'male'"
                            >男子</el-radio
                        >
                        <el-radio v-model="form.gender" :label="'female'"
                            >女子</el-radio
                        >
                        <el-radio v-model="form.gender" :label="'youthMale'"
                            >青年男子</el-radio
                        >
                        <el-radio v-model="form.gender" :label="'youthFemale'"
                            >青年女子</el-radio
                        >
                    </el-form-item>
                    <el-form-item
                        label="是否显示在积分榜"
                        :label-width="formLabelWidth"
                        prop="ranking"
                    >
                        <el-radio v-model="form.ranking" :label="0"
                            >不显示</el-radio
                        >
                        <el-radio v-model="form.ranking" :label="1"
                            >显示在积分榜</el-radio
                        >
                    </el-form-item>
                    <el-form-item
                        label="是否显示在文章搜索top上"
                        :label-width="formLabelWidth"
                        prop="searchTop"
                    >
                        <el-radio v-model="form.searchTop" :label="0"
                            >不显示</el-radio
                        >
                        <el-radio v-model="form.searchTop" :label="1"
                            >显示在文章搜索top上</el-radio
                        >
                    </el-form-item>
                    <el-form-item
                        label="是否显示在赛程页面"
                        :label-width="formLabelWidth"
                        prop="showMatch"
                    >
                        <el-radio v-model="form.showMatch" :label="0"
                            >不显示</el-radio
                        >
                        <el-radio v-model="form.showMatch" :label="1"
                            >显示在积分榜</el-radio
                        >
                    </el-form-item>
                    <el-form-item
                        label="来源类型"
                        :label-width="formLabelWidth"
                        prop="sourceType"
                    >
                        <el-radio v-model="form.sourceType" :label="0"
                            >Leyu</el-radio
                        >
                        <el-radio v-model="form.sourceType" :label="1"
                            >AlStat</el-radio
                        >
                    </el-form-item>
                    <el-form-item
                        label="联赛颜色"
                        :label-width="formLabelWidth"
                        prop="sportsColor"
                    >
                        <el-input
                            v-model="form.sportsColor"
                            style="width: 200px; margin-right: 10px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="举办国"
                        :label-width="formLabelWidth"
                        prop="country"
                    >
                        <el-input
                            v-model="form.country"
                            autocomplete="off"
                            style="width: 238px; margin-right: 10px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="参加球队的类型"
                        :label-width="formLabelWidth"
                        prop="sourceType"
                    >
                        <el-radio v-model="form.teamType" :label="'club'"
                            >Leyu</el-radio
                        >
                        <el-radio v-model="form.teamType" :label="'national'"
                            >AlStat</el-radio
                        >
                    </el-form-item>
                    <el-form-item
                        label="比赛常规时间节数"
                        :label-width="formLabelWidth"
                        prop="quarterNum"
                    >
                        <el-input
                            v-model.number="form.quarterNum"
                            style="width: 200px; margin-right: 10px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="每节比赛时间"
                        :label-width="formLabelWidth"
                        prop="quarterTime"
                    >
                        <el-input
                            v-model="form.quarterTime"
                            style="width: 200px; margin-right: 10px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="参与的所有赛季"
                        :label-width="formLabelWidth"
                        prop="seasons"
                    >
                        <el-input
                            v-model="form.seasons"
                            style="width: 200px; margin-right: 10px"
                        ></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clear">取 消</el-button>
                <el-button type="primary" @click="updateSumbit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            title="积分详情"
            :visible.sync="dialogFormVisible1"
            width="80%"
        >
            <div
                style="
                    display: flex;
                    justify-content: center;
                    background: #ebeef5;
                    line-height: 30px;
                "
            >
                <div style="width: 45%">球队</div>
                <div style="width: 21%; text-align: center; margin-left: -60px">
                    胜/负
                </div>
                <div style="width: 12%; text-align: center">净得分</div>
                <div style="width: 15%; text-align: center; margin-left: 10px">
                    总得分
                </div>
            </div>
            <div v-for="(item, index) in leaguePointsRankData" :key="index">
                <div
                    class="ta-c mt-20"
                    style="background: #ffdfd6; line-height: 30px"
                >
                    {{ item.stageName }}
                </div>
                <div v-for="(item2, index2) in item.groups" :key="index2">
                    <div
                        class="ta-c mt-20"
                        style="background: #ebeef5; line-height: 30px"
                    >
                        {{ item2.groupName }}
                    </div>
                    <div v-for="(item3, index3) in item2.rankInfos">
                        <div
                            style="
                                display: flex;
                                justify-content: center;
                                margin-top: 10px;
                            "
                        >
                            <div style="width: 40%" class="fx align-items">
                                <div>
                                    <img
                                        :src="item3.teamIcon"
                                        class="league-img"
                                    />
                                </div>
                                <div class="ml-10">{{ item3.teamName }}</div>
                            </div>
                            <div style="width: 20%; text-align: center">
                                {{ item3.wins }}/{{ item3.losts }}
                            </div>
                            <div style="width: 12%; text-align: center">
                                {{ item3.pointsDiff }}
                            </div>
                            <div style="width: 18%; text-align: center">
                                {{ item3.pointsFor }}
                            </div>
                        </div>
                    </div>
                </div>
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
            currents2: {
                currentPage2: 1,
                currentTotal2: 0,
            },
            ps2: {
                pageNo2: 1,
                pageSize2: 15,
            },
            currents1: {
                currentPage1: 1,
                currentTotal1: 0,
            },
            ps1: {
                pageNo1: 1,
                pageSize1: 15,
            },
            currents: {
                currentPage: 1,
                currentTotal: 0,
            },
            ps: {
                pageNo: 1,
                pageSize: 15,
            },
            sportsId: 0,
            tableData: [],
            leaguePointsRankData: [],
            formLabelWidth: '180px',
            dialogFormVisible: false,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            dialogFormVisible3: false,
            competitionName: '',
            competitionShortName: '',
            ranking: 0,
            searchTop: 0,
            showMatch: 0,
            form: {
                competitionIcon: '',
                competitionName: '',
                competitionNameEn: '',
                competitionShortName: '',
                competitionShortNameEn: '',
                competitionType: '',
                country: '',
                currSeason: '',
                deleted: 0,
                gender: 'male',
                id: '',
                quarterNum: 0,
                quarterTime: '',
                ranking: 0,
                searchTop: 0,
                seasons: '',
                showMatch: 0,
                sort: 0,
                sourceId: 0,
                sourceType: 0,
                sportsColor: '',
                sportsId: 0,
                sportsName: '',
                teamType: 'national',
            },
            rules: {
                videoTitle: [
                    {
                        required: true,
                        message: '请输入联赛名称',
                        trigger: 'blur',
                    },
                ],
                videoUrl: [
                    {
                        required: true,
                        message: '请输入联赛URL',
                        trigger: 'blur',
                    },
                ],
            },
            headers: {
                'b-token': Cookie.get('token'),
            },
        };
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        clear() {
            // eslint-disable-next-line no-unused-vars
            let param = {
                competitionIcon: '',
                competitionName: '',
                competitionNameEn: '',
                competitionShortName: '',
                competitionShortNameEn: '',
                competitionType: '',
                country: '',
                currSeason: '',
                deleted: 0,
                gender: 'male',
                id: '',
                quarterNum: 0,
                quarterTime: '',
                ranking: 0,
                searchTop: 0,
                seasons: '',
                showMatch: 0,
                sort: 0,
                sourceId: 0,
                sourceType: 0,
                sportsColor: '',
                sportsId: 0,
                sportsName: '',
                teamType: 'national',
            };
            this.dialogFormVisible = false;
        },
        openMatch(data) {
            this.form = Object.assign(data);
            this.dialogFormVisible = true;
        },
        // 积分详情
        getBackLeaguePointsRank(id, sportsId) {
            let param = {
                id: id,
            };
            if (sportsId === 0) {
                this.$axios(
                    'post',
                    '/sport/getBackLeaguePointsRank',
                    param,
                ).then((res) => {
                    if (res.code === 200) {
                        this.leaguePointsRankData = res.data.dataList;
                        this.currents1.currentTotal = res.data.countSize;
                    }
                });
            } else if (sportsId === 1) {
                this.$axios(
                    'post',
                    '/sport/getBackLeaguePointsRankBasketball',
                    param,
                ).then((res) => {
                    if (res.code === 200) {
                        this.leaguePointsRankData = res.data.stages;
                        this.currents1.currentTotal = res.data.countSize;
                    }
                });
            }
            this.dialogFormVisible1 = true;
        },
        // 查询联赛列表
        getInfo(num) {
            if (num) {
                this.ps.pageNo = 1;
            }
            let param = {
                pageNum: this.ps.pageNo,
                pageSize: this.ps.pageSize,
                sportsId: this.sportsId,
                competitionName: this.competitionName,
                competitionShortName: this.competitionShortName,
                ranking: this.ranking,
                searchTop: this.searchTop,
                showMatch: this.showMatch,
            };
            this.$axios('post', '/sport/getSportList', param).then((res) => {
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
        // 修改联赛
        updateSumbit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let param = this.form;
                    this.$axios('post', '/sport/editSport', param).then(
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
.check-star {
    margin-top: -25px;
    border-bottom: 1px solid #b4bccc;
    padding-bottom: 10px;
}
#cover {
    position: absolute;
    left: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.4);
    width: 100%; /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
    height: 100%;
    filter: alpha(opacity=60); /*设置透明度为60%*/
    opacity: 0.6; /*非IE浏览器下设置透明度为60%*/
    z-index: 999;
}
#modal {
    margin: auto;
    max-width: 500px;
    max-height: 700px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    z-index: 9999;
}
.modal-img {
    /*width: 100%;*/
    /*height: 100%;*/
    max-width: 500px;
    max-height: 700px;
}
.league-img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
}
.ta-c {
    text-align: center;
}
</style>
