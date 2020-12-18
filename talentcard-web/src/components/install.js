import Vue from 'vue'
import AjaxTable from './ajaxTable'
import AjaxForm from './ajaxForm'

const components = {
  AjaxTable,
  AjaxForm
}

const install = (Vue) => {
  Object.keys(components).forEach(component => Vue.component(component, components[component]))
}

install(Vue, true);

export default {
  install,
  ...components
}