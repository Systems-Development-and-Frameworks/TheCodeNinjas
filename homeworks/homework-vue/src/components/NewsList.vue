<template>
  <div class="uk-container uk-margin-top">
    <h1 class="uk-heading-xlarge uk-text-center">News List</h1>

    <div class="news-items-wrapper">
      <table class="uk-table uk-table-striped uk-table-medium uk-table-middle">
        <thead>
          <tr>
            <th class="uk-table-shrink">Id</th>
            <th class="uk-table-expand">Title</th>
            <th class="uk-table-shrink">Votes</th>
            <th colspan="3" class="uk-table-shrink"></th>
          </tr>
        </thead>
        <tbody v-if="hasNewsItems">
          <news-item
            v-for="item in newsItemsSorted"
            :key="item.id"
            :newsItem="item"
            @update="updateNewsItem"
            @remove="removeNewsItem"
          />
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="uk-text-center">
              No News in the list!
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <form @submit.prevent="createNewsItem" class="uk-form-large">
      <div class="uk-flex">
        <div class="uk-flex-1">
          <input
            class="uk-input"
            v-model="newsTitle"
            placeholder="Please enter title"
          />
        </div>
        <div>
          <button type="submit" class="uk-button uk-button-primary">
            Create
          </button>
        </div>
      </div>
    </form>
    <button
      class="uk-button uk-button-primary data-test-toggle"
      @click="toggle($event)"
    >
      Toggle-Sorting-Order
    </button>
  </div>
</template>

<script lang="ts">
import NewsItem from "@/components/NewsItem.vue";
import { NewsItemModel } from "@/models/news-item.model";
import {
  computed,
  defineComponent,
  ref,
  toRefs,
  watch
} from "@vue/composition-api";

export default defineComponent({
  name: "NewsList",
  components: {
    NewsItem
  },
  setup(props: { newsItems: NewsItemModel[] }, context) {
    // props: { newsItems: NewsItemModel[]}
    const newsTitle = ref("");
    // const { newsItems } = toRefs(props);
    const newsItems = ref(props.newsItems);
    // const newsItems = ref();

    const sortDescending = ref(true);

    let currentId = newsItems.value.length;
    const hasNewsItems = computed(() => newsItems.value.length > 0);

    // const newsItemsSorted = computed(() => {
    //   console.log("check");
    //   console.log(sortDescending.value);
    //   return newsItems.value.reverse();
    // });

    watch(sortDescending, (oldValue: any, newValue: any) => {
      newsItems.value.reverse();
    });

    const newsItemsSorted = computed(() => newsItems.value);

    function toggle(event: any) {
      console.log(
        "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
      );
      sortDescending.value = !sortDescending.value;
    }

    function updateNewsItem(newsItem: NewsItemModel) {
      newsItems.value = newsItems.value
        .map(item => {
          if (item.id !== newsItem.id) {
            return item;
          }

          return new NewsItemModel({
            ...item,
            votes: newsItem.votes
          });
        })
        .sort((a, b) => a.compareToDescending(b));
    }

    function removeNewsItem(id: number) {
      newsItems.value = newsItems.value.filter(item => item.id !== id);
    }

    function createNewsItem() {
      currentId++;
      const newItem = new NewsItemModel({
        id: currentId,
        title: newsTitle.value,
        votes: 0
      });

      newsItems.value = [...newsItems.value, newItem].sort((a, b) =>
        sortDescending.value
          ? a.compareToDescending(b)
          : a.compareToAscending(b)
      );
      newsTitle.value = "";
    }

    return {
      updateNewsItem,
      removeNewsItem,
      createNewsItem,
      newsTitle,
      hasNewsItems,
      newsItemsSorted,
      sortDescending,
      toggle
    };
  }
});
</script>
