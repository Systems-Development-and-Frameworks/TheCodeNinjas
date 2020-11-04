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
            <td colspan="4" id="checkId" class="uk-text-center">
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
  </div>
</template>

<script lang="ts">
import NewsItem from "@/components/NewsItem.vue";
import { NewsItemModel } from "@/models/news-item.model";
import { computed, defineComponent, ref, toRefs } from "@vue/composition-api";

export default defineComponent({
  name: "NewsList",
  components: {
    NewsItem
  },
  props: {
    newsItems: {
      required: true,
      default() {
        return [
          new NewsItemModel({
            id: 1,
            title: "Hackernews Nr 1",
            votes: 0
          }),
          new NewsItemModel({
            id: 2,
            title: "Hackernews Nr 2",
            votes: 0
          }),
          new NewsItemModel({
            id: 3,
            title: "Hackernews Nr 3",
            votes: 0
          })
        ];
      }
    }
  },
  setup(props: { newsItems: NewsItemModel[] }) {
    const newsTitle = ref("");
    const { newsItems } = toRefs(props);

    let currentId = newsItems.value.length;
    const hasNewsItems = computed(() => newsItems.value.length > 0);
    const newsItemsSorted = computed(() => newsItems.value);

    const sortDescending = ref(true);


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
        .sort((a, b) => a.compareTo(b));
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
        a.compareTo(b)
      );
      newsTitle.value = "";
    }

    return {
      updateNewsItem,
      removeNewsItem,
      createNewsItem,
      newsTitle,
      hasNewsItems,
      newsItemsSorted
    };
  }
});
</script>
