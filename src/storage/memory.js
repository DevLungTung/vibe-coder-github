const todos = [
  { id: 1, title: 'Master Git and GitHub fundamentals', done: false },
  { id: 2, title: 'Create my first commit', done: true },
  { id: 3, title: 'Push to GitHub', done: false }
];
let nextId = 4;

export const memoryStorage = {
  async getAll() {
    return [...todos];
  },

  async getById(id) {
    return todos.find(todo => todo.id === parseInt(id));
  },

  async create(todoData) {
    const todo = {
      id: nextId++,
      title: todoData.title,
      done: todoData.done || false
    };
    todos.push(todo);
    return todo;
  },

  async update(id, todoData) {
    const index = todos.findIndex(todo => todo.id === parseInt(id));
    if (index === -1) {
      return null;
    }
    
    todos[index] = {
      ...todos[index],
      ...todoData,
      id: parseInt(id)
    };
    return todos[index];
  },

  async delete(id) {
    const index = todos.findIndex(todo => todo.id === parseInt(id));
    if (index === -1) {
      return false;
    }
    
    todos.splice(index, 1);
    return true;
  }
};
