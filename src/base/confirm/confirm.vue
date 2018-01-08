<template>
  <transition name="scale">
    <div class="confirm" v-show="showConfirm" @click.stop="cancel">
      <div class="content-wrapper">
        <div class="confirm-content" v-show="showConfirm">
          <div class="confirm-text">{{confirmText}}</div>
          <div class="confirm-operators">
            <div class="cancel" @click.stop="cancel">取消</div>
            <div class="ok" @click.stop="confirm">确定</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return {
        showConfirm: false
      }
    },

    props: {
      confirmText: {
        type: String,
        default: ''
      }
    },

    methods: {
      cancel(){
        this.$emit('cancel');
        this.toggle();
      },

      confirm(){
        this.$emit('confirm');
        this.toggle();
      },

      toggle(){
        this.showConfirm = !this.showConfirm;
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/variable";

  .confirm {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 500;

    &.scale-enter-active {
      animation: fade 0.3s ease;
      .confirm-content {
        animation: scale 0.3s ease;
      }
    }

    .content-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;

      .confirm-content {
        background: $color-background;
        text-align: center;
        border-radius: 0.06rem;

        .confirm-text {
          text-align: center;
          padding: 0.28rem 0.25rem;
        }
        .confirm-operators {
          border-top: 1px solid rgba(80, 80, 80, 0.3);
          display: flex;

          .cancel, .ok {
            padding: 0.15rem 0.2rem;
            text-align: center;
            flex: 1 1 auto;
            border-right: 1px solid rgba(80, 80, 80, 0.3);
          }
        }
      }
    }
  }

  @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes scale {
    0% {
      transform: scale(0);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

</style>
