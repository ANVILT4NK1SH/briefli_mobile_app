import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';

//utilize pinia throughout app
export default boot(({ app }) => {
  app.use(createPinia());
});
