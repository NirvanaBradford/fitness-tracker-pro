import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { createSet } from "../api/routines";
import { getActivities } from "../api/activities";

export default function SetForm({ syncRoutines }) {
  const { token } = useAuth();
  const { id: routineId } = useParams();
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  /** use chatgpt to help me with this part of the logic */
  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getActivities(token);
        setActivities(data);
      } catch (e) {
        setError("Failed to load activities");
      }
    }

    if (token) {
      loadActivities();
    }
  }, [token]);

  const tryCreateSet = async (formData) => {
    setError(null);

    const activityId = formData.get("activityId");
    const count = Number(formData.get("count"));

    try {
      await createSet(token, {
        activityId: Number(activityId),
        routineId: Number(routineId),
        count,
      });
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
      <h3>Add a set</h3>
      <form action={tryCreateSet}>
        <label>
          Activity:
          <select name="activityId" required>
            <option value="">-- Select an activity --</option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Count:
          <input type="number" name="count" min="1" required />
        </label>
        <button>Add set</button>
      </form>

      {error && <p role="alert">{error}</p>}
    </>
  );
}
