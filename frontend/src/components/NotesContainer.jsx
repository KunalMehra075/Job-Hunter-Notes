import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Masonry from "react-masonry-css";
import ParagraphCard from "./ParagraphCard";
import AddNote from "./AddNote";
import axios from "axios";
import BaseURL from "../utils/BaseURL";

const NotesContainer = () => {
  const [notes, setNotes] = useState([]);

  const breakpointColumns = {
    default: 4,
    1280: 4, // lg
    1024: 3, // md
    768: 2, // sm
    640: 1, // xs
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${BaseURL}/notes`);
      // Sort notes by order
      const sortedNotes = response.data.sort((a, b) => a.order - b.order);
      setNotes(sortedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleEdit = async (id, newTitle, newParagraph) => {
    try {
      await axios.put(`${BaseURL}/notes/${id}`, {
        title: newTitle,
        paragraph: newParagraph,
      });
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setNotes(updatedItems);

    // Update order in backend
    try {
      await axios.put(`${BaseURL}/notes/reorder`, {
        notes: updatedItems.map(({ _id, order }) => ({ _id, order })),
      });
    } catch (error) {
      console.error("Error updating note order:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <AddNote onNoteAdded={fetchNotes} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="notes" direction="horizontal">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
              >
                {notes.map((note, index) => (
                  <Draggable
                    key={note._id}
                    draggableId={note._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`mb-4 ${
                          snapshot.isDragging ? "shadow-2xl" : ""
                        } transition-shadow duration-200`}
                      >
                        <ParagraphCard
                          title={note.title}
                          paragraph={note.paragraph}
                          onEdit={(newTitle, newParagraph) =>
                            handleEdit(note._id, newTitle, newParagraph)
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Masonry>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default NotesContainer;
