<template>
  <div class="switches">
    <div class="switch" :class="{'active': index === currentIndex}" v-for="(item, index) in switches"
         @click="selectTab(index)">
      <span class="switch-name">{{item}}</span>
    </div>
  </div>


</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      currentIndex: {
        type: Number,
        default: 0
      },
      switches: {
        type: Array,
        default: []
      }
    },

    methods: {
      selectTab(index){
        this.$emit('selectTab', index);
      }
    }

  }
</script>

<style rel="stylesheet/scss" scoped lang="scss">
  .switches {
    display: flex;

    .switch {
      padding: 0.1rem 0.1rem;
      flex: 1;
      text-align: center;
      border-left: 1px solid rgba(150, 150, 150, 0.2);
      border-top: 1px solid rgba(150, 150, 150, 0.2);
      border-bottom: 1px solid rgba(150, 150, 150, 0.2);
      &:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      &:last-child {
        border-right: 1px solid rgba(150, 150, 150, 0.2);
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      &.active {
        background: rgb(60, 60, 60);
      }
    }
  }


</style>
