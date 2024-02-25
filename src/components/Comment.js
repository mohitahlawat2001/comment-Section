import { useState, useRef, useEffect } from "react";
import Action from "./Action";
import { ReactComponent as DownArrow } from "../assets/down.svg";
import { ReactComponent as UpArrow } from "../assets/up.svg";
import "./Comment.css";

const Comment = ({
  handleInsertNode,
  handleEditNode,
  handleDeleteNode,
  comment,
}) => {
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(false);
  const inputRef = useRef(null);
    const [sortOrder, setSortOrder] = useState("asc"); // Initial sort order
    const [sortByReplies, setSortByReplies] = useState(false); // New state for sorting by replies


  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  const handleNewComment = () => {
    setExpand(!expand);
    setShowInput(true);
  };

  const onAddComment = () => {
    if (editMode) {
      handleEditNode(comment.id, inputRef?.current?.innerText);
    } else {
      setExpand(true);
      handleInsertNode(comment.id, input);
      setShowInput(false);
      setInput("");
    }

    if (editMode) setEditMode(false);
  };

  const handleDelete = () => {
    handleDeleteNode(comment.id);
  };

  return (
    <div className="comment-container">
      <div className="sort-buttons">
        <button
          className="sort-button"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </button>
        <button className="sort-button" onClick={() => setSortByReplies(!sortByReplies)}>
          Sort by Replies
        </button>
      </div>

      {comment.id === 1 ? (
        <div className="input-container">
          <input
            type="text"
            className="input-container__input first_input"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type..."
          />
          <Action
            className="reply comment comment-button"
            type="COMMENT"
            handleClick={onAddComment}
          />
        </div>
      ) : (
        <div className="comment-content">
          <span
            contentEditable={editMode}
            suppressContentEditableWarning={editMode}
            ref={inputRef}
            style={{ wordWrap: "break-word" }}
            className="comment-text"
          >
            {comment.name}
          </span>
          <div className="reply-actions">
            {editMode ? (
              <>
                <Action
                  className="reply"
                  type="SAVE"
                  handleClick={onAddComment}
                />
                <Action
                  className="reply"
                  type="CANCEL"
                  handleClick={() => {
                    if (inputRef.current)
                      inputRef.current.innerText = comment.name;
                    setEditMode(false);
                  }}
                />
              </>
            ) : (
              <>
                <Action
                  className="reply"
                  type={
                    <>
                      {expand ? (
                        <UpArrow width="10px" height="10px" />
                      ) : (
                        <DownArrow width="10px" height="10px" />
                      )}{" "}
                      REPLY
                    </>
                  }
                  handleClick={handleNewComment}
                />
                <Action
                  className="reply"
                  type="EDIT"
                  handleClick={() => setEditMode(true)}
                />
                <Action
                  className="reply"
                  type="DELETE"
                  handleClick={handleDelete}
                />
              </>
            )}
          </div>
        </div>
      )}

      {showInput && (
        <div className="input-container">
          <input
            type="text"
            className="input-container__input"
            autoFocus
            onChange={(e) => setInput(e.target.value)}
          />
          <Action className="reply" type="REPLY" handleClick={onAddComment} />
          <Action
            className="reply"
            type="CANCEL"
            handleClick={() => {
              setShowInput(false);
              if (!comment?.items?.length) setExpand(false);
            }}
          />
        </div>
      )}

      {comment?.items
        ?.sort((a, b) => {
            // ... sorting logic
            // Sort based on replies if sortByReplies is true
     if (sortByReplies) {
      return b.items.length - a.items.length; // Descending order of replies
     } else {
      return (sortOrder === "asc" ? a.id - b.id : b.id - a.id); // Sort by ID
     }
        })
        .map((cmnt) => (
          <Comment
            key={cmnt.id}
            handleInsertNode={handleInsertNode}
            handleEditNode={handleEditNode}
            handleDeleteNode={handleDeleteNode}
            comment={cmnt}
          />
        ))}
    </div>
  );
};

export default Comment;