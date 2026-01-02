import { useLocation } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();

  if (!state) {
    return <h2>No result available</h2>;
  }

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <h1>Meeting Summary</h1>
      <p style={{ marginTop: "20px", lineHeight: "1.6" }}>
        {state.summary}
      </p>

      <h2 style={{ marginTop: "40px" }}>Action Items</h2>

      {state.actions.length === 0 ? (
        <p>No action items detected.</p>
      ) : (
        <ul>
          {state.actions.map((a, i) => (
            <li key={i} style={{ marginBottom: "10px" }}>
              <strong>{a.action}</strong>
              {a.deadline && (
                <span style={{ color: "#00d2ff" }}>
                  {" "}— Deadline: {a.deadline}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
