import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import CardContainer from "./CardContainer";

import "./GameRoom.css";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function PlayerField({hand, field, setHand, setField, canPlay}) {
    
  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    
    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    let cards = hand;
    let setCards = setHand;
    let toCards = field;
    let setToCards = setField;

    if (sInd === 'Field') {
        cards = field;
        setCards = setField;
        toCards = hand;
        setToCards = setHand;
    }

    if (sInd === dInd) {
        const newCards = reorder(
            cards,
            source.index,
            destination.index
        );
        
       setCards(newCards);
    } else if (canPlay) {
        const result = move(
            cards,
            toCards,
            source,
            destination
        );

        setCards(result[sInd]);
        setToCards(result[dInd]);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <CardContainer cards={field} containerId="Field" backgroundColor={canPlay? "lightblue": "crimson"} canPlay={canPlay}/>
        <CardContainer cards={hand} containerId="Hand" backgroundColor="lightgray" canPlay/>
    </DragDropContext>
  );
}

export default PlayerField;