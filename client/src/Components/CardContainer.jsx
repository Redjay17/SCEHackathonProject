import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

import "./GameRoom.css";

// a little function to help us with reordering the result
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? "darkgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver, backgroundColor) => ({
  background: isDraggingOver ? "lightgreen" : backgroundColor,
  display: "flex",
  padding: grid,
  min_eight: "100px",
  height: "auto",
});

const CardContainer = ({cards, containerId, backgroundColor}) => {
  return (
    <Droppable droppableId={containerId} direction="horizontal">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver, backgroundColor)}
          {...provided.droppableProps}
        >
          {cards.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  <img src={item.path} alt={item.content} className="card" />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default CardContainer;
