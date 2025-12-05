function SearchBar({ search, setSearch }) {
  return (
    <div className="search-container" style={{ marginBottom: "15px" }}>
      <input
        type="text"
        placeholder="Search Task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "1rem",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default SearchBar;