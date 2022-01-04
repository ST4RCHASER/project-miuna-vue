<template>
  <div style="height: 100%">
    <NavBar />
    <el-main style="height: 100%">
      <transition name="slide-fade" mode="out-in" style="height: 100%">
        <Nuxt />
      </transition>
    </el-main>
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

/* ---------------------------------------------------
    CONTENT STYLE
----------------------------------------------------- */
#__nuxt,#__layout{
  height: 100%;
}
.slide-fade-enter-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-fade-leave-active {
  transition: all 0.25s;
  overflow: hidden;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10%);
  opacity: 0;
  overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
  overflow: hidden;
}

.fade-enter-active {
  transition-delay: 0.25s;
  overflow: hidden;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  overflow: hidden;
}

*,
*::before,
*::after {
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

#titlebar {
  display: block;
  position: fixed;
  height: 21px;
  width: calc(100% - 2px);
  background: #409eff;
  z-index: 999999;
}

#titlebar {
  padding: 3px;
}

#titlebar #drag-region {
  width: 100%;
  height: 100%;
  -webkit-app-region: drag;
}

#titlebar {
  color: #fff;
}

#titlebar #drag-region {
  display: grid;
  grid-template-columns: auto 138px;
}

#window-title {
  grid-column: 1;
  display: flex;
  align-items: center;
  margin-left: 8px;
  overflow-x: hidden;
  font-family: 'Segoe UI', sans-serif;
  font-size: 10px;
}

#window-title span {
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

#window-controls {
  display: grid;
  grid-template-columns: repeat(3, 46px);
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  font-family: 'Segoe MDL2 Assets';
  font-size: 8px;
}

#window-controls {
  -webkit-app-region: no-drag;
}

#window-controls .button {
  grid-row: 1 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

#window-controls .button {
  user-select: none;
  cursor: default;
  color: rgb(255, 255, 255);
}

#window-controls .button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

#window-controls #min-button {
  grid-column: 1;
}

#window-controls #max-button,
#window-controls #restore-button {
  grid-column: 2;
}

#window-controls #restore-button {
  display: none;
}

#window-controls #close-button {
  grid-column: 3;
}

#window-controls #close-button:hover {
  background: #e81123;
}
.tie {
  padding-bottom: 21px;
}
html {
  overflow-x: hidden;
}
</style>

<script>
export default {
  name: 'app',
  mounted() {},
}
</script>