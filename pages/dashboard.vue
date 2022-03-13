<template>
  <div style="color: black">
    <h1>History</h1>
    <a :href="helper.ENDPOINT_URL + '/event/history/export/' + uid" target="_blank"
      ><el-button type="success" size="small" icon="el-icon-document"
        >Export</el-button
      ></a
    >
    <el-table
      :data="
        tableData.filter(
          (data) =>
            !search ||
            data.name.toLowerCase().includes(search.toLowerCase()) ||
            data.date.toLowerCase().includes(search.toLowerCase()) ||
            data.start_time.toLowerCase().includes(search.toLowerCase()) ||
            data.end_time.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column label="ลำดับ" prop="order"> </el-table-column>
      <el-table-column label="ชื่อกิจกรรม" prop="name"> </el-table-column>
      <el-table-column label="วันที่เข้าร่วม" prop="date"> </el-table-column>
      <el-table-column label="เวลาที่เข้าร่วม" prop="start_time">
      </el-table-column>
      <el-table-column label="เวลาสิ้นสุด" prop="end_time"> </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template> </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Helper } from '~/utils/Helper'
let helper = new Helper();
export default {
  data() {
    return {
      activeIndex: 0,
      tableData: [],
      helper: helper,
      loading: true,
      uid: this.$cookies.get('uid'),
    }
  },
  created: function () {
    if (!this.$cookies.get('auth')) {
      this.$router.push('/login')
    }
  },
  methods: {
    loadHistory() {
      this.loading = true;
      this.$axios
        .get(helper.ENDPOINT_URL + `/event/history/`, {
          headers: {
            Authorization: 'Bearer ' + this.$cookies.get('auth'),
          },
        })
        .then((response) => {
          this.loading = false
          this.tableData = []
          this.rawTableData = response.data.content
          let i = 1
          for (const data of response.data.content) {
            this.tableData.push({
              order: i++,
              id: data.id,
              name: data.eventInfo.name,
              date:
                new Date(data.timeJoin).getDate() +
                '/' +
                (new Date(data.timeJoin).getMonth() + 1) +
                '/' +
                (new Date(data.timeJoin).getFullYear() + 543),
              start_time:
                new Date(data.timeJoin).getHours() +
                ':' +
                new Date(data.timeJoin).getMinutes() +
                ':' +
                new Date(data.timeJoin).getSeconds(),
              end_time:
                new Date(data.timeLeave).getTime() < 1
                  ? '-'
                  : new Date(data.timeLeave).getHours() +
                    ':' +
                    new Date(data.timeLeave).getMinutes() +
                    ':' +
                    new Date(data.timeLeave).getSeconds(),
            })
          }
        })
    },
  },
  mounted() {
    //Load history from server
    this.loadHistory()
  },
}
</script>

<style>
body {
  background: white !important;
}
</style>