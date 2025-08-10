import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const CategorizeQuestionResponse = ({
  categories = [],
  options = [],
  value = {},
  onChange,
}) => {
  const emptyState = {
    unassigned: options || [],
    ...Object.fromEntries(categories.map((cat) => [cat, []])),
  };

  const [state, setState] = useState(
    value && Object.keys(value).length ? value : emptyState
  );

  useEffect(() => {
    if (value && Object.keys(value).length) {
      setState(value);
    } else {
      setState(emptyState);
    }
  }, [value, options, categories]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;

    if (sourceCol === destCol) {
      const reorderedItems = Array.from(state[sourceCol]);
      const [movedItem] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, movedItem);

      const newState = { ...state, [sourceCol]: reorderedItems };
      setState(newState);
      onChange(newState);
      return;
    }

    const sourceItems = Array.from(state[sourceCol]);
    const destItems = Array.from(state[destCol]);
    const [movedItem] = sourceItems.splice(result.source.index, 1);

    if (!destItems.includes(movedItem)) {
      destItems.splice(result.destination.index, 0, movedItem);
    }

    const newState = {
      ...state,
      [sourceCol]: sourceItems,
      [destCol]: destItems,
    };
    setState(newState);
    onChange(newState);
  };

  return (
    <div className="bg-white/5  text-white p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className="flex flex-wrap gap-4 overflow-x-auto sm:overflow-visible"
          style={{ scrollbarWidth: "thin" }}
        >
          {Object.keys(state).map((colId) => (
            <Droppable key={colId} droppableId={colId}>
              {(provided) => (
                <div
                  className="bg-[#1e1e1e] p-2 rounded min-w-[200px] sm:min-w-[180px] flex-1 border border-[#2e2e2e]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="font-bold mb-2 text-white text-sm sm:text-base">
                    {colId}
                  </h3>
                  {state[colId].map((item, index) => (
                    <Draggable key={item} draggableId={item} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className={`bg-[#2b2b2b] p-2 mb-2 rounded shadow border border-[#3a3a3a] text-xs sm:text-sm transition-transform duration-200 ${
                            snapshot.isDragging ? "z-[9999] scale-105" : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CategorizeQuestionResponse;
