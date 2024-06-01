import "./styles.css";
import Dialog from "@mui/material/Dialog";
import {useEffect, useState} from "react";
import {PostData} from "src/types";
import * as React from "react";

type PostEditorProps = {
  isPostEditorOpen: boolean;
  closeEditor: () => void;
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
  activeUserId: null | number;
  activePost: PostData;
  setActivePost: React.Dispatch<React.SetStateAction<PostData>>;
};

export const PostEditor: React.FC = ({isPostEditorOpen, closeEditor, setPosts, activeUserId, activePost,setActivePost}: PostEditorProps) => {
  const [textContent, setTextContent] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    activePost?.content && setTextContent(activePost.content);
    activePost?.imageUrl && setImageUrl(activePost.imageUrl);
  }, [activePost])

  const handleTextContent = (e) => {
    setTextContent(e.target.value)
  }
  const handleImageUrl = (e) => {
    setImageUrl(e.target.value)
  }
  const handleSubmit = () => {
    if(textContent.trim().length > 0) {
      if(activePost) {
        fetch('http://localhost:3000/edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: activePost.id,
            userId: activeUserId,
            date: new Date(),
            content: textContent,
            imageUrl:imageUrl
          })
        })
            .then(response => response.json())
            .then(data => setPosts(data.sort((a,b) => Date.parse(b.date) - Date.parse(a.date))))
      } else {
        fetch('http://localhost:3000/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: activeUserId,
            date: new Date(),
            content: textContent,
            imageUrl:imageUrl
          })
        })
            .then(response => response.json())
            .then(data => setPosts(data.sort((a,b) => Date.parse(b.date) - Date.parse(a.date))))
      }

      handleClose();
    }
  }

  const handleClose = () => {
    setTextContent('')
    setImageUrl('')
    setActivePost(null)
    closeEditor();
  }


  return <Dialog onClose={handleClose} open={isPostEditorOpen} maxWidth='true'>
    <div className={'post-editor-content'}>
      <textarea onChange={handleTextContent} value={textContent} />
      <div className='image-url'>
        image url: <input type={'text'} onChange={handleImageUrl} value={imageUrl} />
      </div>
      <div className={'action-buttons'}>
        <button onClick={handleClose}>Cancel</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  </Dialog>;
};
