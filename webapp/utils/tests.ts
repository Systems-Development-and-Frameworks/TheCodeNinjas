import Vue, { VueConstructor } from 'vue'

import Vuex from 'vuex'
import { useAccessor } from 'typed-vuex'
import { createLocalVue, mount } from '@vue/test-utils'
import { storePattern } from '~/store'

export const localVue = createLocalVue()
localVue.use(Vuex)

export function setupWrapperAndStore(
  component: VueConstructor<Vue>,
  mockedData = {}
) {
  const store = new Vuex.Store(storePattern)
  const storeAccessor = useAccessor(store, storePattern)

  const wrapper = mount(component, {
    localVue,
    mocks: {
      $accessor: storeAccessor,
    },
    data() {
      return mockedData
    },
  })

  return { wrapper, storeAccessor }
}
