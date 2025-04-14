import React, { useState, useEffect } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const FilterComponent = ({
  filters,
  setFilters,
  filterActive,
  setFilterActive,
  cities,
}) => {
  const [showPanel, setShowPanel] = useState(false);

  const magyarIdotartam = {
    half_day: "Fél napos",
    whole_day: "Egész napos",
    weekend: "Egész hétvégés",
  };

  const magyarKoltseg = {
    free: "Ingyenes",
    paid: "Fizetős",
  };

  const applyFilters = () => {
    setFilterActive(true);
    setShowPanel(false);
  };

  return (
    <>
      <button
        className="floating-filter-button"
        onClick={() => setShowPanel(true)}
      >
        <FaFilter />
      </button>

      <div
        className={`filter-panel-overlay ${showPanel ? "show" : ""}`}
        onClick={() => setShowPanel(false)}
      >
        <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
          <div className="filter-header">
            <h3>🎯 Szűrési beállítások</h3>
            <button
              className="close-button"
              onClick={() => setShowPanel(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="filter-group">
            <label>Időtartam</label>
            <select
              value={filters.duration}
              onChange={(e) =>
                setFilters({ ...filters, duration: e.target.value })
              }
            >
              <option value="">Összes</option>
              {Object.entries(magyarIdotartam).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Költség</label>
            <select
              value={filters.cost}
              onChange={(e) => setFilters({ ...filters, cost: e.target.value })}
            >
              <option value="">Összes</option>
              {Object.entries(magyarKoltseg).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Város</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              <option value="">Összes</option>
              {cities.map((city) => (
                <option key={city.CityID} value={city.CityID}>
                  {city.Name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={applyFilters} className="apply-filter-button">
            🚀 Szűrés alkalmazása
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterComponent;
