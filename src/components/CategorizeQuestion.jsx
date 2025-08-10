import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // cross icon

const CategorizeQuestion = ({
  categories = [],
  options = [],
  value = {},
  onChange,
  onDeleteOption,
  onDeleteCategory,
}) => {
  const [optionCategoryMap, setOptionCategoryMap] = useState({});

  const flattenValue = (val) => {
    const map = {};
    for (const cat in val) {
      val[cat].forEach((opt) => {
        map[opt] = cat;
      });
    }
    return map;
  };

  useEffect(() => {
    if (value && Object.keys(value).length) {
      setOptionCategoryMap(flattenValue(value));
    } else {
      const defaultMap = {};
      options.forEach((opt) => {
        defaultMap[opt] = "unassigned";
      });
      setOptionCategoryMap(defaultMap);
    }
  }, [value, options, categories]);

  const handleCategoryChange = (option, newCategory) => {
    const updatedMap = { ...optionCategoryMap, [option]: newCategory };
    setOptionCategoryMap(updatedMap);

    const categoryMap = { unassigned: [] };
    categories.forEach((cat) => (categoryMap[cat] = []));

    for (const [opt, cat] of Object.entries(updatedMap)) {
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(opt);
    }

    onChange(categoryMap);
  };

  return (
    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg shadow-md">
      {/* Options Section */}
      <h4 className="font-semibold mb-2">Options</h4>
      {options.map((opt) => (
        <div
          key={opt}
          className="mb-3 flex items-center border-b border-gray-700 pb-2 gap-2"
        >
          <input
            type="text"
            readOnly
            value={opt}
            className="flex-grow bg-transparent border border-white/20 rounded px-2 py-1 text-white cursor-not-allowed"
          />
          <select
            value={optionCategoryMap[opt] || "unassigned"}
            onChange={(e) => handleCategoryChange(opt, e.target.value)}
            className="ml-4 border border-gray-600 bg-gray-700 text-white p-1 rounded"
          >
            <option value="unassigned">Unassigned</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Close button like comprehension's */}
          <button
            onClick={() => onDeleteOption(opt)}
            className="text-indigo-400 text-xl flex-shrink-0 hover:text-indigo-300"
            title="Delete option"
            type="button"
          >
            <AiOutlineClose />
          </button>
        </div>
      ))}

      {/* Categories Section */}
      <h4 className="font-semibold mt-4 mb-2">Categories</h4>
      {categories.map((cat) => (
        <div
          key={cat}
          className="mb-3 flex items-center border-b border-gray-700 pb-2 gap-2"
        >
          <input
            type="text"
            readOnly
            value={cat}
            className="flex-grow bg-transparent border border-white/20 rounded px-2 py-1 text-white cursor-not-allowed"
          />
          {/* Close button like comprehension's */}
          <button
            onClick={() => onDeleteCategory(cat)}
            className="text-indigo-400 text-xl flex-shrink-0 hover:text-indigo-300"
            title="Delete category"
            type="button"
          >
            <AiOutlineClose />
          </button>
        </div>
      ))}
    </div>
  );
};

export default CategorizeQuestion;
