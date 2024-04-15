<template>
  <div id="app">
    <div class="section">
      <div class="container">
        <!-- todos -->
        <TODOs :todos="todos" @addTODO="addTODO" @onComplete="complete" @onDelete="remove" />
      </div>
    </div>
  </div>
</template>

<script>
import "bulma/css/bulma.css";
import TODOs from "./components/Todos.vue";

export default {
  name: "App",
  components: {
    TODOs,
  },
  data() {
    return {
      todos: [
        {
          userId: 1,
          id: 1,
          title: "delectus aut autem",
          completed: false,
        },
        {
          userId: 1,
          id: 2,
          title: "quis ut nam facilis et officia qui",
          completed: false,
        },
        {
          userId: 1,
          id: 3,
          title: "fugiat veniam minus",
          completed: false,
        },
        {
          userId: 1,
          id: 4,
          title: "et porro tempora",
          completed: true,
        },
        {
          userId: 1,
          id: 5,
          title: "laboriosam mollitia et enim quasi adipisci quia provident illum",
          completed: false,
        },
        {
          userId: 1,
          id: 6,
          title: "qui ullam ratione quibusdam voluptatem quia omnis",
          completed: false,
        },
        {
          userId: 1,
          id: 7,
          title: "illo expedita consequatur quia in",
          completed: false,
        },
        {
          userId: 1,
          id: 8,
          title: "quo adipisci enim quam ut ab",
          completed: true,
        },
        {
          userId: 1,
          id: 9,
          title: "molestiae perspiciatis ipsa",
          completed: false,
        },
        {
          userId: 1,
          id: 10,
          title: "illo est ratione doloremque quia maiores aut",
          completed: true,
        },
      ],
    };
  },
  methods: {
    addTODO(todo) {
      this.todos.unshift(todo);
    },
    complete(id) {
      const update_todos = this.todos.map((todo) =>
        todo.id == id ? Object.assign(todo, {completed: true}) : todo
      );

      this.todos = update_todos;
    },
    remove(id) {
      const remove_todo = this.todos.filter(todo => todo.id != id);
      this.todos = remove_todo;
    }
  },
};
</script>

<style>
#app {
  background-color: #666;
  font-family: "Courier New", Courier, monospace;
  min-height: 100vh;
}
</style>
