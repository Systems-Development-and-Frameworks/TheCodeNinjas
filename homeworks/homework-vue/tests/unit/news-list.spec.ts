import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import NewsList from "@/components/NewsList.vue";
import NewsItem from "@/components/NewsItem.vue";
import { NewsItemModel } from "@/models/news-item.model";
import CompositionApi from "@vue/composition-api";
import App from "@/App.vue";
import Vue from "vue";

// npm run test:unit
// npm run lint --fix

// reddit.com/r/vuejs/comments/iipl4k/how_do_you_test_compositionapi_in_jest/

describe("NewsList", () => {
  let localVue: any;
  const newsItemsMockup: any = [
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
  ];

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(CompositionApi);
    // localVue.use(VueRouter);
  });

  it("check App-instance-existance and newsList-instance-existance", () => {
    const propsData: any = { newsItems: [] };
    const wrapper = mount(NewsList, {
      propsData: propsData,
      localVue: localVue
    });
    expect(wrapper).toBeTruthy();
  });

  it("check if renders news item for each item in list if list empty", () => {
    const propsData: any = { newsItems: [] };
    const wrapper = mount(NewsList, {
      propsData: propsData,
      localVue: localVue
    });
    expect(wrapper.findAllComponents(NewsItem).length).toBe(0);
  });

  // it("check if renders news item for each item in list if list empty and filled again", async () => {
  //   const propsData: any = { newsItems: [] };
  //   const wrapper = mount(NewsList, {
  //     propsData: propsData,
  //     localVue: localVue
  //   });
  //   await wrapper.setProps({
  //     newsItems: newsItemsMockup
  //   });
  //   expect(wrapper.findAllComponents(NewsItem).length).toBe(3);
  // });

  // it("renders empty list message", () => {
  //   const emptyMessage = "No News in the list!";
  //   const propsData: any = { newsItems: [] };

  //   // kompletter html-text der Komponente
  //   const wrapper = mount(NewsList, {
  //     propsData: propsData,
  //     localVue: localVue
  //   });

  //   // .toMatch checked auch auf eventuellen SubString (!= equal)
  //   expect(wrapper.text()).toMatch(emptyMessage); // data-test-... als attribut (/css-class) (keine id)
  // });

  // it("check order: check initial order before clicking the toggle-button", async () => {
  //   const propsData: any = {
  //     newsItems: newsItemsMockup
  //   };
  //   const wrapper = mount(NewsList, {
  //     propsData: propsData,
  //     localVue: localVue
  //   });
  //   await Vue.nextTick();

  //   // findAll returns Wrapper-Array -> darauf ist keine map-function definiert, deshalb
  //   // wrappers-aufruf, da vue-test-utils-implementierung
  //   expect(
  //     wrapper.findAll(".data-test-votes").wrappers.map(a => a.text())
  //   ).toStrictEqual(["2", "1", "0"]);
  // });

  // it("toggles between ascending and descending order", async () => {
  //   const propsData: any = {
  //     newsItems: newsItemsMockup
  //   };
  //   const wrapper = mount(NewsList, {
  //     propsData: propsData,
  //     localVue: localVue
  //   });

  //   const button: any = wrapper.find(".data-test-toggle");
  //   await button.trigger("click");

  //   const votes: any = wrapper
  //     .findAll(".data-test-votes")
  //     .wrappers.map(a => a.text());

  //   expect(votes).toStrictEqual(["0", "1", "2"]);
  // });
});
