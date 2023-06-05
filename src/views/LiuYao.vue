<template>
  <div className="detail_box">
    <div>
      <div class="search_box">
        <div class="title_style">搜索条件</div>
        <hr class="hr_style" />
        <div class="search_detail">
          <el-row :gutter="20" style="padding-left: 20px">
            <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="4">
              <el-form-item label="问题：">
                <el-input
                    class="search_input"
                    v-model="wenTi"
                    @keyup.enter.native="getData"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="4">
              <el-form-item label="卦象：">
                <el-input
                    class="search_input"
                    v-model="guaXiang"
                    @keyup.enter.native="getData"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="6">
              <el-form-item label="起卦时间：">
                <el-date-picker
                    @change="getData"
                    style="width: 332px"
                    v-model="searchTime"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="YYYY 年 MM 月 DD 日"
                    value-format="YYYY-MM-DD"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="6">
              <el-button size="small" type="primary" @click="getData">
                <el-icon style="margin-right: 5px"><Search /></el-icon> 搜索
              </el-button>
              <el-button size="small" @click="reset">
                <el-icon style="margin-right: 5px"><Refresh /></el-icon> 重置
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div className="detail_box_financial_statistics">
      <div class="title_style">
        断卦记录
        <div class="function_button" style="width: 200px">
          <el-button type="primary" @click="handleAdd()">新建</el-button>
          <el-popconfirm title="确定删除吗?" @confirm="deleteLiuYao">
            <template #reference>
              <el-button type="danger">批量删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
      <hr class="hr_style" style="margin-bottom: 3px" />
      <div class="detail_box_meet_list" style="width: 100%">
        <el-table
            :data="tableData"
            ref="tableData"
            v-loading="loading"
            element-loading-text="数据加载中..."
            :header-row-style="{ height: '40px' }"
            :row-style="{ height: '40px' }"
            style="width: 100%"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :reserve-selection="true" />
          <el-table-column prop="id" label="唯一标识id" v-if="false" />
          <el-table-column
              prop="wenTi"
              label="问题"
              show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.wenTi || "——" }}
            </template>
          </el-table-column>
          <el-table-column
              prop="guaXiang"
              label="卦象"
              show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.guaXiang || "——" }}
            </template>
          </el-table-column>
          <el-table-column
              prop="paiPan"
              label="排盘"
              show-overflow-tooltip
          >
            <template #default="{ row }">
              <img :src="this.imgUrl+row.paiPan" style="max-width: 100px; max-height: 100px;">
            </template>
          </el-table-column>
          <el-table-column
              prop="duanGua"
              label="断卦"
              show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.duanGua || "——" }}
            </template>
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="起卦时间"
              sortable
              show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.createTime || "——" }}
            </template>
          </el-table-column>
          <el-table-column prop="beiZhu" label="备注" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.beiZhu || "——" }}
            </template>
          </el-table-column>
          <el-table-column width="150px">
            <template #header> 操作 </template>
            <template #default="scope">
              <el-button type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
              <el-button type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page_and_button">
          <el-pagination
              style="margin-right: 25px; float: right"
              small
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="PageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
          >
            hide-on-single-page
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" :visible.sync="dialogVisible" v-if="dialogVisible" :before-close="handleClose"
             :title="tipVale" width="30%">
    <el-form style="width:100%" ref="ruleFormRef" :model="bounceFrame" label-width="120px" :rules="rules">
      <el-form-item label="唯一标识id" v-if="false" prop="id">
        <el-input v-model.trim="bounceFrame.id" style="width: 90%" />
      </el-form-item>
      <el-form-item label="问题" prop="wenTi">
        <el-input v-model.trim="bounceFrame.wenTi" style="width: 90%" placeholder="输入问题" />
      </el-form-item>
      <el-form-item label="卦象" prop="guaXiang">
        <el-input v-model.trim="bounceFrame.guaXiang" style="width: 90%" placeholder="输入卦名" />
      </el-form-item>
      <el-form-item label="排盘图片" prop="paiPan">
