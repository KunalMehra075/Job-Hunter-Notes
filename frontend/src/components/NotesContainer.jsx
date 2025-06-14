import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Masonry from "react-masonry-css";
import ParagraphCard from "./ParagraphCard";
import AddNote from "./AddNote";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
      toast.success("Note updated successfully");
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Error updating note");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      background: "#1e2939",
      color: "#ffffff",
      customClass: {
        popup: "dark-theme-popup",
        title: "dark-theme-title",
        content: "dark-theme-content",
      },
    });

    try {
      if (result.isConfirmed) {
        await axios.delete(`${BaseURL}/notes/${id}`);
        fetchNotes();
        toast.success("Note deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error deleting note");
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
      {notes.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl font-bold">No notes found</p>
        </div>
      ) : isLoading ? (
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
