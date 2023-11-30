<template lang="pug">
observer.block.absolute.overlay.flex.items-center.justify-center.overflow-hidden(v-if="isObserving", :threshold="0.01", @visible="onVisible", @hidden="onHidden")
  div(:class="!loadError && 'animate-blink'")
    | {{ loadError ? loadError : `#${tokenIndex + 1}` }}
  template(v-if="render")
    iframe.absolute.overlay.object-contain.pointer-events-none(v-show="visible", :src="iframeSrc", @load="onLoad")    
</template>

<script>
import Observer from './Observer.vue'
import doawIframeUrl from '../utils/doawIframeUrl.js'

export default {
  name: 'NFTThumbIframe',
  props: ['id'],
  components: { Observer },
  data () {
    return {
      render: false,
      visible: false,
      imgSrc: undefined,
      imgLoaded: false,
      isObserving: false,
      waitToObserve: undefined,
      visibleTimeout: null,
      loadError: undefined
    }
  },
  computed: {
    iframeSrc () {
      return doawIframeUrl({ tokenId: this.id, muted: true })
    },
    tokenIndex () {
      return this.$store.state.nfts?.findIndex(nft => nft.tokenId === this.id)
    }
  },
  methods: {
    onVisible () {   
      console.log('visible')
      const reveal = () => {
        this.render = true
        // this.loadImage() 
      }

      if (!this.imgLoaded) {
        // add timeout to throttle fast scrolling
        this.visibleTimeout = setTimeout(reveal, 300)
      } else {
        reveal()
      }
    },
    onHidden () {
      clearTimeout(this.visibleTimeout)
      this.render = false
      this.visible = false
    },
    // loadImage () {
    //   if (this.imgSrc) return
    //   // this.$store.dispatch('getCableImage', { id: this.id.toString() })
    //   //   .then(imgSrc => this.imgSrc = imgSrc)

    //   this.imgSrc = `${import.meta.env.VITE_SERVER}/get/img/${this.id}`
    // },
    onLoad () {
      setTimeout(() => { this.visible = true }, 300)
    },
    onError (e) {
      console.log(e)
      this.loadError = '⚠️'
    }
  },
  mounted () {
    setTimeout(() => { this.isObserving = true }, 100)
  },
  watch: {
    '$route' (to, from) {
      if (to.query.sort !== from.query.sort) {
        // refresh observer because toggling newest/oldest sort causes it to freeze out on false :(
        this.isObserving = false
        this.waitToObserve = setTimeout(() => { this.isObserving = true }, 100)
      }
    }
  }
}
</script>

<style>
</style>
  