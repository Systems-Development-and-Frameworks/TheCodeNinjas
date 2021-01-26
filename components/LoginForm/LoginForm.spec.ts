import LoginForm from '~/components/LoginForm/LoginForm.vue'
import { setupWrapperAndStore } from '~/utils/tests'
import { getters, storePattern } from '~/store'

describe('Login form tests', () => {
  it('Tests True', () => {
    const { wrapper, storeAccessor } = setupWrapperAndStore(LoginForm)

    expect(wrapper).toBeTruthy()
    expect(storeAccessor).toBeTruthy()
  })

  describe('form submit', () => {
    const { wrapper, storeAccessor } = setupWrapperAndStore(
      LoginForm,
      {},
      { ...storePattern, getters: {} }
    )

    const login = async (wrapper) => {
      wrapper.find('input#input-email').setValue('s0558101@htw-berlin.de')
      wrapper.find('input#input-password').setValue('flosPW')
      await wrapper.find('form').trigger('submit')
    }

    it('shows no error', () => {
      console.log('here2')
      console.log(storeAccessor.auth.getError)

      console.log(wrapper.find('input#input-email').element)
      expect(storeAccessor.auth.getError).toBe(null)
    })
  })
})
