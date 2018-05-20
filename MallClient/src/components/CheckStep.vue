<template>
  <!-- 交易步骤-->
  <div class="check-step">
    <ul>
      <li v-for="stepItem in checkStep" :class="{'cur':stepItem.stepNum <= step}">{{stepItem.stepName}}</li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: "CheckStep",
    props: {
      step: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        checkStep: [
          {
            stepName: "确认地址",
            stepNum: 1
          },
          {
            stepName: "订单确认",
            stepNum: 2
          },
          {
            stepName: "付款",
            stepNum: 3
          },
          {
            stepName: "查看订单",
            stepNum: 4
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
