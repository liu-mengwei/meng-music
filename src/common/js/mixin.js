import {mapGetters, mapActions} from 'vuex';
import animations from 'create-keyframe-animation'

//当迷你播放器出现时处理滚动高度问题
export const miniPlayMixin = {
  mounted(){
    this.handleMiniPlay();
  },

  activated(){
    this.handleMiniPlay();
  },

  watch: {
    playList(){
      this.handleMiniPlay();
    }
  },

  computed: {
    ...mapGetters(['playList'])
  },

  methods: {
    handleMiniPlay(){
      throw new Error('组件需要覆盖handleMiniPlay方法');
    }
  }
};


//显示更多标题的动画
export const showMoreMixin = {
  //获取wrapper和content宽度
  data(){
    return {
      showMoreIndex: -1
    }
  },

  methods: {
    getWrapperAndContent(){
      throw new Error('组件需要覆盖getWrapperContentWidth方法')
    },

    startShowMoreAnimation({contentEl, wrapperEl}){
      let wrapperWidth = wrapperEl.width();
      let contentWidth = contentEl.width();

      if (wrapperWidth > contentWidth) {
        return;
      }

      setTimeout(function () {
        wrapperEl.css('text-overflow', 'inherit');
      }, 2000);

      let timeRatio = (contentWidth + wrapperWidth) / contentWidth;
      let step1 = {
        0: {
          transform: `translateX(0)`
        },
        100: {
          transform: `translateX(${-contentWidth}px)`
        }
      };

      let step2 = {
        0: {
          transform: `translateX(${wrapperWidth}px)`
        },
        100: {
          transform: `translateX(${-contentWidth}px)`
        }
      };

      this.showMoreIndex = Math.floor(Math.random() * 10000);
      let name1 = 'step1' + this.showMoreIndex;
      let name2 = 'step2' + this.showMoreIndex;
      //设置动画
      animations.registerAnimation({
        name: name1,
        animation: step1,
        presets: {
          delay: 2000,
          duration: 10000,
          easing: 'linear'
        }
      });
      animations.registerAnimation({
        name: name2,
        animation: step2,
        presets: {
          duration: 10000 * timeRatio,
          easing: 'linear',
          iterations: 'infinite'
        }
      });

      animations.runAnimation(contentEl, name1, function () {
        animations.runAnimation(contentEl, name2);
      });
    },

    endShowMoreAnimation({wrapperEl} = {}){
      animations.unregisterAnimation('step1' + this.showMoreIndex);
      animations.unregisterAnimation('step2' + this.showMoreIndex);
      if (wrapperEl) {
        wrapperEl.css('text-overflow', 'ellipsis');
      }
    }
  }
};

export const searchMixin = {
  data(){
    return {
      query: ''
    }
  },

  methods: {
    inputBlur(){
      this.$refs.searchBox.blur();
    },

    onQuery(query){
      this.query = query;
    },

    insertSearchHistory(){
      this.saveSearch(this.query);
    },

    selectHotKey(hotkey){
      this.$refs.searchBox.setQuery(hotkey);
      this.saveSearch(hotkey);
    },

    remove(search){
      this.removeSearch(search);
    },

    ...mapActions(['removeSearch', 'saveSearch'])
  }
};
