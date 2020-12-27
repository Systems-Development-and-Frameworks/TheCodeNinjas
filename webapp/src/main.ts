import Vue from "vue";
import App from "./App.vue";
import VueApollo from "vue-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";

Vue.config.productionTip = false;
Vue.use(VueApollo);

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  //uri: "https://news-list-backend.herokuapp.com/graphql",
  headers: {
    authorization: `Bearer ${window.localStorage.getItem("token")}`
  }
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache
});

new Vue({
  apolloProvider: new VueApollo({
    defaultClient: apolloClient
  }),
  render: h => h(App)
}).$mount("#app");
