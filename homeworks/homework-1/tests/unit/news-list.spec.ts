import { mount } from "@vue/test-utils";
import NewsList from "@/components/NewsList.vue";

describe("NewsList.vue", () => {
  it("renders news list string", () => {
    const wrapper = mount(NewsList);
    expect(wrapper.text()).toMatch("News List");
  });
});
