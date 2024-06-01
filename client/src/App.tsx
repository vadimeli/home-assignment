import {useEffect, useState} from "react";
import { Header } from "./components";
import { PostData, UserData } from "./types";
import "./App.css";
import {UserAvatar} from "./components/UserAvatar";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Badge from '@mui/material/Badge';
import {PostEditor} from "./components/PostEditor";
import Dialog from "@mui/material/Dialog";
import {Tooltip} from "@mui/material";

function App() {
    const [activeUserId, setActiveUserId] = useState(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deletePostId, setDeletePostId] = useState(null);
    const [activePost, setActivePost] = useState<PostData>(null)

    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then((json) => {
                setUsers(json)
            });

        fetch("http://localhost:3000/posts")
            .then((res) => res.json())
            .then((json) => {
                setPosts(json.sort((a,b) => Date.parse(b.date) - Date.parse(a.date)))
            });
    }, [])

    const openEditor = () => setIsPostEditorOpen(true);
    const closeEditor = () => setIsPostEditorOpen(false);

    const getUserByPost = (userId) => {
        return users.find(item => item.id === userId) ||  {id: 0, name: "" };
    }

    const getDate = (date) => {
        const ts = new Date(date);
        return ts.toLocaleString()
    }

    const showDeleteConfirmDialog = (id) => {
        setDeletePostId(id);
        setIsDeleteConfirmOpen(true);
    }

    const handleCloseDeleteConfirm = () => {
        setDeletePostId(null);
        setIsDeleteConfirmOpen(false);
    }

    const handleDelete = () => {
        fetch(`http://localhost:3000/delete/${deletePostId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => setPosts(data.sort((a,b) => Date.parse(b.date) - Date.parse(a.date))))

        handleCloseDeleteConfirm();
    }

    const handleEditPost = (post) => {
        setActivePost(post);
        openEditor();
    }

    const handleLike = (postId) => {
        fetch('http://localhost:3000/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: postId,
                userId: activeUserId,
                name: users.find(item => item.id === activeUserId)?.name
            })
        })
            .then(response => response.json())
            .then(data => setPosts(data.sort((a,b) => Date.parse(b.date) - Date.parse(a.date))))
    }

    return (
        <>
            <Header openPostEditor={openEditor} users={users} activeUserId={activeUserId} setActiveUserId={setActiveUserId} />
            <div className="posts-wrapper">
                {posts.map((post) => {
                    return <div className="post" key={post.id}>
                        <div className='header'>
                            <UserAvatar user={getUserByPost(post.userId)} className="user-avatar" />
                            <div>
                                <div className='title'>{getUserByPost(post.userId).name}</div>
                                <div>{getDate(post.date)}</div>
                            </div>
                        </div>
                        {post.imageUrl && <div className={'image-wrapper'}><img src={post.imageUrl} alt={'image'} className='image'/></div>}
                        <div>
                            {post.content}
                        </div>
                        <div className='footer'>
                            <div className='action-icons'>
                                <EditIcon onClick={() => activeUserId === post.userId && handleEditPost(post)} />
                                <DeleteIcon onClick={() => activeUserId === post.userId && showDeleteConfirmDialog(post.id)} />
                            </div>
                            <div className='like-wrapper'>
                                <Tooltip title={<ul>{post.like?.map(item => <li key={item.userId}>{item.name}</li>)}</ul>} placement="top">
                                    <Badge
                                        badgeContent={post.like?.length}
                                        color="primary" className={'badge'}
                                    />
                                </Tooltip>
                                <ThumbUpIcon color="primary" onClick={() => {handleLike(post.id)}}/>
                            </div>
                        </div>
                    </div>
                })}


            </div>

            <PostEditor isPostEditorOpen={isPostEditorOpen}
                        closeEditor={closeEditor}
                        setPosts={setPosts}
                        activeUserId={activeUserId}
                        activePost={activePost}
                        setActivePost={setActivePost}
            />

            <Dialog onClose={handleCloseDeleteConfirm} open={isDeleteConfirmOpen} maxWidth='true'>
                <div className={'delete-confirm'}>
                    <div>Are you sure you want to delete this post?</div>
                    <div className={'action-buttons'}>
                        <button onClick={handleCloseDeleteConfirm}>Cancel</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default App;
