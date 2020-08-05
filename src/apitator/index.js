import RequestContainer from './RequestContainer'
export default {
  options: {},
  install (Vue, options) {
    this.options = options

    Vue.prototype.$apitator = new RequestContainer(Vue, options)
  }
}
