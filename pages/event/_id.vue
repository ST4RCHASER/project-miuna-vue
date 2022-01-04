<template>
  <div style="color: black">
    <h1>รายละเอียดกิจกรรม</h1>
    <br />
    <h3>QRCode:</h3>
    <el-card class="box-card">
      <div>
        <div class="tcenter">
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${uuid}`"
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
    <br />
  </div>
</template>

<script>
import { Helper } from '../../utils/Helper'
let helper = new Helper()
export default {
  data() {
    return {
      uuid: this.$route.params.id,
      name: '...',
      str_time: '...',
      description: '...',
    }
  },
  methods: {
    loadEventInfo() {
      this.loading = true
      this.$axios
        .get(`${helper.ENDPOINT_URL}/event/info/${this.uuid}`, {
          headers: {
            Authorization: 'Bearer ' + this.$cookies.get('auth'),
          },
        })
        .then((res) => {
          this.name = res.data.content.name
          this.str_time = `${new Date(res.data.content.time.start).toLocaleString()} ถึง ${new Date(res.data.content.time.start).toLocaleString()}`
          this.description = res.data.content.description
          this.loading = false
        })
        .catch((e) => {
          if (e.response.status == 401) {
            this.$router.push('/login')
          }
          if (e.response.status == 404 || e.response.status == 500) {
            this.$router.push('/events')
          }
        })
    },
  },
  mounted() {
    if (!this.$cookies.get('auth')) {
      this.$router.push('/login')
    }
    this.loadEventInfo()
    console.log(this.uuid)
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