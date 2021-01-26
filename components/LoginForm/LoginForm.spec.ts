import LoginForm from '~/components/LoginForm/LoginForm.vue'
import { setupWrapperAndStore } from '~/utils/tests'
jest.mock('~/utils/globals')

const login = async (wrapper) => {
  wrapper.find('input#input-email').setValue('somebody@example.org')
  wrapper.find('input#input-password').setValue('12341234')
  await wrapper.find('form').trigger('submit')
}

describe('Login form tests', () => {
  it('Tests True', () => {
    const { wrapper, storeAccessor } = setupWrapperAndStore(LoginForm)

    expect(wrapper).toBeTruthy()
    expect(storeAccessor).toBeTruthy()
  })

  describe('form submit', () => {
    const { wrapper, storeAccessor } = setupWrapperAndStore(LoginForm)

    it('shows no error', async () => {
      await login(wrapper)
      expect(storeAccessor.auth.getError).toBe(null)
    })
  })

  describe('when credentials are wrong', () => {

    it('shows wrong credentials error', async () => {
      const { wrapper, localVue } = setupWrapperAndStore(LoginForm)
      await login(wrapper)
      await localVue.nextTick()
      expect(wrapper.find('.error').text()).toContain(
        'Wrong email/password combination'
      )
    })
  })
})
