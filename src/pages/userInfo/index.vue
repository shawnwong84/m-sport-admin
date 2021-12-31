<template>
    <div style="height: 95%">
        <div class="fx mt-10" style="height: 100%">
            <div>
                <div class="info">
                    <div class="fx justify-between align-items">
                        <div class="fs-18 fw-600">用户信息</div>
                        <div>
                            <el-button
                                type="primary"
                                plain
                                size="mini"
                                @click="showUser"
                                >用户管理</el-button
                            >
                            <el-button
                                type="success"
                                size="mini"
                                v-if="showSave"
                                icon="el-icon-folder-checked"
                                @click="saveSumbit"
                                >保存</el-button
                            >
                            <el-button
                                type="primary"
                                plain
                                size="mini"
                                icon="el-icon-edit-outline"
                                v-else
                                @click="update"
                                >编辑</el-button
                            >
                        </div>
                    </div>
                    <div class="fx align-items mt-30">
                        <div>
                            <img
                                src="../../assets/image/logo.jpg"
                                class="head-img"
                            />
                        </div>
                        <div class="ml-10">
                            <input
                                type="text"
                                class="fw-600 fs-16"
                                :class="
                                    showSave ? 'info-input' : 'info-input-none'
                                "
                                :disabled="disabled"
                                v-model="userName"
                            />
                        </div>
                    </div>
                    <div class="fx justify-between mt-20">
                        <div class="c-9">手机号</div>
                        <div>
                            <input
                                type="text"
                                class="ta-r"
                                :class="
                                    showSave ? 'info-input' : 'info-input-none'
                                "
                                :disabled="disabled"
                                v-model="phone"
                            />
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="fx justify-between">
                        <div class="c-9">设备ID</div>
                        <div class="pr-10">{{ deviceId }}</div>
                    </div>
                    <el-divider></el-divider>
                    <div class="fx justify-between">
                        <div class="c-9">免费次数</div>
                        <div>
                            <input
                                type="text"
                                class="ta-r"
                                :class="
                                    showSave ? 'info-input' : 'info-input-none'
                                "
                                :disabled="disabled"
                                v-model="freeWatchNum"
                            />
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="fx justify-between">
                        <div class="c-9">下载次数</div>
                        <div>
                            <input
                                type="text"
                                class="ta-r"
                                :class="
                                    showSave ? 'info-input' : 'info-input-none'
                                "
                                :disabled="disabled"
                                v-model="dayDownloadTime"
                            />
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="fx justify-between">
                        <div class="c-9">亚博账号</div>
                        <div>
                            <input
                                type="text"
                                class="ta-r"
                                :class="
                                    showSave ? 'info-input' : 'info-input-none'
                                "
                                :disabled="disabled"
                                v-model="ybAccount"
                            />
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="fx justify-between">
                        <div class="c-9">是否会员</div>
                        <div class="pr-10" v-if="isVip === 1">是</div>
                        <div class="pr-10" v-if="isVip === 0">否</div>
                    </div>
                    <el-divider></el-divider>
                    <div class="fx justify-between">
                        <div class="c-9">渠道</div>
                        <div class="pr-10" v-if="!showSave">
                            <span v-if="channelId === null">全部渠道</span>
                            <span v-if="channelId === '0'">官方</span>
                            <span v-if="channelId && channelId !== '0'"
                                >渠道{{ channelId }}</span
                            >
                        </div>
                        <div class="pr-10" v-else>
                            <el-select
                                v-model="channelId"
                                size="small"
                                style="width: 90px"
                                :disabled="isChannel"
                            >
                                <el-option
                                    v-for="(item, index) in channelData"
                                    :key="index"
                                    :value="index"
                                    :label="item"
                                ></el-option>
                            </el-select>
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="fx justify-between">
                        <div class="c-9">兑换码</div>
                        <div class="pr-10">
                            <el-button
                                type="success"
                                size="mini"
                                icon="el-icon-folder-checked"
                                @click="exchangeCodeSave"
                                style="margin-right: 10px"
                                >生成兑换码</el-button
                            >{{ exchangeData.exchangeCode }}
                        </div>
                    </div>
                    <el-divider
                        v-if="exchangeData && exchangeData.exchangeCode"
                    ></el-divider>
                    <div
                        class="fx justify-between"
                        v-if="exchangeData && exchangeData.exchangeCode"
                    >
                        <div class="c-9">兑换码状态</div>
                        <div class="pr-10" v-if="exchangeData.status === '1'">
                            已激活
                        </div>
                        <div class="pr-10" v-else>未激活</div>
                    </div>
                </div>
                <div class="vip" v-if="isVip === 1">
                    <div>
                        <div class="fx align-items">
                            <div>
                                <img src="../../assets/image/vip-logo.png" />
                            </div>
                            <div class="ml-10">
                                <img
                                    src="../../assets/image/logo.jpg"
                                    class="vip-head-img"
                                />
                            </div>
                        </div>
                        <div class="c-8 mt-20 fs-12 fw-600">
                            <span class="fs-18">{{ userName }}</span
                            >（运营开卡）
                        </div>
                        <div class="c-8 mt-10">
                            会员总时长：{{ fromDate(endTime) }}到期
                        </div>
                        <div class="c-8 fs-12 opacity">
                            每日<span v-if="freeWatchNum === -1"
                                >可无限次观看</span
                            >
                            <span v-else>可观看{{ freeWatchNum }}次</span>
                            ，下载次数20次/日
                        </div>
                        <div class="c-8 fs-12 opacity">专属VIP专场尽情享受</div>
                    </div>
                </div>
            </div>
            <div class="friend-info ml-10">
                <div class="fs-18 fw-600 info-txt">拉好友信息</div>
                <div class="list-box">
                    <div
                        class="fx justify-between f-info-list"
                        v-for="(item, index) in agentList"
                        :key="index"
                        :class="num === index ? 'list-select' : ''"
                        @click="select(index)"
                    >
                        <div class="fx">
                            <!--              <div><img src="../../assets/image/logo.jpg" class="friend-head-img"/></div>-->
                            <div>
                                <div>
                                    <span class="fs-18 fw-600 c-1">{{
                                        item
                                    }}</span>
                                    <!--                  <span class="vip-lv">一级代理</span>-->
                                </div>
                                <!--                <div class="fs-12 c-9 mt-10">Jacob Maraies</div>-->
                            </div>
                        </div>
                        <!--            <div>-->
                        <!--              <div class="fs-12 c-9">可提现金额</div>-->
                        <!--              <div class="c-e fs-18 fw-600">￥267</div>-->
                        <!--            </div>-->
                    </div>
                </div>
            </div>
            <div class="friend-info ml-10">
                <div class="fs-18 fw-600 info-txt">购卡流水记录</div>
                <div class="list-box">
                    <div
                        class="f-info-list"
                        v-for="(item, index) in cardList"
                        :key="index"
                        :class="listNum === index ? 'list-select' : ''"
                        @click="selectList(index)"
                    >
                        <div class="fx align-items justify-between">
                            <div class="fs-12 c-9">开卡人</div>
                            <div>{{ item.userName }}</div>
                        </div>
                        <div class="fx align-items justify-between">
                            <div class="fs-12 c-9">操作类型</div>
                            <div>
                                <span v-if="item.optionType === 1"
                                    >充值购买</span
                                >
                                <span v-if="item.optionType === 2"
                                    >运营添加</span
                                >
                                <span v-if="item.optionType === 3"
                                    >好友兑换</span
                                >
                                <span v-if="item.optionType === 4"
                                    >兑换码兑换</span
                                >
                            </div>
                        </div>
                        <div class="fx align-items justify-between">
                            <div class="fs-12 c-9">充值时间</div>
                            <div>{{ fromDate(item.rechargeTime) }}</div>
                        </div>
                        <div class="fx align-items justify-between">
                            <div class="fs-12 c-9">开卡时间</div>
                            <div>{{ fromDate(item.startTime) }}</div>
                        </div>
                        <div class="fx align-items justify-between">
                            <div class="fs-12 c-9">结束时间</div>
                            <div>{{ fromDate(item.endTime) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            channelData: [],
            num: 0,
            listNum: 0,
            showSave: false,
            userName: '',
            phone: '',
            isVip: 0,
            freeWatchNum: '',
            ybAccount: '',
            deviceId: '',
            dayDownloadTime: '',
            exchangeData: [],
            exchangeCode: '',
            endTime: '',
            startTime: '',
            channelId: '',
            id: 0,
            disabled: true,
            cardList: [],
            agentList: [],
            isChannel: false,
        };
    },
    mounted() {
        this.getInfo();
        this.getUserRecharge();
        this.getAgentList();
        this.channelData = JSON.parse(sessionStorage.getItem('channelList'));
        if (sessionStorage.getItem('username') === 'admin') {
            this.isChannel = false;
        } else {
            this.isChannel = true;
        }
    },
    methods: {
        select(num) {
            this.num = num;
        },
        selectList(num) {
            this.listNum = num;
        },
        showUser() {
            this.$router.push({ name: 'home' });
        },
        update() {
            this.showSave = true;
            this.disabled = false;
        },
        saveSumbit() {
            let param = {
                deviceId: this.deviceId,
                endTime: this.endTime,
                freeWatchNum: this.freeWatchNum,
                id: this.id,
                isVip: this.isVip,
                phone: this.phone,
                userName: this.userName,
                startTime: this.startTime,
                channelId: this.channelId,
                ybAccount: this.ybAccount,
            };
            this.$axios('post', '/user/updateUser', param).then((res) => {
                if (res.code === '0') {
                    this.showSave = false;
                    this.disabled = true;
                    this.getInfo();
                }
            });
        },
        getAgentList() {
            this.$axios(
                'post',
                '/user/agentList?userId=' + this.$route.query.id,
            ).then((res) => {
                if (res.code === '0') {
                    this.agentList = res.data;
                }
            });
        },
        getUserRecharge() {
            this.$axios(
                'post',
                '/user/userRecharge?userId=' + this.$route.query.id,
            ).then((res) => {
                if (res.code === '0') {
                    this.cardList = res.data;
                }
            });
        },
        // 查询用户详情
        getInfo() {
            this.$axios(
                'post',
                '/user/detail?userId=' + this.$route.query.id,
            ).then((res) => {
                if (res.code === '0') {
                    this.deviceId = res.data.deviceId;
                    this.endTime = res.data.endTime;
                    this.freeWatchNum = res.data.freeWatchNum;
                    this.id = res.data.id;
                    this.isVip = res.data.isVip;
                    this.phone = res.data.phone;
                    this.userName = res.data.userName;
                    this.startTime = res.data.startTime;
                    this.channelId = res.data.channelId;
                    this.dayDownloadTime = res.data.dayDownloadTime;
                    this.ybAccount = res.data.ybAccount;
                    this.exchangeCode = res.data.exchangeCode;
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
        exchangeCodeSave() {
            this.$axios(
                'post',
                '/user/exchangeCodeSave?phone=' +
                    this.phone +
                    '&userId=' +
                    this.$route.query.id,
            ).then((res) => {
                if (res.code === '0') {
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                    });
                    this.exchangeData = res.data;
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.msg,
                    });
                }
            });
        },
    },
};
</script>

