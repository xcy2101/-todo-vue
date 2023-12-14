<template>
  <header>
    <h3 class="title">Todo List</h3>
  </header>

  <div class="container">
    <Transition name="fade">
      <NeumorphCard
          id="add"
          v-show="isAddCardVisible"
          title="please enter"
          :btn="false"
      >
        <form class="add-form">
          <input class="add-ipt" v-model="newTodo" type="text" name="todo" autofocus>
          <VueDatePicker v-model="newTodoStartDate" class="add-ipt" name="start-date" placeholder="开始日期"></VueDatePicker>
          <VueDatePicker v-model="newTodoEndDate" class="add-ipt" name="end-date" placeholder="截止日期"></VueDatePicker>
          <select v-model="newTodoPriority" class="add-ipt" name="priority">
            <option value="normal">普通任务</option>
            <option value="important">重要任务</option>
          </select>
          <button class="submit-btn" type="submit" @click.prevent="submitTodo">提交</button>
        </form>
      </NeumorphCard>
    </Transition>

    <NeumorphCard
        title="to be done"
        @click-add-btn="addCardDisplay"
        :btn="true"
    >
      <TransitionGroup name="list">
        <TodoItem
            v-for="item in todoList" :key="item.id"
            :text="item.name"
            :priority="item.priority"
            @done-check="deleteTodo(item.id)"
            @editTodo="editTodo"
            @delete_one_Todo="delete_one_Todo"
            :id="item.id"
            :has-done="false"

        />
      </TransitionGroup>
    </NeumorphCard>
    <NeumorphCard
        id="done"
        title="already done"
        :btn="false"
    >
      <button @click="clearForm" class="delete-btn">清空表单</button>
      <TransitionGroup name="list">
        <TodoItem
            v-for="item in doneList" :key="item.id"
            :text="item.name"
            :has-done="true"
        />
      </TransitionGroup>
    </NeumorphCard>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import NeumorphCard from './components/NeumorphCard.vue';
import TodoItem from './components/TodoItem.vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
  components: {
    VueDatePicker,
    NeumorphCard,
    TodoItem,
  },
  data() {
    return {
      todoList: [],
      doneList: [],
      isAddCardVisible: false,
      newTodo: '',
      newTodoStartDate: '',
      newTodoEndDate: '',
      newTodoPriority: 'normal', // 默认为普通任务

    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // get todos and dones using fetch
    getData() {
      fetch(`http://localhost:3030`, {
        method: 'GET'
      })
          .then(response => response.json())
          .then(result => this.todoList = result)

      fetch(`http://localhost:3030/done`, {
        method: 'GET'
      })
          .then(response => response.json())
          .then(result => this.doneList = result)
    },

    // display add card
    addCardDisplay() {
      this.isAddCardVisible = true
    },

    // submit new todo
    async submitTodo() {
      if (this.newTodo.trim() === '') {
        ElMessage.error('任务内容不能为空！');
        return;
      }

      // 验证截止日期大于开始日期
      if (this.newTodoEndDate <= this.newTodoStartDate) {
        ElMessage.error('截止日期必须大于开始日期！');
        return;
      }

      const todoData = {
        name: this.newTodo,
        start: this.newTodoStartDate,
        end: this.newTodoEndDate,
        priority: this.newTodoPriority // 发送任务优先级
      };
      const result = await fetch(`http://localhost:3030/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData) // 确保发送的数据包含 name 字段
      }).then(response => response.json());

      if (result.code !== 200) {
        console.log(result.message)
        return
      }

      this.getData()
      this.isAddCardVisible = false
      this.newTodo = ''
      this.newTodoStartDate = ''
      this.newTodoEndDate = ''
      this.newTodoPriority = 'normal' // 重置为普通任务

    },


    // delete a todo
    async deleteTodo(id) {
      const result = await fetch(
          `http://localhost:3030/delete/${id}`,
          { method: 'POST' }
      )
          .then(response => response.json())
      if (result.code !== 200) {
        console.log(result.message)
        return
      }
      this.getData()
    },

    async delete_one_Todo(id) {
      const result = await fetch(
          `http://localhost:3030/delete-todo/${id}`,
          { method: 'DELETE' }
      )
          .then(response => response.json())
      if (result.code !== 200) {
        console.log(result.message)
        return
      }
      this.todoList = this.todoList.filter(item => item.id !== id);
    },

    // edit a todo
    async editTodo(id, newText) {
      const result = await fetch(
          `http://localhost:3030/edit/${id}?name=${newText}`,
          { method: 'POST' }
      )
          .then(response => response.json())
      if (result.code !== 200) {
        console.log(result.message)
        return
      }
      if (newText.trim() === '') {
        ElMessage.error('创建任务不能为空！');
        return;
      }
      this.getData()
    },



    clearForm() {
      // 向后端发送请求，删除已完成的任务项
      this.doneList.forEach(task => {
        axios.delete(`http://localhost:3030/completed/${task.id}`)
            .then(response => {
              console.log('Task has been deleted:', response.data);
            })
            .catch(error => {
              console.error('Failed to delete task:', error);
            });
      });

      // 清空表单逻辑
      this.doneList = [];
    }

  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: box-shadow 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  box-shadow: none;
}

header {
  padding-top: 1.5rem;
}

header > .title {
  font-size: 2.25rem;
  text-align: center;
}

.container {
  margin: 0 auto;
  margin-top: 3rem;
  width: 25rem;
}

#done {
  margin-top: 4.25rem;
}

/* Add area style */
#add {
  margin-bottom: 4.25rem;
  transition: all .3s ease-in-out;
  opacity: 1;
}

.add-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.5rem 0 0.5rem;
}

.add-form .add-ipt {
  background-color: var(--va-bg-light-color);
  border: none;
  font-size: 1.125rem;
  width: 15rem;
}

.add-form .submit-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  padding: 0.25rem 0.5rem;
  font-weight: 700;
  color: var(--va-text-dark-color);
  border-radius: 5px;
  background: #e0e0e0;
  box-shadow:  3px 3px 7px #bebebe,
  -3px -3px 7px #ffffff;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 20px;
  padding: 0.25rem 0.5rem;
  font-weight: 700;
  color: var(--va-text-dark-color);
  border-radius: 5px;
  background: #e0e0e0;
  box-shadow:  3px 3px 7px #bebebe,
  -3px -3px 7px #ffffff;
}


</style>