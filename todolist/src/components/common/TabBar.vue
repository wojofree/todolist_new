<template>
  <div class="tab-bar">
    <div v-for="item in options" class="tab-item cursor"
         :class="{'isActive':isActive === item.value}"
         @click="setActive(item.value)"
         :style="{'fontSize':fontSize}"
    >
      <div class="mg-b-6">
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBar",
  data() {
    return {
      isActive: '',
    }
  },
  props: {
    options: {
      type: Object,
      default: [{'name': 'test1', 'value': 1}, {'name': 'test2', 'value': 2}, {'name': 'test2', 'value': 3},]
    },
    modelValue: {
      type: String,
      default: ''
    },
    fontSize: {
      type: String,
    },
    setValue: {
      type: String,
      default: 'default'
    },
    color: {
      type: String,
      default: '#1e1f21'
    }
  },
  created() {
    if (this.modelValue === '') {
      this.setActive(this.options[0].value)
    } else {
      this.setActive(this.modelValue)
    }
  },
  methods: {
    setActive(item) {
      this.isActive = item
      this.$emit('update:modelValue', this.isActive)
    }
  }
}
</script>

<style scoped>
.tab-bar {
  display: flex;
}

.tab-item {
  margin-right: 1.5rem;
  color: var(--gray);
  font-weight: 600;
  transition: color .2s;
}

.tab-item:last-child {
  margin-right: 0;
}

.mg-b-6 {
  padding-bottom: .625rem;
}

.tab-item:hover {
  color: v-bind(color);
  border-bottom: 2px solid v-bind(color);
}

.isActive {
  color: v-bind(color);
  border-bottom: 2px solid v-bind(color);
}
</style>