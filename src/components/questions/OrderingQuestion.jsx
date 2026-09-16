import React, { useEffect, useState } from "react";
import { shuffleArray } from "../../utils/shuffleArray";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    margin: "4px 0",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "grab",
    touchAction: "manipulation",
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </li>
  );
}

function OrderingQuestion({ question, onSubmit }) {
  const [items, setItems] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Shuffle items on mount
  useEffect(() => {
    const sourceItems = question.correctAnswer;
    const shuffled = shuffleArray(sourceItems);
    setItems(shuffled);

    // Detect touch device on client
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, [question]);

  const sensors = useSensors(
    useSensor(isTouchDevice ? TouchSensor : PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 2,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSubmit = () => {
    const isCorrect = items.every((item, index) => item === question.correctAnswer[index]);
    onSubmit([...items], isCorrect);
  };

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((item) => (
              <SortableItem key={item} id={item} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Responder
      </button>
    </div>
  );
}

export default OrderingQuestion;
