import { makePersisted } from "@solid-primitives/storage";
import {
  type Component,
  For,
  Show,
  batch,
  createMemo,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";

type TodoItem = {
  text: string;
  completed: boolean;
};

const App: Component = () => {
  const [text, setText] = createSignal("");

  const [todosStore, setTodosStore] = makePersisted(
    createStore<{ todos: TodoItem[]; mode: "all" | "active" | "completed" }>({
      todos: [],
      mode: "all",
    }),
    {
      storage: localStorage,
    }
  );

  const remainingCount = createMemo(
    () =>
      todosStore.todos.length -
      todosStore.todos.filter((todo) => todo.completed).length
  );

  const currentTodos = createMemo(() => {
    if (todosStore.mode === "all") {
      return todosStore.todos;
    }
    if (todosStore.mode === "active") {
      return todosStore.todos.filter((todo) => !todo.completed);
    }
    return todosStore.todos.filter((todo) => todo.completed);
  });

  return (
    <>
      <h1>TODO App</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          batch(() => {
            setTodosStore("todos", todosStore.todos.length, {
              text: text(),
              completed: false,
            });

            setText("");
          });
        }}
      >
        <input
          placeholder="텍스트를 입력해주세요."
          required
          value={text()}
          onInput={(event) => {
            setText(event.target.value);
          }}
        />
        <button type="submit">+</button>
      </form>
      <div>
        <button
          type="button"
          onClick={() => {
            setTodosStore("mode", "all");
          }}
          style={{
            background: todosStore.mode === "all" ? "red" : "inherit",
          }}
        >
          all
        </button>
        <button
          type="button"
          onClick={() => {
            setTodosStore("mode", "active");
          }}
          style={{
            background: todosStore.mode === "active" ? "red" : "inherit",
          }}
        >
          active
        </button>
        <button
          type="button"
          onClick={() => {
            setTodosStore("mode", "completed");
          }}
          style={{
            background: todosStore.mode === "completed" ? "red" : "inherit",
          }}
        >
          completed
        </button>
      </div>
      <ul>
        <For each={currentTodos()}>
          {(todo, index) => (
            <li>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(event) =>
                  setTodosStore(
                    "todos",
                    index(),
                    "completed",
                    event.currentTarget.checked
                  )
                }
              />
              <input
                type="text"
                value={todo.text}
                onChange={(event) =>
                  setTodosStore(
                    "todos",
                    index(),
                    "text",
                    event.currentTarget.value
                  )
                }
              />
              <button
                type="button"
                onClick={() => {
                  setTodosStore(
                    "todos",
                    todosStore.todos.filter((_, idx) => idx !== index())
                  );
                }}
              >
                X
              </button>
            </li>
          )}
        </For>
      </ul>
      <div>
        <Show when={remainingCount() > 0}>
          {remainingCount()} {remainingCount() === 1 ? "item" : "items"} left
        </Show>
        <Show when={remainingCount() !== todosStore.todos.length}>
          <button
            type="button"
            onClick={() => {
              setTodosStore(
                "todos",
                todosStore.todos.filter((todo) => !todo.completed)
              );
            }}
          >
            Clear completed
          </button>
        </Show>
      </div>
    </>
  );
};

export default App;
