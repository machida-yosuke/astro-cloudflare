import React, { useState } from "react";

export default function Greeting({ name }: { name: string }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Welcome to our Astro + React site!</p>

      <div>
        <p>Current count: {count}</p>
        <button onClick={() => setCount(count + 1)} type="button">Increment</button>
      </div>
    </div>
  );
}
