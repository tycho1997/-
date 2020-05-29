<template>
  <div class="dashboard-admin">
    <div class="dashboard-admin-top">
      <panel-group :summary="summary" v-if="summary!==null" />
    </div>
    <div class="dashboard-admin-center">
      <admin-info-card :adminInfo="adminInfo" class="admin-panel"></admin-info-card>
      <todo-list class="admin-panel"></todo-list>
    </div>

    <div class="dashboard-admin-bottom" >
      <raddar-chart class="admin-panel" :summary="summary" v-if="summary!==null" />
      <pie-chart class="admin-panel" :summary="summary" v-if="summary!==null" />
      <bar-chart class="admin-panel" :summary="summary" v-if="summary!==null" />
    </div>
  </div>
</template>

<script>
import AdminInfoCard from "./components/AdminInfoCard";
import AdminToDo from "./components/AdminToDo";
import AdminUserCard from "./components/AdminUserCard";
import AdminDataSourcesCard from "./components/AdminDataSourcesCard";
import AdminLineCard from "./components/AdminLineCard";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import PanelGroup from "./components/PanelGroup";
import TodoList from "./components/TodoList";

export default {
  name: "dashboard-admin",
  components: {
    AdminInfoCard,
    AdminToDo,
    AdminUserCard,
    AdminDataSourcesCard,
    AdminLineCard,
    RaddarChart,
    PieChart,
    BarChart,
    PanelGroup,
    TodoList
  },
  data() {
    return {
      summary: null,
      adminInfo: {}
    };
  },
  created() {
    this.adminInfo = JSON.parse(window.localStorage.getItem("userInfo")).data;
  },
  mounted() {
    this.axios
      .getSummary()
      .then(res => {
        this.$data.summary = res.data.data;
      })
      .catch(error => {
        console.log(error);
        this.$message({
          message: "获取汇总失败",
          type: "error"
        });
      });
  }
};
</script>

<style lang="scss" scoped>
.dashboard-admin {
  display: flex;
  flex-direction: column;

  .dashboard-admin-top {
    .admin-panel {
      width: 22.5%;
      min-width: 300px;
    }
  }
  .dashboard-admin-center {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 32px;
    width: 100%;
    .admin-panel {
      width: 45%;
    }
  }
  .dashboard-admin-bottom {
    width: 100%;
    margin-top: 15px;
    padding: 32px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    .admin-panel {
      min-width: 420px;
      width: 30%;
      margin: 1.5%;
    }
  }
}
</style>