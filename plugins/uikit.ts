import { Context, Plugin } from '@nuxt/types'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

// @ts-ignore
UIkit.use(Icons)

interface UIkitAccessor {
  $UIkit: any
}

const uikitPlugin: Plugin = (context: Context, inject) => {
  ;(context as Context & UIkitAccessor).$UIkit = UIkit
  inject('UIkit', UIkit)
}

export default uikitPlugin
