<template>
  <div style="color: black">
    <h1>รายละเอียดกิจกรรม</h1>
    <br />
    <h3>QRCode:</h3>
    <el-card class="box-card">
      <div>
        <div class="tcenter">
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${qrData}`"
          />
        </div>
      </div>
    </el-card>
    <h3>ข้อมูล:</h3>
    <el-card class="box-card">
      <b>รหัสกิจกรรม:</b> {{ uuid }}
      <br />
      <b>ชื่อกิจกรรม:</b> {{ name }}
      <br />
      <b>ระยะเวลากิจกรรม:</b> {{ str_time }}
      <br />
      <b>คำอธิบาย/หมายเหตุ:</b> {{ description }}
    </el-card>
    <!-- {{ uuid }} -->
    <h3>ผู้เข้าร่วม:</h3>
    <a :href="helper.ENDPOINT_URL + '/event/export/' + uuid" target="_blank"
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
            data.major.toLowerCase().includes(search.toLowerCase()) ||
            data.sec.toLowerCase().includes(search.toLowerCase()) ||
            data.start_time.toLowerCase().includes(search.toLowerCase()) ||
            data.end_time.toLowerCase().includes(search.toLowerCase()) ||
            data.sid_time.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column label="ลำดับ" prop="order"> </el-table-column>
      <el-table-column label="ชื่อนักศึกษา" prop="name"> </el-table-column>
      <el-table-column label="สาขา" prop="major"> </el-table-column>
      <el-table-column label="กลุ่มเรียน" prop="sec"> </el-table-column>
      <el-table-column label="รหัสนักศึกษา" prop="sid"> </el-table-column>
      <el-table-column label="วันที่เข้าร่วม" prop="date"> </el-table-column>
      <el-table-column label="เวลาเริ่มต้น" prop="start_time">
      </el-table-column>
      <el-table-column label="เวลาสิ้นสุด" prop="end_time"> </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.end_time === '-' ? 'primary' : 'success'"
            disable-transitions
            >{{
              scope.row.end_time === '-' ? 'อยู่ในระบบ' : 'ลงชื่อออกแล้ว'
            }}</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </div>
</template>

<script>
import { Helper } from '../../utils/Helper'
import totp from 'totp-generator';
let helper = new Helper()
import base32 from 'base32';
export default {
  data() {
    return {
      uuid: this.$route.params.id,
      name: '...',
      str_time: '...',
      description: '...',
      tableData: [],
      search: '',
      helper: helper,
      rawData: {},
      qrData: 'none',
    }
  },
  methods: {
    loadEventInfo() {
      this.loading = true
      this.$axios
        .get(`${helper.ENDPOINT_URL}/event/info/${this.uuid}?inclide=true`, {
          headers: {
            Authorization: 'Bearer ' + this.$cookies.get('auth'),
          },
        })
        .then((res) => {
          this.rawData = res.data.content
          switch (this.rawData.qrType) {
            case 0:
              this.qrData = atob(JSON.stringify({
                type: 'event',
                id: this.rawData.uuid,
              })).toString()
              break
            case 1:
              let base = JSON.stringify({
                type: 'event',
                id: this.rawData.uuid,
                totp: totp(base32.encode(`${this.rawData.uuid}${this.rawData.ownerID}${this.rawData.uuid}${this.rawData.ownerID}`)),
              });
              console.log('base',base)
              this.qrData = atob(base).toString()
              break
            case 2:
              this.qrData = atob(JSON.stringify({
                type: 'event',
                id: this.rawData.uuid,
                hash: this.rawData.oneTimeHash,
              })).toString()
              break
          }
          this.name = this.rawData.name
          this.str_time = `${
            new Date(this.rawData.time.start).getDate() +
            '/' +
            (new Date(this.rawData.time.start).getMonth() + 1) +
            '/' +
            (new Date(this.rawData.time.start).getFullYear() + 543) +
            ', ' +
            (new Date(this.rawData.time.start).getHours() > 9
              ? new Date(this.rawData.time.start).getHours()
              : '0' + new Date(this.rawData.time.start).getHours()) +
            ':' +
            (new Date(this.rawData.time.start).getMinutes() > 9
              ? new Date(this.rawData.time.start).getMinutes()
              : '0' + new Date(this.rawData.time.start).getMinutes())
          } ถึง ${
            new Date(this.rawData.time.end).getDate() +
            '/' +
            (new Date(this.rawData.time.end).getMonth() + 1) +
            '/' +
            (new Date(this.rawData.time.end).getFullYear() + 543) +
            ', ' +
            (new Date(this.rawData.time.end).getHours() > 9
              ? new Date(this.rawData.time.end).getHours()
              : '0' + new Date(this.rawData.time.end).getHours()) +
            ':' +
            (new Date(this.rawData.time.end).getMinutes() > 9
              ? new Date(this.rawData.time.end).getMinutes()
              : '0' + new Date(this.rawData.time.end).getMinutes())
          }`
          this.description = this.rawData.description
          this.tableData = []
          for (const p of this.rawData.participants) {
            this.tableData.push({
              order: this.tableData.length + 1,
              date:
                new Date(p.timeJoin).getDate() +
                '/' +
                (new Date(p.timeJoin).getMonth() + 1) +
                '/' +
                (new Date(p.timeJoin).getFullYear() + 543),
              name: p.owner.name,
              major: p.owner.major,
              sec: p.owner.sec,
              sid: p.owner.student_id,
              start_time:
                new Date(p.timeJoin).getHours() +
                ':' +
                new Date(p.timeJoin).getMinutes() +
                ':' +
                new Date(p.timeJoin).getSeconds(),
              end_time:
                new Date(p.timeLeave).getTime() < 1
                  ? '-'
                  : new Date(p.timeLeave).getHours() +
                    ':' +
                    new Date(p.timeLeave).getMinutes() +
                    ':' +
                    new Date(p.timeLeave).getSeconds(),
            })
          }
          this.loading = false
        })
        .catch((e) => {
          console.log(e)
          if (e.response) {
            if (e.response.status == 401) {
              this.$router.push('/login')
            }
            if (e.response.status == 404 || e.response.status == 500) {
              this.$router.push('/events')
            }
          }
        })
    },
  },
  mounted() {
    if (!this.$cookies.get('auth')) {
      this.$router.push('/login')
    }
    setInterval(() => {
      this.loadEventInfo()
    }, 3000)
    this.loadEventInfo()
    console.log(this.uuid)
  },
  created: function () {
    if (!this.$cookies.get('auth')) {
      this.$router.push('/login')
    }
  },
}
</script>

<style>
h3 {
  margin-bottom: 2rem;
  margin-top: 2rem;
}
.tcenter {
  text-align: center;
}
</style>