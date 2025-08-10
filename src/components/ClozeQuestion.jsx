// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// const ClozeQuestion = ({
//   passage = "", // ✅ Default to empty string so .split works
//   correctAnswer = [], // ✅ Default empty array
//   value = [],
//   onChange = () => {}, // ✅ Default no-op
//   readOnly = false
// }) => {
//   const [selectedOption, setSelectedOption] = useState(null);

//   // ✅ Prevents error if passage is undefined
//   const parts = passage.split("___");

//   // ✅ Prevents error if correctAnswer is not an array
//   const availableOptions = correctAnswer.filter((opt) => !value.includes(opt));

//   const handleDragEnd = (result) => {
//     if (!result.destination || readOnly) return;
//     const { destination, draggableId } = result;
//     if (destination.droppableId.startsWith("blank-")) {
//       const blankIndex = parseInt(destination.droppableId.replace("blank-", ""), 10);
//       const newValue = [...value];
//       newValue[blankIndex] = draggableId;
//       onChange(newValue);
//       setSelectedOption(null);
//     }
//   };

//   const handleClear = (blankIndex) => {
//     if (readOnly) return;
//     const newValue = [...value];
//     newValue[blankIndex] = "";
//     onChange(newValue);
//   };

//   const handleBlankClick = (blankIndex) => {
//     if (readOnly) return;
//     if (selectedOption) {
//       const newValue = [...value];
//       newValue[blankIndex] = selectedOption;
//       onChange(newValue);
//       setSelectedOption(null);
//     } else if (value[blankIndex]) {
//       handleClear(blankIndex);
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <p className="leading-relaxed text-lg text-gray-200 flex flex-wrap items-center">
//         {parts.map((part, idx) => (
//           <React.Fragment key={idx}>
//             {part}
//             {idx < parts.length - 1 && (
//               <Droppable droppableId={`blank-${idx}`} isDropDisabled={readOnly}>
//                 {(provided, snapshot) => (
//                   <span
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     onClick={() => handleBlankClick(idx)}
//                     className={`inline-flex min-w-[100px] px-4 py-2 mx-1 rounded-full text-center items-center justify-center transition-all border-2 font-medium shadow-sm cursor-pointer ${
//                       value[idx]
//                         ? "bg-blue-900 border-blue-400"
//                         : selectedOption
//                         ? "bg-blue-700 border-blue-300"
//                         : snapshot.isDraggingOver
//                         ? "bg-blue-100 border-blue-300"
//                         : "bg-gray-800 border-dashed border-gray-500"
//                     }`}
//                   >
//                     {value[idx] ? (
//                       <Draggable draggableId={value[idx]} index={0} isDragDisabled={readOnly}>
//                         {(dragProvided) => (
//                           <div
//                             ref={dragProvided.innerRef}
//                             {...dragProvided.draggableProps}
//                             {...dragProvided.dragHandleProps}
//                             className="px-3 py-1 bg-blue-600 text-white rounded-full cursor-grab"
//                           >
//                             {value[idx]}
//                           </div>
//                         )}
//                       </Draggable>
//                     ) : (
//                       ""
//                     )}
//                     {provided.placeholder}
//                   </span>
//                 )}
//               </Droppable>
//             )}
//           </React.Fragment>
//         ))}
//       </p>

//       {!readOnly && (
//         <Droppable droppableId="options" direction="horizontal">
//           {(provided) => (
//             <div
//               className="mt-4 flex flex-wrap gap-3"
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//             >
//               {availableOptions.length === 0 && !selectedOption && (
//                 <small className="text-gray-400 italic">All options placed</small>
//               )}
//               {availableOptions.map((opt, idx) => (
//                 <Draggable key={opt} draggableId={opt} index={idx}>
//                   {(dragProvided) => (
//                     <div
//                       ref={dragProvided.innerRef}
//                       {...dragProvided.draggableProps}
//                       {...dragProvided.dragHandleProps}
//                       onClick={() => setSelectedOption(opt)}
//                       className={`px-4 py-2 rounded-full shadow cursor-pointer select-none font-medium transform transition-all ${
//                         selectedOption === opt
//                           ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
//                           : "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
//                       }`}
//                     >
//                       {opt}
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       )}
//     </DragDropContext>
//   );
// };

// export default ClozeQuestion;
import React, { useState, useEffect } from "react";

const ClozeQuestion = ({
  passage,
  correctAnswer,
  value = [],
  onChange,
  readOnly,
}) => {
  const parts = passage.split("___");
  const options = correctAnswer.filter((opt) => !value.includes(opt));

  const [selectedOption, setSelectedOption] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Drag & drop handlers
  const onDrop = (blankIndex, e) => {
    if (readOnly) return;
    e.preventDefault();
    const droppedAnswer = e.dataTransfer.getData("text/plain");
    if (!droppedAnswer) return;
    const newValue = [...value];
    newValue[blankIndex] = droppedAnswer;
    onChange(newValue);
    setSelectedOption(null);
  };

  const allowDrop = (e) => e.preventDefault();
  const onDragStart = (e, answer) => {
    e.dataTransfer.setData("text/plain", answer);
  };

  // Touch handlers
  const onBlankClick = (blankIndex) => {
    if (readOnly) return;
    if (selectedOption) {
      const newValue = [...value];
      newValue[blankIndex] = selectedOption;
      onChange(newValue);
      setSelectedOption(null);
    } else if (value[blankIndex]) {
      const newValue = [...value];
      newValue[blankIndex] = "";
      onChange(newValue);
    }
  };

  const onOptionClick = (opt) => {
    if (readOnly) return;
    setSelectedOption((prev) => (prev === opt ? null : opt));
  };

  return (
    <div>
      <p className="leading-relaxed text-lg text-gray-200 flex flex-wrap">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <span
                onDrop={isTouchDevice ? null : (e) => onDrop(i, e)}
                onDragOver={isTouchDevice ? null : allowDrop}
                onClick={() => onBlankClick(i)}
                className={`align-middle inline-flex items-center justify-center min-w-[100px] h-[2rem] px-4 mx-1 rounded-full text-center cursor-pointer transition-all border-2 font-medium shadow-sm select-none ${
                  value[i]
                    ? "bg-blue-900 border-blue-400"
                    : selectedOption
                    ? "bg-blue-700 border-blue-300"
                    : "bg-gray-800 border-dashed border-gray-500"
                }`}
                title={value[i] ? "Tap to clear" : "Drag or tap an answer here"}
              >
                {value[i] || ""}
              </span>
            )}
          </React.Fragment>
        ))}
      </p>

      {!readOnly && (
        <div className="mt-4 flex flex-wrap gap-3">
          {options.length === 0 && !selectedOption && (
            <small className="text-gray-400 italic">All options placed</small>
          )}
          {options.map((opt, idx) => (
            <div
              key={idx}
              draggable={!isTouchDevice}
              onDragStart={(e) => !isTouchDevice && onDragStart(e, opt)}
              onClick={() => onOptionClick(opt)}
              className={`px-4 py-2 rounded-full shadow cursor-pointer select-none font-medium transform transition-all ${
                selectedOption === opt
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
              }`}
              style={{ touchAction: "manipulation" }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") onOptionClick(opt);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClozeQuestion;

