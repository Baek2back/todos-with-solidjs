import { createSignal, type Component } from "solid-js";
import { createStore } from "solid-js/store";

type TodoItem = {
  text: string;
  completed: boolean;
};

const App: Component = () => {
  const [text, setText] = createSignal("");
  const [todos, setTodos] = createStore<TodoItem[]>([]);

  return <div>{JSON.stringify(todos, null, 2)}</div>;
};

export default App;
