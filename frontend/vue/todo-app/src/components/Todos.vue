<template>
  <div class="columns is-multiline">
    <div class="column is-6 is-offset-3">
      <div class="box">
        <form @submit.prevent="onSubmit">
          <div class="field">
            <label class="label">Add your todo</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Enter your todo..."
                v-model="title"
              />
            </div>
            <p class="help">Enter here and press 'Enter' to add new todo</p>
          </div>
        </form>
      </div>
    </div>

    <div class="column is-6 is-offset-3" v-for="todo in todos" :key="todo.id">
      <div class="box todo_box" @click="$emit('onComplete', todo.id)">
        <span :class="{ completed: todo.completed }"> {{ todo.title }} </span>
        <button class="button is-danger is-small is-pulled-right" v-if="todo.completed" @click="$emit('onDelete', todo.id)">
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import generate_id from "shortid";
export default {
  name: "TODOs",
  props: ["todos"],
  data() {
    return {
      title: "",
    };
  },
  methods: {
    onSubmit() {
      const new_todo = {
        title: this.title,
        completed: false,
        id: generate_id.generate(),
      };
      this.$emit("addTODO", new_todo);
      this.title = "";
    },
  },
};
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}

.todo_box {
  transition: all 0.3s;
}

.todo_box:hover {
  cursor: pointer;
  background-color: #f0f3bd;
  transform: scale(1.05);
}

.button {
    color: #eee;
    background-color: #10f;
    font-weight: 500;
}

.help {
    font-size: 12px;
    font-style: italic;
}
</style>
