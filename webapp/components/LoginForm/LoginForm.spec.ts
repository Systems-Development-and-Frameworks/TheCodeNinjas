import LoginForm from '~/components/LoginForm/LoginForm.vue'
import { setupWrapperAndStore } from '~/utils/tests'

describe('Login form tests', () => {
  it('Tests True', () => {
    const { wrapper, storeAccessor } = setupWrapperAndStore(LoginForm)

    expect(wrapper).toBeTruthy()
    expect(storeAccessor).toBeTruthy()
  })
})