<!--        <div v-if="bounceFrame.paiPan">-->
<!--          <img :src="this.imgUrl+bounceFrame.paiPan" style="max-width: 100px; max-height: 100px;" @click="handlePreview2">-->
<!--        </div>-->
        <el-upload
            style="display: inline-block"
            accept=".jpg,.png,.jpeg,JPG,JPEG"
            :action="this.imgUrl+'/liuYao/upload'"
            :on-success="handleSuccess"
            :on-error="handleError"
            :show-file-list="true"
            list-type="picture-card"
            :limit="1"
            :on-exceed="handleExceed"
            :on-preview="handlePreview"
            :file-list="fileList"

        >
          <el-icon><Plus /></el-icon>

        </el-upload>

      </el-form-item>
      <el-form-item label="断卦" prop="duanGua">
        <el-input v-model.trim="bounceFrame.duanGua" type="textarea" style="width: 90%" placeholder="请输入卦辞" />
      </el-form-item>
      <el-form-item label="起卦时间" prop="createTime">
        <div class="block">
          <el-date-picker
              v-model="bounceFrame.createTime"
              type="datetime"
              placeholder="选择起卦时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="beiZhu">
        <el-input v-model.trim="bounceFrame.beiZhu" type="textarea" style="width: 90%" placeholder="请输入备注" />
      </el-form-item>

    </el-form>
    <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false
                                        this.$refs.ruleFormRef.resetFields();">取消</el-button>
              <el-button type="primary" :loading="saveLoading" @click="saveOrUpdateLiuYao">
                保存
              </el-button>
            </span>
    </template>

  </el-dialog>
  <el-dialog v-model="dialogVisible2" :visible.sync="dialogVisible2" v-if="dialogVisible2" width="60%">
    <img :src="dialogImageUrl" style="width: 100%">
  </el-dialog>
  <el-dialog class="xiangQing" v-model="dialogVisible3" :visible.sync="dialogVisible3" v-if="dialogVisible3" width="60%">
    <p><span>所占之事：</span>{{this.detail.wenTi}}</p>
    <p><span>起卦时间：</span>{{this.detail.createTime}}</p>
    <p><span>卦象：</span>{{this.detail.guaXiang}}</p>
    <p><span>排盘：</span><img :src="this.imgUrl+this.detail.paiPan" style="width: 80%;"></p>
    <p><span>结果：</span>{{this.detail.duanGua}}</p>
    <p><span>备注：</span>{{this.detail.beiZhu}}</p>
  </el-dialog>
</template>

