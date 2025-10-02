import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { deleteActivity } from "../api/activities";

const API = import.meta.env.VITE_API;

export default function ActivityDetails() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const { token } = useAuth();
  const [error, setError] = useState(null);

  /** fetches a single activity */
  useEffect(() => {
    async function singleActivity() {
      try {
        const response = await fetch(`${API}/activities/${id}`);
        const data = await response.json();
        console.log(data);
        setActivity(data);
      } catch (error) {
        console.error(error);
      }
    }
    singleActivity();
  }, [id]);

  const navigate = useNavigate();

  const tryDelete = async () => {
    setError(null);

    try {
      await deleteActivity(token, activity.id);
      navigate("/activities");
    } catch (e) {
      setError(e.message);
    }
  };

  if (!activity) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{activity.name}</h2>
      <p className="details">{activity.description}</p>
      <p className="details">
        <strong>Creator:</strong>
        {activity.creatorName}
      </p>
      <section>
        {token && <button onClick={tryDelete}>Delete</button>}
        {error && <p role="alert">{error}</p>}
      </section>

      <Link to="/activities"> back to activities</Link>
    </div>
  );
}
