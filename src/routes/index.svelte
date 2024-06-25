<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit';

    export const load: Load = async ({ fetch }) => {
        const res = await fetch('/todos');
        const { todos } = await res.json();
        return { props: { todos } };
    }
</script>

<script lang="ts">
    export let todos: { id: number; title: string; completed: boolean }[] = [];

    let newTodo = "";

    async function addTodo() {
        if (newTodo.trim()) {
            const res = await fetch("/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTodo }),
            });
            const todo = await res.json();
            todos = [...todos, todo];
            newTodo = "";
        }
    }

    async function toggleCompletion(todo: {
        id: number;
        title: string;
        completed: boolean;
    }) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        const res = await fetch("/todos", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTodo),
        });
        const returnedTodo = await res.json();
        todos = todos.map((t) => (t.id === returnedTodo.id ? returnedTodo : t));
    }

    async function deleteTodo(id: number) {
        await fetch("/todos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        todos = todos.filter((t) => t.id !== id);
    }
</script>

<h1>Todos</h1>

<input bind:value={newTodo} placeholder="Add new todo" />
<button on:click={addTodo}>Add</button>

<ul>
    {#each todos as todo (todo.id)}
        <li>
            <input
                type="checkbox"
                checked={todo.completed}
                on:change={() => toggleCompletion(todo)}
            />
            {todo.title}
            <button on:click={() => deleteTodo(todo.id)}>Delete</button>
        </li>
    {/each}
</ul>
