import Vue from 'vue'
import store from'../../vuex/index';
export const checkJurisdiction = (key) => {
    let jurisdictionList = {...store.state.jurisdiction.jurisdiction}
    key = key.substr(0, key.length - 1).substr(1)
    if (jurisdictionList[key] == 1) {
        return true
    } else {
        return false
    }
}

Vue.directive('permission', {
    inserted(el, binding) {
        let permission = binding.expression
        if (permission) {
            let hasPermission = checkJurisdiction(permission)
            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error('需要传key')
        }
    }
})