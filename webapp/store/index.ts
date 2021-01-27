import {
  getAccessorType,
  getterTree,
  mutationTree,
  actionTree,
} from 'typed-vuex'
import * as auth from '~/store/auth'

export const state = () => ({})
export const getters = getterTree(state, {})
export const mutations = mutationTree(state, {
  initialiseStore() {},
})
export const actions = actionTree({ state, getters, mutations }, {})
export const storePattern = {
  state,
  getters,
  mutations,
  actions,
  modules: {
    auth,
  },
}
export const accessorType = getAccessorType(storePattern)