<style>
.el-upload--picture-card {
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 100%;
    font-size: 18px;
    text-align: center;
    display: block;
}
.el-upload-list--picture-card .el-upload-list__item {
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 100%;
    border: none;
    display: block;
}
</style>
<style scoped>
/*.el-upload-list__item-thumbnail{*/
/*  width: 60px;*/
/*  height: 60px;*/
/*  line-height: 60px;*/
/*  border-radius: 100%;*/
/*}*/
.mt-30 {
    margin-top: 30px;
}
.info {
    background: #ffffff;
    border-radius: 20px;
    width: 340px;
    padding: 20px 30px;
    box-shadow: 8px 5px 25px -1px rgb(0, 92, 219, 0.1);
}
.head-img {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #d8d8d8;
}
.vip-head-img {
    width: 44px;
    height: 44px;
    border-radius: 100%;
}
.vip {
    width: 380px;
    height: 230px;
    background-image: url('../../assets/image/vip-card.png');
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    margin-left: -20px;
    padding-left: 53px;
    box-sizing: border-box;
}
.c-8 {
    color: #b35a00;
}
.c-e {
    color: #e46612;
}
.c-1 {
    color: #1c1d20;
}
.opacity {
    opacity: 0.6;
}
.friend-info {
    background: #ffffff;
    border-radius: 20px;
    width: 450px;
    padding: 30px 20px;
    box-sizing: border-box;
    height: 100%;
    box-shadow: 8px 5px 25px -1px rgba(0, 92, 219, 0.1);
}
.list-box {
    height: 95%;
    overflow-y: auto;
}
.list-box::-webkit-scrollbar {
    display: none;
}
.friend-head-img {
    width: 54px;
    height: 54px;
    border-radius: 10px;
}
.vip-lv {
    background: #ffde91;
    border-radius: 4px;
    padding: 3px 5px;
    color: #e46612;
    font-size: 12px;
    margin-left: 10px;
}
.f-info-list {
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    cursor: pointer;
}
.list-select {
    background: #ffffff;
    box-shadow: -2px 9px 8px -6px #bdb7cb;
}
.info-txt {
    height: 40px;
    padding-left: 10px;
}
.fs-16 {
    font-size: 16px;
}
.info-input-none {
    border: none;
    outline: none;
    background: #ffffff;
}
.info-input {
    background: #f2f4fc;
    border-radius: 4px;
    border: none;
    color: #1c1d20;
    padding: 5px 10px;
    outline: none;
    width: 160px;
}
.ta-r {
    text-align: right;
}
.pr-10 {
    padding-right: 10px;
}
</style>
