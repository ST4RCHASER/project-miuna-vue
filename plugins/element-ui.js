import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(Element, { locale })
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import * as LocationPicker from 'vue2-location-picker'
Vue.use(LocationPicker, {
    installComponents: false, // If true, create it globally
})