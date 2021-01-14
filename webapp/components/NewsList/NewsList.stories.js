import NewsList from './NewsList.vue'

export default {
  title: 'NewsList',
  component: NewsList,
  argTypes: {},
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NewsList },
  template: '<NewsList />',
})

export const Default = Template.bind({})
Default.args = {}
