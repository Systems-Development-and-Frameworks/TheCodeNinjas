import LoginForm from '~/components/LoginForm/LoginForm.vue'
import { setupWrapperAndStore } from '~/utils/tests'
jest.mock('~/utils/globals')

const loginRightCredentials = async (wrapper) => {
  wrapper.find('input#input-email').setValue('correctCredentials@test.com')
  wrapper.find('input#input-password').setValue('rightPassword')
  await wrapper.find('form').trigger('submit')
}

const loginWrongCredentials = async (wrapper) => {
  wrapper.find('input#input-email').setValue('wrongCredentials@test.com')
  wrapper.find('input#input-password').setValue('wrongPassword')
  await wrapper.find('form').trigger('submit')
}

const loginInvalidToken = async (wrapper) => {
  wrapper.find('input#input-email').setValue('invalidToken@test.com')
  wrapper.find('input#input-password').setValue('somePassword')
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
      await loginRightCredentials(wrapper)
      expect(storeAccessor.auth.getError).toBe(null)
    })
  })

  describe('when credentials are wrong', () => {
    it('shows wrong credentials error', async () => {
      const { wrapper, storeAccessor, localVue } = setupWrapperAndStore(
        LoginForm
      )
      await loginWrongCredentials(wrapper)
      await localVue.nextTick()
      expect(storeAccessor.auth.getError).toBe('Wrong credentials!')
    })
  })

  describe('in case of any other errors', () => {
    it('shows friendly error message', async () => {
      const { wrapper, storeAccessor, localVue } = setupWrapperAndStore(
        LoginForm
      )
      await loginInvalidToken(wrapper)
      await localVue.nextTick()
      expect(storeAccessor.auth.getError).toBe('Oops! Something went wrong.')
    })
  })
})
