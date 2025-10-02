import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { deleteRoutine, deleteSet } from "../api/routines";
import SetForm from "./SetForm";

const API = import.meta.env.VITE_API;

export default function RoutineDetails() {
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const { token } = useAuth();
  const [error, setError] = useState(null);

  /** fetches a single routine */

  const singleRoutine = async () => {
    try {
      const response = await fetch(`${API}/routines/${id}`);
      const data = await response.json();
      console.log(data);
      setRoutine(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    singleRoutine();
  }, [id]);

  const navigate = useNavigate();

  const tryDelete = async () => {
    setError(null);

    try {
      await deleteRoutine(token, routine.id);
      navigate("/routines");
    } catch (e) {
      setError(e.message);
    }
  };

  /** set delete button */
  const tryDeleteSet = async (setId) => {
    setError(null);

    try {
      await deleteSet(token, setId);
      await singleRoutine();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!routine) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{routine.name}</h2>
      <p className="details">{routine.goal}</p>
      <p className="details">
        <strong>Creator:</strong>{" "}
        {routine.creatorName
          ? routine.creatorName.charAt(0).toUpperCase() +
            routine.creatorName.slice(1)
          : ""}
      </p>
      <section>
        {token && <button onClick={tryDelete}>Delete routine</button>}
        {error && <p role="alert">{error}</p>}
      </section>
      <section>
        <h3>Sets</h3>
        <ul>
          {routine.sets && routine.sets.length > 0 ? (
            routine.sets.map((item) => (
              <li className="sets" key={item.id}>
                {item.name} x {item.count}
                <div>
                  {token && (
                    <button
                      className="set-button"
                      onClick={() => tryDeleteSet(item.id)}
                    >
                      Delete set
                    </button>
                  )}
                  {error && <p role="alert">{error}</p>}
                </div>
              </li>
            ))
          ) : (
            <p>No sets yet. please add a set.</p>
          )}
        </ul>
      </section>

      <SetForm syncRoutines={singleRoutine} />
      <Link to="/routines"> back to routines</Link>
    </div>
  );
}
