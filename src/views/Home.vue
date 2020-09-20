<template lang="pug">
  .page(:class="{'page--wide': isCollapseNav}")
    <div class="home">
      <HelloWorld msg="Добро пожаловать в систему!"/>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  computed: mapState([
    'isAuth',
    'isCollapseNav'
  ])
}
</script>
