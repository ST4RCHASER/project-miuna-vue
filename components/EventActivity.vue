<template>
  <div style="color: black">
    <el-button
      style="float: right"
      type="success"
      @click="
        editor.show = true
        editor.mode = 'create'
        editor.form = {}
      "
      >สร้างกิจกรรมใหม่</el-button
    >
    <h1>รายชื่อกิจกรรมที่สร้าง</h1>
    <el-drawer
      :title="editor.mode == 'create' ? 'สร้างกิจกรรมใหม่' : 'แก้ไขกิจกรรม'"
      :visible.sync="editor.show"
      size="40%"
    >
      <el-form ref="form" :model="editor.form">
        <div class="drawer-form">
          <el-alert
            v-if="editor.genernal_error"
            title="โปรดใส่ข้อมูลลงในช่องที่มี *"
            type="error"
            :closable="false"
            show-icon
          >
          </el-alert>
          <el-form-item label="ชื่อกิจกรรม*">
            <el-input v-model="editor.form.name"></el-input>
          </el-form-item>
          <el-form-item label="ระยะเวลากิจกรรม*">
            <br />
            <el-date-picker
              v-model="editor.form.str_time"
              :picker-options="pickerOptions"
              type="datetimerange"
              range-separator="ถึง"
              start-placeholder="วันที่เริ่มกิจกรรม"
              end-placeholder="วันที่สิ้นสุดกิจกรรม"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="รูปแบบ QRCode*">
            <br />
            <div style="margin-top: 20px">
              <el-radio-group v-model="editor.form.qrType" size="small">
                <el-radio-button label="0">คงที่</el-radio-button>
                <el-radio-button label="1">จำกัดเวลา</el-radio-button>
                <el-radio-button label="2">ครั้งเดียว</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="คำอธิบาย/หมายเหตุ">
            <el-input
              type="textarea"
              v-model="editor.form.description"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" @click="saveEditor()"
              >บันทึก</el-button
            >
            <el-button :loading="loading" @click="editor.show = false"
              >ยกเลิก</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </el-drawer>
    <el-table
      v-if="!loading && tableData"
      border
      style="width: 100%"
      :data="
        tableData.filter(
          (data) =>
            !search ||
            (data.name &&
              data.name.toLowerCase().includes(search.toLowerCase())) ||
            (data.uuid &&
              data.uuid.toLowerCase().includes(search.toLowerCase())) ||
            (data.nick &&
              data.nick.toLowerCase().includes(search.toLowerCase()))
        )
      "
    >
      <el-table-column prop="id" label="UUID"> </el-table-column>
      <el-table-column prop="name" label="Name"> </el-table-column>
      <el-table-column prop="time.start_txt" label="Start"></el-table-column>
      <el-table-column prop="time.end_txt" label="End"> </el-table-column>
      <el-table-column fixed="right" label="Operations" width="175">
        <template slot-scope="scope">
          <el-button
            type="success"
            @click="viewInfomation(scope.row.id)"
            icon="el-icon-info"
            circle
          ></el-button>
          <el-button
            type="primary"
            @click="startEdit(scope.row.id)"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteEvent(scope.row.id)"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-else>
      <h3>Prepareing...</h3>
    </div>
  </div>
</template>

