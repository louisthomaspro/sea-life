import { ILifePhoto } from "../../types/Life";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "primereact/button";
import Image from "next/image";
import { blurDataURL, uuidv4 } from "../../utils/helper";
import { InputText } from "primereact/inputtext";

interface IPhotosUpdate {
  photos: ILifePhoto[];
  onChange: (photos: ILifePhoto[]) => void;
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function PhotoUpdate(props: IPhotosUpdate) {
  const [photos, setPhotos] = useState<ILifePhoto[]>([]);

  const [originalUrl, setOriginalUrl] = useState("");
  const [attribution, setAttribution] = useState("");

  useEffect(() => {
    setPhotos(props.photos);
  }, [props.photos]);

  useEffect(() => {
    props.onChange(photos);
  }, [photos]);

  const renderItem =
    // eslint-disable-next-line react/display-name
    (photo: any, provided: any, snapshot: any) => (
      <Style>
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`item ${snapshot.isDragging ? "dragging" : ""}`}
          style={provided.draggableProps.style}
        >
          <div className="img-wrapper">
            <Image
              src={photo.original_url}
              loader={({ src }) => src}
              layout="fill"
              placeholder="blur"
              blurDataURL={blurDataURL()}
              objectFit="cover"
              sizes="50vw"
              alt=""
            />
          </div>
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger delete-button m-2"
            aria-label="Delete"
            onClick={() => {
              const newPhotos = photos.filter((p) => p.id !== photo.id);
              setPhotos(newPhotos);
            }}
            type="button"
          />
          {/* <Button
            icon="pi pi-search-plus"
            className="p-button-rounded p-button-outlined view-button"
            aria-label="View"
            type="button"
          /> */}
        </div>
      </Style>
    );

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      photos,
      result.source.index,
      result.destination.index
    );

    setPhotos(items);
  };

  const submitPhotoForm = () => {
    if (originalUrl) {
      const photo: ILifePhoto = {
        id: uuidv4(),
        original_url: originalUrl,
        attribution: attribution ?? null,
        storage_path: null,
      };

      setPhotos([photo, ...photos]);
      setOriginalUrl("");
      setAttribution("");
    }
  };

  const handleChange = (e: any) => {
    if (e.target.name === "original_url") {
      setOriginalUrl(e.target.value);
    } else if (e.target.name === "attribution") {
      setAttribution(e.target.value);
    }
  };

  return (
    <Style>
      <div className="photo-form">
        {/* URL */}
        <div className="field">
          <label>Url*</label>
          <InputText
            placeholder="ex: https://www.example.com/image.jpg"
            value={originalUrl}
            onChange={handleChange}
            name="original_url"
            className="w-full p-inputtext-sm"
          />
        </div>

        {/* ATTRIBUTE */}
        <div className="field">
          <label>Attribution</label>
          <InputText
            placeholder="ex: Photo by John Doe"
            value={attribution}
            onChange={handleChange}
            name="attribution"
            className="w-full p-inputtext-sm"
          />
        </div>
        <div>
          <Button
            onClick={submitPhotoForm}
            label="Ajouter"
            type="button"
            className="p-button-sm"
          />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="list"
            >
              {photos.map((photo, index) => (
                <Draggable key={photo.id} draggableId={photo.id} index={index}>
                  {(provided, snapshot) =>
                    renderItem(photo, provided, snapshot)
                  }
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Style>
  );
}

// Style
const Style = styled.div`
  .list {
    background: lightgrey;
    display: flex;
    padding: 8px;
    overflow: auto;
  }

  .item {
    user-select: none;
    width: 100px;
    padding: 2px;
    margin: 0 8px 0 0;

    // change background colour if dragging
    background: grey;
    position: relative;

    &.dragging {
      background: lightgreen;
    }
  }

  .delete-button {
    position: absolute;
    top: 0;
    right: 0;
  }

  .view-button {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .img-wrapper {
    width: 100%;
    position: relative;
    padding-bottom: 100%;
    overflow: hidden;
  }

  .photo-form {
    max-width: 500px;
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
  }
`;
