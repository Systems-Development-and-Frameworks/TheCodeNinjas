import NewsItem from "./NewsItem.vue";

const newsItem = {
  id: 1,
  title: "Test News Item",
  votes: 0
};

export default {
  title: "NewsItem",
  component: NewsItem,
  argTypes: {
    update: { action: "update" },
    remove: { action: "remove" }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NewsItem },
  template: '<NewsItem @update="update" @remove="remove" v-bind="$props" />'
});

export const Primary = Template.bind({});
Primary.args = {
  newsItem: newsItem
};