<script>
import { Refresh, Search, UploadFilled,Plus,zoomIn } from "@element-plus/icons-vue";
import request from "@/utils/request";
export default {
  name: "LiuYao",
  data() {
    return{
      // 总数据
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      pageSizes: [5, 10, 20, 50],
      // 默认每页显示的条数（可修改）
      PageSize: 10,

      //搜索参数
      wenTi: "",
      guaXiang: "",
      searchTime: "",

      tipVale: "",
      bounceFrame: {},
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogImageUrl: '',
      fileList: [],
      ipUrl: "",
      imgUrl: "",

      loading: true,
      deleteIds: [],
      saveLoading: false,
      rules: {
        wenTi: [
          { required: true, message: "请输入问题", trigger: "change" },
        ],
        guaXiang: [
          { required: true, message: "请输入卦名", trigger: "change" },
        ],
      },

      detail: {},
    }
  },
  components: {
    Search,
    Refresh,
    UploadFilled,
    Plus,
  },
  created() {
    this.getData()
    this.ipUrl=window.location.host
    this.imgUrl = "http://" + this.ipUrl.replace(/8808/g, "8088")
    console.log(this.imgUrl)
  },
  methods: {
    getData() {
      return request(
          {
            method: 'get',
            url: '/liuYao/findLiuYaoPage', // 目标地址
            params: {
              wenTi: this.wenTi,
              guaXiang: this.guaXiang,
              startTime: this.searchTime[0],
              endTime: this.searchTime[1],
              pageSize: this.PageSize,
              pageNum: this.currentPage
            }
          }
      ).then(res => {
        if (res.code == 'success') {
          this.tableData = [];
          for (let i = 0; i < res.data.records.length; i++) {
            this.tableData.push(res.data.records[i])
          }
          this.pageNum = res.data.pages
          this.totalCount = res.data.total
        }
        this.loading = false
      })
    },
    reset() {
      this.wenTi = "";
      this.guaXiang = "";
      this.searchTime = "";
      this.getData()
    },
    getRowKeys(row) {
      // id 是后台传递的每行信息唯一标识
      return row.id;
    },
    handleSelectionChange(val) {
      console.log(val)
      this.deleteIds = val.map(v => v.id)// [lid, name), [id, name)] => [id, idl
      console.log(this.deleteIds)
    },
    // 添加弹框弹出
    handleAdd() {
      this.tipVale = "添加"
      this.bounceFrame = {}
      this.dialogVisible = true
    },
    handleDetail: function (index, row) {
      this.tipVale = "详情"
      this.dialogVisible3 = true
      this.detail = row;
    },
    //编辑框弹出，编辑数据回显
    handleUpdate: function (index, row) {
      this.tipVale = "编辑"
      this.bounceFrame = {}
      this.dialogVisible = true
      this.bounceFrame = row
      console.log(this.bounceFrame.paiPan)
      let obj = {};
      obj.url = this.imgUrl+this.bounceFrame.paiPan;
      this.fileList.push(obj);
      console.log(this.fileList)
    },
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val
      // 点击每页显示的条数时，显示第一页
      this.getData(val, 1)
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val
      // 切换页码时，要获取每页显示的条数
      this.getData(this.PageSize, (val) * (this.pageSize))
    },
    //关闭对话框,清除输入的数据
    handleClose(done) {
      this.$refs.ruleFormRef.resetFields();
      this.fileList=[]
      done();
    },
    //更新/添加数据
    saveOrUpdateLiuYao(formName) {
      this.saveLoading = true
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          request.post("/liuYao/saveOrUpdateLiuYao", this.bounceFrame).then(res => {
            if (res.code == "success") {
              this.$message({
                type: "success",
                message: res.msg
              })
              this.saveLoading = false
            } else {
              this.$message({
                type: "error",
                message: res.msg
              })
              this.saveLoading = false
            }
          }).catch((err) => {
            this.$message({
              message: "异常信息：" + err,
              type: "error",
              showClose: true,
            });
            this.saveLoading = false
          }).finally(() => {
            this.saveLoading = false
            this.dialogVisible = false
            this.getData()
            this.$refs.ruleFormRef.resetFields();
          })
        } else {
          this.saveLoading = false
          console.log('error submit!!');
          return false;
        }
      });
    },
    deleteLiuYao() {
      if (!this.deleteIds.length) {
        this.$message.warning("请选择要删除的信息！")
        return
      }
      request.post("/liuYao/deleteLiuYao", this.deleteIds).then(res => {
        if (res.code == "success") {
          this.$message.success("删除成功")
          this.getData()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error("系统异常，请刷新后重试")
      }).finally(() => {
        this.$refs.tableData.clearSelection();
      })
    },
    handleSuccess(response, file, fileList) {
      debugger
        // 上传成功后，保存图片地址
      this.bounceFrame.paiPan = response;
      console.log(this.bounceFrame.paiPan)

    },
    handleError(error, file, fileList) {
      this.$message.error('上传失败');
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一张图片`);
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      console.log(file.url)
      this.dialogVisible2 = true;
    },
    // handlePreview2() {
    //   this.dialogImageUrl = this.imgUrl+this.bounceFrame.paiPan;
    //   console.log(this.bounceFrame.paiPan)
    //   this.dialogVisible3 = true;
    // },
  }
}
</script>

<style scoped>
@import "../../src/assets/css/views/commonStyle.css";
.xiangQing p{
  margin-top: 20px;
  font-size: 20px;
}
.xiangQing p span{
  font-size: larger;
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>