import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { createRoutine } from "../api/routines";

/** a form for a logged in user to create a new routine */
export default function RoutineForm({ syncRoutines }) {
  const { token } = useAuth();

  const [error, setError] = useState(null);

  const tryCreateRoutine = async (formData) => {
    setError(null);

    const name = formData.get("name");
    const goal = formData.get("goal");

    try {
      await createRoutine(token, { name, goal });
      syncRoutines();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <>
      <h2>Add a new routine</h2>
      <form action={tryCreateRoutine}>
        <label>
          Name
          <input type="text" name="name" />
        </label>
        <label>
          Goal
          <input type="text" name="goal" />
        </label>
        <button>Add Routine</button>
      </form>

      {error && <p role="alert">{error}</p>}
    </>
  );
}
