<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  import "@/assets/css/base.css"
  import "@/assets/css/product.css"
  import "@/assets/css/login.css"
  import "@/assets/css/checkout.css"

  export default {
    name: 'App'
  }
</script>
<style>
  @font-face {
    font-family: 'iconfont';  /* project id 607708 */
    src: url('//at.alicdn.com/t/font_607708_3pidwzwkle0icnmi.eot');
    src: url('//at.alicdn.com/t/font_607708_3pidwzwkle0icnmi.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_607708_3pidwzwkle0icnmi.woff') format('woff'),
    url('//at.alicdn.com/t/font_607708_3pidwzwkle0icnmi.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_607708_3pidwzwkle0icnmi.svg#iconfont') format('svg');
  }

  .icon {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