<script>
import { Helper } from '../utils/Helper'
import NavBar from './NavBar.vue'
let helper = new Helper()
export default {
  components: { NavBar },
  data() {
    return {
      editor: {
        show: false,
        form: {},
        mode: 'create',
        genernal_error: false,
        qrType: 0,
      },
      pickerOptions: {
        disabledDate(time) {
          return new Date().setDate(new Date().getDate() - 1) > time.getTime()
        },
      },
      loading: true,
      tableData: [],
    }
  },
  mounted() {
    this.editor.form = {
      name: '',
      description: '',
      str_time: [],
      rawTableData: [],
    }
    this.loadOwnEventList()
  },
  methods: {
    viewInfomation(uuid) {
      this.$router.push('/event/' + uuid)
    },
    deleteEvent(uuid) {
      const h = this.$createElement
      this.$confirm(
        h('p', null, [
          h(
            'span',
            { style: 'color: black;' },
            'Are you sure you want to delete event '
          ),
          h('i', { style: 'color: blue; font-weight: bold;' }, uuid),
          h('i', '?'),
          h(
            'i',
            { style: 'color: red; font-weight: bold;' },
            '\nAll event data and logs will erase!'
          ),
        ]),
        'Warning',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning',
        }
      )
        .then(() => {
          console.log('delete event')
          this.$axios
            .delete(helper.ENDPOINT_URL + `/event/delete/${uuid}`, {
              headers: {
                Authorization: 'Bearer ' + this.$cookies.get('auth'),
              },
            })
            .then((res) => {
              this.$message({
                type: 'success',
                message: 'Event deleted!',
              })
              console.log(res.data)
              this.loadOwnEventList()
            })
            .catch((err) => {
              this.$message({
                type: 'error',
                message: 'Error: ' + err.response.data.message,
              })
            })
        })
        .catch((e) => {
          console.log(e)
        })
    },
    startEdit(id) {
      let data = this.rawTableData.find((data) => data.id === id)
      if (data) {
        this.editor.mode = 'edit'
        this.editor.form = {
          id: data.id,
          name: data.name,
          description: data.description,
          qrType: data.qrType,
          str_time: [new Date(data.time.start), data.time.end],
        }
        console.log(this.editor.form, data)
        this.editor.show = true
      }
    },
    loadOwnEventList() {
      this.loading = true
      this.$axios
        .get(helper.ENDPOINT_URL + `/event/list`, {
          headers: {
            Authorization: 'Bearer ' + this.$cookies.get('auth'),
          },
        })
        .then((response) => {
          this.loading = false
          this.tableData = []
          this.rawTableData = response.data.content
          for (const data of response.data.content) {
            this.tableData.push({
              id: data.id,
              name: data.name,
              time: {
                start_txt:
                  new Date(data.time.start).getDate() +
                  '/' +
                  (new Date(data.time.start).getMonth() + 1) +
                  '/' +
                  (new Date(data.time.start).getFullYear() + 543) +
                  ', ' +
                  (new Date(data.time.start).getHours() > 9
                    ? new Date(data.time.start).getHours()
                    : '0' + new Date(data.time.start).getHours()) +
                  ':' +
                  (new Date(data.time.start).getMinutes() > 9
                    ? new Date(data.time.start).getMinutes()
                    : '0' + new Date(data.time.start).getMinutes()),
                end_txt:
                  new Date(data.time.end).getDate() +
                  '/' +
                  (new Date(data.time.end).getMonth() + 1) +
                  '/' +
                  (new Date(data.time.end).getFullYear() + 543) +
                  ', ' +
                  (new Date(data.time.end).getHours() > 9
                    ? new Date(data.time.end).getHours()
                    : '0' + new Date(data.time.end).getHours()) +
                  ':' +
                  (new Date(data.time.end).getMinutes() > 9
                    ? new Date(data.time.end).getMinutes()
                    : '0' + new Date(data.time.end).getMinutes()),
              },
            })
          }
        })
    },
    saveEditor() {
      if (this.editor.mode == 'create') {
        if (
          !this.editor.form.str_time ||
          !this.editor.form.name ||
          this.editor.form.name == '' ||
          this.editor.form.str_time == ''
        ) {
          this.editor.genernal_error = true
          return
        }
        this.editor.form.time = {
          start: this.editor.form.str_time[0],
          end: this.editor.form.str_time[1],
        }
        console.log(this.editor)
        this.$axios
          .post(helper.ENDPOINT_URL + '/event/create', this.editor.form, {
            headers: {
              Authorization: 'Bearer ' + this.$cookies.get('auth'),
            },
          })
          .then((response) => {
            this.editor.show = false
            this.$message({
              message: 'สร้างกิจกรรมเรียบร้อย',
              type: 'success',
            })
            this.loadOwnEventList()
          })
          .catch((error) => {
            this.$message({
              message: 'เกิดข้อผิดพลาด',
              type: 'error',
            })
          })
      } else {
        if (
          !this.editor.form.str_time ||
          !this.editor.form.name ||
          this.editor.form.name == '' ||
          this.editor.form.str_time == ''
        ) {
          this.editor.genernal_error = true
          return
        }
        this.editor.form.time = {
          start: this.editor.form.str_time[0],
          end: this.editor.form.str_time[1],
        }
        console.log(this.editor)
        this.$axios
          .put(
            helper.ENDPOINT_URL + '/event/edit/' + this.editor.form.id,
            this.editor.form,
            {
              headers: {
                Authorization: 'Bearer ' + this.$cookies.get('auth'),
              },
            }
          )
          .then((response) => {
            this.editor.show = false
            this.$message({
              message: 'แก้ไขกิจกรรมเรียบร้อย',
              type: 'success',
            })
            this.loadOwnEventList()
          })
          .catch((error) => {
            this.$message({
              message: 'เกิดข้อผิดพลาด',
              type: 'error',
            })
          })
      }
    },
  },
}
</script>

<style>
.drawer-form {
  padding: 1rem;
}
</style>