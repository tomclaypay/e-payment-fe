import Vue from 'vue'
import lang from 'element-ui/lib/locale/lang/vi'
import locale from 'element-ui/lib/locale'
import {
  Icon,
  Input,
  InputNumber,
  Form,
  FormItem,
  Notification,
  Loading,
  Step,
  Steps
} from 'element-ui'

locale.use(lang)
Vue.use(Icon)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Loading)
Vue.use(Steps)
Vue.use(Step)

Vue.prototype.$notify = Notification
