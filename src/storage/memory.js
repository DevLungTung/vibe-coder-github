// Todos belong to a user, so there is no shared seed data.
const users = [];
const todos = [];
let nextUserId = 1;
let nextTodoId = 1;

const toPublicTodo = ({ id, title, done }) => ({ id, title, done });
const findOwned = (id, userId) =>
  todos.findIndex(todo => todo.id === parseInt(id) && todo.userId === userId);

export const memoryStorage = {
  // ----- Users -----
  async createUser({ username, passwordHash }) {
    if (users.some(user => user.username === username)) {
      return null;
    }
    const user = { id: nextUserId++, username, passwordHash };
    users.push(user);
    return { id: user.id, username: user.username };
  },

  async findUserByUsername(username) {
    return users.find(user => user.username === username) || null;
  },

  // ----- Todos (always scoped to a user) -----
  async getAll(userId) {
    return todos.filter(todo => todo.userId === userId).map(toPublicTodo);
  },

  async getById(id, userId) {
    const index = findOwned(id, userId);
    return index === -1 ? undefined : toPublicTodo(todos[index]);
  },

  async create(todoData, userId) {
    const todo = {
      id: nextTodoId++,
      title: todoData.title,
      done: todoData.done || false,
      userId
    };
    todos.push(todo);
    return toPublicTodo(todo);
  },

  async update(id, userId, todoData) {
    const index = findOwned(id, userId);
    if (index === -1) {
      return null;
    }

    // Only allow editable fields, so a request body cannot change id or userId.
    const { title, done } = todoData;
    if (title !== undefined) {
      todos[index].title = title;
    }
    if (done !== undefined) {
      todos[index].done = done;
    }
    return toPublicTodo(todos[index]);
  },

  async delete(id, userId) {
    const index = findOwned(id, userId);
    if (index === -1) {
      return false;
    }

    todos.splice(index, 1);
    return true;
  }
};
