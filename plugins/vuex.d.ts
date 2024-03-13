import { Store } from 'vuex'
import { RootState, Version } from './store';

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State extends RootState{
    versions: Version[];
    currentVersionIndex: number;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}