import { createLocalVue, mount, shallowMount} from '@vue/test-utils'
import NewsList from "@/components/NewsList.vue";
import NewsItem from "@/components/NewsItem.vue";
import { NewsItemModel } from "@/models/news-item.model";
import CompositionApi from '@vue/composition-api'
import App from "@/App.vue";
import Vue from "vue";



// npm run test:unit
// npm run lint --fix

// reddit.com/r/vuejs/comments/iipl4k/how_do_you_test_compositionapi_in_jest/



describe("NewsList", () => {

  let localVue: any;
  let newsItemsMockup: any = [
    new NewsItemModel({
      id: 1,
      title: "Hackernews Nr 1",
      votes: 2
    }),
    new NewsItemModel({
      id: 2,
      title: "Hackernews Nr 2",
      votes: 1
    }),
    new NewsItemModel({
      id: 3,
      title: "Hackernews Nr 3",
      votes: 0
    })
  ]

  
    beforeEach(() => {
      localVue = createLocalVue();
      localVue.use(CompositionApi);
      // localVue.use(VueRouter);
    });

    it("check App-instance-existance and newsList-instance-existance", () => {
      let propsData: any = { newsItems: [] };
      const wrapper = mount(NewsList, {
        propsData: propsData,
        localVue: localVue
      });
      expect(wrapper).toBeTruthy();
    })

    it("check if renders news item for each item in list if list empty", () => {
      let propsData: any = { newsItems: [] };
      const wrapper = mount(NewsList, {
        propsData: propsData,
        localVue: localVue
      })
      expect(wrapper.findAllComponents(NewsItem).length).toBe(0);
    })

    it("check if renders news item for each item in list if list empty and filled again", async () => {
      let propsData: any = { newsItems: [] };
      const wrapper = mount(NewsList, {
        propsData: propsData,
        localVue: localVue
      })
      await wrapper.setProps({
        newsItems: newsItemsMockup
      });
      expect(wrapper.findAllComponents(NewsItem).length).toBe(3);
    })

    it("renders empty list message", () => {
      const emptyMessage = "No News in the list!";
      let propsData: any = { newsItems: [] };

      const wrapper = mount(NewsList, {
        propsData: propsData,
        localVue: localVue
      })
      expect(wrapper.find("#checkId").text()).toMatch(emptyMessage);
    })

    it("check order: check initial order before clicking the toggle-button", async () => {
      let propsData: any = {
        newsItems: newsItemsMockup
      };
      const wrapper = mount(NewsList, {
        propsData: propsData,
        localVue: localVue
      });
      await Vue.nextTick();
      expect(wrapper.findAllComponents(NewsItem).wrappers.map(a => a.props().newsItem.id)).toStrictEqual(newsItemsMockup.map((b:any) => b.id));
    })


    // it("toggles between ascending and descending order", () => async () => {
    //   let propsData: any = {
    //     newsItems: newsItemsMockup
    //   };
    //   const wrapper = mount(NewsList, {
    //     propsData: propsData,
    //     localVue: localVue
    //   });

    //   await Vue.nextTick();
    //   expect(wrapper.findAllComponents(NewsItem).wrappers.map(a => a.props().newsItem.id)).toStrictEqual(newsItemsMockup.map((b:any) => b.id).reverse());
    // })



});