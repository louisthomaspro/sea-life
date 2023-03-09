import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ITaxonPhoto } from "../../types/INaturalist/TaxaResponse";
import { ILife } from "../../types/Life";

export default function PhotoManagement(props: { life: ILife }) {
  const [taxaPhotos, setTaxaPhotos] = useState(null as ITaxonPhoto[]);

  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items: any = reorder(
      taxaPhotos,
      result.source.index,
      result.destination.index
    );

    console.log("before", taxaPhotos);
    console.log("after", items);

    setTaxaPhotos(items);
  };

  const grid = 8;

  const getListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    display: "flex",
    padding: grid,
    overflow: "auto",
  });

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,

    maxWidth: "50px",

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            {taxaPhotos.map((item, index) => (
              <Draggable
                key={item.photo.id.toString()}
                draggableId={item.photo.id.toString()}
                index={index}
              >
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
                    {item.photo.id.toString()}
                    <br />
                    {index}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
