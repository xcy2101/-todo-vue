<template>
  <li class="item" :class="{ 'done-item': hasDone, 'important-item': isImportant }">
    <div class="checkbox-text">
      <input v-if="!hasDone" @click="$emit('doneCheck')" class="input" type="checkbox" />
      <span v-if="!isEditing" :style="textStyle" class="text">{{ text }}</span>
      <input v-else class="edit-input" v-model="newText" type="text" name="todo" autofocus>
    </div>
    <div class="button-group">
      <button v-if="!isEditing && !hasDone" @click="delete_one_Todo" class="delete-btn">删除</button>
      <button v-if="!hasDone && !isEditing" @click="startEditing" class="submit-btn">修改</button>
      <button v-if="isEditing" @click="saveTodo" class="submit-btn">保存</button>
    </div>
  </li>
</template>

<script>
export default {
  props: [
    'hasDone',
    'text',
    'id',
    'startDate',
    'endDate',
    'priority',
  ],
  data() {
    return {
      isEditing: false,
      newText: '',
    }
  },
  computed: {
    isImportant() {
      return this.priority === 'important';
    },
    textStyle() {
      let styles = {};
      if (this.hasDone) {
        styles.textDecoration = 'line-through';
      }
      if (this.isImportant) {
        styles.color = '#d32f2f';
      }
      return styles;
    }
  },

  methods: {
    startEditing() {
      this.isEditing = true;
      this.newText = this.text; // 将文本框中的内容初始化为当前任务的文本
    },
    saveTodo() {
      this.$emit('editTodo', this.id, this.newText);
      this.isEditing = false;
      this.newText = '';
    },

    delete_one_Todo() {
      this.$emit('delete_one_Todo', this.id); // 向父组件发送删除任务项的请求
    },

  }
}
</script>

<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 2rem;
}

.checkbox-text {
  display: flex;
  align-items: center;
}

.input {
  margin-right: 1rem;
}

.edit-input {
  margin-left: 1rem;
}

.item > .text {
  transition: all .3s ease-in-out;
}

.done-item > .text {
  text-decoration: line-through;
}

.important-item > .text {
  color: #d32f2f !important;
}

.button-group {
  display: flex; /* 使用flex布局 */
  gap: 10px; /* 设置按钮之间的间距为5px */
}

.delete-btn {

  padding: 0.25rem 0.5rem;
  font-weight: 700;
  color: #f44336;
  border-radius: 5px;
  background: #ffcdd2; /* 浅红色背景 */
  box-shadow: 3px 3px 7px #bebebe, -3px -3px 7px #ffffff;
}
.submit-btn {
  padding: 0.25rem 0.5rem;
  font-weight: 700;
  color: var(--va-text-dark-color);
  border-radius: 5px;
  background: #e0e0e0;
  box-shadow: 3px 3px 7px #bebebe, -3px -3px 7px #ffffff;
}


</style>