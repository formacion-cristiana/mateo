function renderArray(item){
  return <ul style={{ display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    alignItems: "flex-start", paddingLeft: "1rem", margin: 0 }}>
        {item.map((subItem, idx) => (
          <li key={idx}>{renderAnswerItem(subItem)}</li>
        ))}
      </ul>
}
export function renderAnswerItem(item) {
  // Support for matching/image answers
  if (typeof item === "string" && /\.(png|jpe?g|gif|svg)$/.test(item)) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}/images/${item}`}
        alt=""
        style={{ maxWidth: "100%", height: "auto" }}
      />
    );
  }




  if (item.columns && Array.isArray(item.data)) {
    // matching question format
        return(
      <> {renderArray(item.columns)}  {renderArray(item.data)} </>
      );
  }

  if (Array.isArray(item)) {
    return (
      <ul style={{ display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    alignItems: "flex-start", paddingLeft: "1rem", margin: 0 }}>
        {item.map((subItem, idx) => (
          <li key={idx}>{renderAnswerItem(subItem)}</li>
        ))}
      </ul>
    );
  }

  if (typeof item === "object" && item !== null) {
    return Object.entries(item).map(([k, v], i) => (
      <div key={i}>
        <strong>{k}:</strong> {renderAnswerItem(v)}
      </div>
    ));
  }

  return String(item);
}
