<template>
  <div class="page">
    <p class="page_title">Twitch 弹幕姬</p>
  </div>
</template>
<script>
export default {
  name: 'backend-components-index'
}
</script>
<style lang="scss" scoped>
.page {
  background-blend-mode: multiply,multiply;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .page_title {
    font-size: 20px;
    color: #303133;
  }
}
</style>
