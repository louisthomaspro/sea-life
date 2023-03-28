import { useEffect, useImperativeHandle, useState } from "react";
import { toast } from "react-toastify";
import { ISpecies, ISpeciesPhoto } from "../../types/Species";
import { saveNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import styled from "styled-components";
import TrashCanSvg from "../../public/icons/fontawesome/light/trash-can.svg";
import Image from "next/image";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { InputText } from "primereact/inputtext";
import MyButton from "../commons/MyButton";
import { StrictModeDroppable } from "../../utils/StrictModeDroppable";

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const PhotosForm = (props: {
  species: ISpecies;
  submitCallback: any;
  forwardedRef: React.ForwardedRef<any>;
}) => {
  const [photos, setPhotos] = useState<ISpeciesPhoto[]>([]);

  const [originalUrl, setOriginalUrl] = useState("");
  const [attribution, setAttribution] = useState("");

  useEffect(() => {
    setPhotos(props.species.photos);
  }, [props.species.photos]);

  const renderItem =
    // eslint-disable-next-line react/display-name
    (photo: any, provided: any, snapshot: any, index: number) => (
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
              fill
              style={{ objectFit: "cover" }}
              sizes="50vw"
              alt=""
            />
          </div>
          <TrashCanSvg
            aria-label="drag-icon"
            className="svg-icon-destructive"
            style={{
              width: "16px",
            }}
            onClick={() => {
              const newPhotos = [...photos];
              newPhotos.splice(index, 1);
              setPhotos(newPhotos);
            }}
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

  const submitPhotoForm = async () => {
    if (originalUrl) {
      const photo: ISpeciesPhoto = {
        // id: uuidv4(),
        // storage_path: null,
        original_url: originalUrl,
        attribution: attribution ?? null,
        blurhash: null,
      };

      const blurhash = await fetch("/api/getBlurhash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: photo.original_url }),
      }).then((res) => res.json());

      photo.blurhash = await blurhash;

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

  useImperativeHandle(props.forwardedRef, () => ({
    submit: async () => {
      let newData = {
        photos: photos,
      };

      await saveNewSpeciesVersion(props.species.id, newData);

      // display success toast
      toast.success("Photos sauvegardées", {
        autoClose: 2000,
        toastId: "successPublication",
      });

      props.submitCallback();
    },
  }));

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
          <MyButton onClick={submitPhotoForm}>Ajouter</MyButton>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="list"
            >
              {photos.map((photo, index) => (
                <Draggable
                  key={`photo-${index}`}
                  draggableId={`photo-${index}`}
                  index={index}
                >
                  {(provided, snapshot) =>
                    renderItem(photo, provided, snapshot, index)
                  }
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </Style>
  );
};

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

export default PhotosForm;
