<template>
  <div>
    {{checkedCities}}
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="(item,index) in cities" :label="item" :key="index">{{item.name}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
  const cityOptions = [
    {id: '1', name: '北京1'},
    {id: '2', name: '北京2'},
    {id: '3', name: '北京3'},
    {id: '4', name: '北京4'},
    {id: '5', name: '北京5'},
    {id: '6', name: '北京6'}
  ]
export default {
    data () {
      return {
        checkAll: false,
        checkedCities: [],
        cities: cityOptions,
        isIndeterminate: true
      }
    },
    methods: {
      handleCheckAllChange (val) {
        this.checkedCities = val ? cityOptions : []
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.cities.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
      }
    }
  }
</script>

<style scoped>

</style>
