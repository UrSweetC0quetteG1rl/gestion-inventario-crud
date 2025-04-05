export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
}) {

  //Devolvera un search var para buscar productos por nombre
  return (
    <div className="search-filter-container">
      <div className="search-filter-row">
        <div className="search-box">
          <label htmlFor="search">Buscar producto</label>
          <div className="search-input">
            <input
              type="text"
              id="search"
              placeholder="Buscar producto en el inventario..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => onSearchChange("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filter-box">
          <label htmlFor="category-filter">Filtrar por categoría</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Todas</option>
            {categories
              .filter((cat) => cat !== "")
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
