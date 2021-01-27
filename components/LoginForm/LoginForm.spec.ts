import LoginForm from '~/components/LoginForm/LoginForm.vue'
import { setupWrapperAndStore } from '~/utils/tests'

jest.mock('~/utils/globals')

describe('Login form tests', () => {
  it('should set up test utilities properly', () => {
    const { wrapper, storeAccessor, localVue } = setupWrapperAndStore(LoginForm)

    expect(wrapper).toBeTruthy()
    expect(storeAccessor).toBeTruthy()
    expect(localVue).toBeTruthy()
  })

  describe('Form submit', () => {
    const { wrapper, storeAccessor, localVue } = setupWrapperAndStore(LoginForm)
    const inputEmail = wrapper.find('input#input-email')
    const inputPassword = wrapper.find('input#input-password')
    const form = wrapper.find('form')

    it('should shows no error', async () => {
      inputEmail.setValue('correctCredentials@test.com')
      inputPassword.setValue('rightPassword')

      await form.trigger('submit')
      await localVue.nextTick()

      expect(storeAccessor.auth.getError).toBe(null)
    })

    it('should show  wrong credentials error', async () => {
      inputEmail.setValue('wrongCredentials@test.com')
      inputPassword.setValue('wrongPassword')

      await form.trigger('submit')
      await localVue.nextTick()

      expect(storeAccessor.auth.getError).toBe('Wrong credentials!')
    })

    it('should show friendly error message', async () => {
      inputEmail.setValue('invalidToken@test.com')
      inputPassword.setValue('somePassword')

      await form.trigger('submit')
      await localVue.nextTick()

      expect(storeAccessor.auth.getError).toBe('Oops! Something went wrong.')
    })
  })
})
