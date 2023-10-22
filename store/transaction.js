export const state = () => ({
  form: {
    result: null,
  },
})

export const mutations = {
  setResult(state, form) {
    state.form = form
  },
}
