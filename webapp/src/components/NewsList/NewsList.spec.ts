import { createLocalVue, mount } from "@vue/test-utils";
import NewsList from "@/components/NewsList/NewsList.vue";
import NewsItem from "@/components/NewsItem/NewsItem.vue";
import { NewsItemModel } from "@/models/news-item.model";

const newsItemsMock = [
  new NewsItemModel({
    id: "1",
    title: "Hackernews Nr 1",
    votes: 1,
    author: {
      id: "1",
      name: "Christoph Stach",
      email: "s0555912@htw-berlin.de"
    }
  }),
  new NewsItemModel({
    id: "2",
    title: "Hackernews Nr 2",
    votes: 2,
    author: {
      id: "1",
      name: "Christoph Stach",
      email: "s0555912@htw-berlin.de"
    }
  }),
  new NewsItemModel({
    id: "3",
    title: "Hackernews Nr 3",
    votes: 3,
    author: {
      id: "1",
      name: "Christoph Stach",
      email: "s0555912@htw-berlin.de"
    }
  })
];

describe("NewsList", () => {
  const localVue = createLocalVue();

  it("exists", () => {
    const wrapper = mount(NewsList, {
      localVue: localVue
    });

    expect(wrapper).toBeTruthy();
  });

  it("renders no news items", () => {
    const wrapper = mount(NewsList, {
      localVue: localVue,
      data() {
        return { newsItems: [] };
      }
    });

    expect(wrapper.findAllComponents(NewsItem)).toHaveLength(0);
  });

  it("renders news item", () => {
    const wrapper = mount(NewsList, {
      localVue: localVue,
      data() {
        return { newsItems: newsItemsMock };
      }
    });

    expect(wrapper.findAllComponents(NewsItem)).toHaveLength(3);
  });

  it("renders empty list message", () => {
    const emptyMessage = "No News in the list!";

    const wrapper = mount(NewsList, {
      localVue: localVue,
      data() {
        return { newsItems: [] };
      }
    });

    expect(wrapper.text()).toMatch(emptyMessage);
  });

  it("check order: check initial order before clicking the toggle-button", async () => {
    const wrapper = mount(NewsList, {
      localVue: localVue,
      data() {
        return { newsItems: newsItemsMock };
      }
    });

    const votes = wrapper
      .findAll("[data-test-votes]")
      .wrappers.map(a => a.text());

    expect(votes).toStrictEqual(["3", "2", "1"]);
  });

  it("toggles between ascending and descending order", async () => {
    const wrapper = mount(NewsList, {
      localVue: localVue,
      data() {
        return { newsItems: newsItemsMock };
      }
    });

    const button = wrapper.find("[data-test-toggle]");
    await button.trigger("click");

    const votesAsc = wrapper
      .findAll("[data-test-votes]")
      .wrappers.map(a => a.text());

    expect(votesAsc).toStrictEqual(["1", "2", "3"]);

    await button.trigger("click");

    const votesDesc = wrapper
      .findAll("[data-test-votes]")
      .wrappers.map(a => a.text());

    expect(votesDesc).toStrictEqual(["3", "2", "1"]);
  });
});
