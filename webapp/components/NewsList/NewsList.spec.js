import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import NewsItem from '../NewsItem/NewsItem.vue'
import NewsList from './NewsList.vue'
import { NewsItemModel } from '~/models/news-item.model'

const newsItemsMock = [
  new NewsItemModel({
    id: '1',
    title: 'Hackernews Nr 1',
    votes: 1,
    author: {
      id: '1',
      name: 'Christoph Stach',
      email: 's0555912@htw-berlin.de',
    },
  }),
  new NewsItemModel({
    id: '2',
    title: 'Hackernews Nr 2',
    votes: 2,
    author: {
      id: '1',
      name: 'Christoph Stach',
      email: 's0555912@htw-berlisn.de',
    },
  }),
  new NewsItemModel({
    id: '3',
    title: 'Hackernews Nr 3',
    votes: 3,
    author: {
      id: '1',
      name: 'Christoph Stach',
      email: 's0555912@htw-berlin.de',
    },
  }),
]

describe('NewsList', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  let actions
  let getters
  let store

  const setupStoreWrapper = (data) => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            loading: false,
            currentUser: null,
            token: null,
            login: true,
          }),
          actions,
          getters,
        },
      },
    })
    return shallowMount(NewsList, { store, localVue, data })
  }

  const setupWrapper = (d={}) => {
    const $accessor = {auth: {loading: false, currentUser: null, token: null}}
    return mount(NewsList, { $accessor, localVue, data(){ return d }})
  }

  beforeEach(() => {
    getters = {
      isLoggedIn: () => true,
    }
  })

  it('exists', () => {
    const wrapper = setupWrapper

    expect(wrapper).toBeTruthy()
  })

  it('renders no news items', () => {

    const wrapper = mount(NewsList, {
      mocks: {
        $accessor: {
          auth: {loading: false, currentUser: null, token: null}
        }
      },
      localVue, 
      data(){ 
        return { newsItems:[]} 
      }
    })

    expect(wrapper.findAllComponents(NewsItem)).toHaveLength(0)
  })

  it('renders news item', () => {

    const wrapper = mount(NewsList, {
      mocks: {
        $accessor: {
          auth: {loading: false, currentUser: null, token: null, isLoggedIn: true}
        }
      },
      localVue, 
      data(){ 
        return { newsItemsMock} 
      }
    })
    
    // wrapper.vm.$children[0].$props.open = true
    //wrapper.vm.$children.map(a => a.$props = {$accessor: {auth: {loading: false, currentUser: null, token: null}}})
    //wrapper.setData({$accessor: {auth: {loading: false, currentUser: null, token: null}}})

    expect(wrapper.findAllComponents(NewsItem)).toHaveLength(3)
  })

  // it('renders empty list message', () => {
  //   const emptyMessage = 'No News in the list!'

  //   const wrapper = mount(NewsList, {
  //     mocks: {
  //       $accessor: {
  //         auth: {loading: false, currentUser: null, token: null, login: true}
  //       }
  //     },
  //     localVue, 
  //     data(){ 
  //       return { newsItems:[]} 
  //     }
  //   })

  //   expect(wrapper.text()).toMatch(emptyMessage)
  // })

  // it('check order: check initial order before clicking the toggle-button', () => {
  //   const wrapper = mount(NewsList, {
  //     mocks: {
  //       $accessor: {
  //         auth: {loading: false, currentUser: null, token: null, login: true}
  //       }
  //     },
  //     localVue, 
  //     data(){ 
  //       return { newsItems:[newsItemsMock]} 
  //     }
  //   })

  //   const votes = wrapper
  //     .findAll('[data-test-votes]')
  //     .wrappers.map((a) => a.text())

  //   expect(votes).toStrictEqual(['3', '2', '1'])
  // })

  // it('toggles between ascending and descending order', async () => {
  //   const wrapper = mount(NewsList, {
  //     mocks: {
  //       $accessor: {
  //         auth: {loading: false, currentUser: null, token: null, login: true}
  //       }
  //     },
  //     localVue, 
  //     data(){ 
  //       return { newsItems:[newsItemsMock]} 
  //     }
  //   })

  //   const button = wrapper.find('[data-test-toggle]')
  //   await button.trigger('click')

  //   const votesAsc = wrapper
  //     .findAll('[data-test-votes]')
  //     .wrappers.map((a) => a.text())

  //   expect(votesAsc).toStrictEqual(['1', '2', '3'])

  //   await button.trigger('click')

  //   const votesDesc = wrapper
  //     .findAll('[data-test-votes]')
  //     .wrappers.map((a) => a.text())

  //   expect(votesDesc).toStrictEqual(['3', '2', '1'])
  // })
})
