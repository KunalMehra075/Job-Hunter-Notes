import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Masonry from "react-masonry-css";
import ParagraphCard from "./ParagraphCard";
import AddNote from "./AddNote";
import axios from "axios";
import swalAlert from "../utils/swalAlert";
import { BaseURL } from "../utils/BaseURL";

const NotesContainer = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const breakpointColumns = {
    default: 5,
    1280: 5, // lg
    1024: 3, // md
    768: 2, // sm
    640: 1, // xs
  };

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BaseURL}/notes`);
      const sortedNotes = response.data.sort((a, b) => a.order - b.order);
      setNotes(sortedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
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

  const handleDelete = async (id) => {
    const result = await swalAlert(
      "Are you sure you want to delete this note?",
      "This action cannot be undone.",
      "warning",
      12000
    );
    try {
      if (result.isConfirmed) {
        await axios.delete(`${BaseURL}/notes/${id}`);
        fetchNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
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

    try {
      await axios.put(`${BaseURL}/notes/reorder`, {
        notes: updatedItems.map(({ _id, order }) => ({ _id, order })),
      });
    } catch (error) {
      console.error("Error updating note order:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 overflow-x-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <>
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
                            className={`mb-4 transition-all duration-300 ease-in-out ${
                              snapshot.isDragging ? "shadow-2xl scale-105" : ""
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              transform: snapshot.isDragging
                                ? provided.draggableProps.style?.transform
                                : "none",
                            }}
                          >
                            <ParagraphCard
                              title={note.title}
                              paragraph={note.paragraph}
                              onEdit={(newTitle, newParagraph) =>
                                handleEdit(note._id, newTitle, newParagraph)
                              }
                              onDelete={() => handleDelete(note._id)}
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
        </>
      )}
    </div>
  );
};

export default NotesContainer;
