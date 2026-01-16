import { useEffect, useState } from "react";
import api from "../services/api";

export default function GroupBox() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const res = await api.get("/groups");
    setGroups(res.data);
  };

  const joinGroup = async (group_id) => {
    await api.post("/groups/join", { group_id, user_id: user.user_id });
    setSelectedGroup(group_id);
    loadPosts(group_id);
  };

  const loadPosts = async (group_id) => {
    const res = await api.get(`/groups/posts/${group_id}`);
    setPosts(res.data);
  };

  const createPost = async () => {
    await api.post("/groups/post", {
      group_id: selectedGroup,
      user_id: user.user_id,
      content: postText
    });
    setPostText("");
    loadPosts(selectedGroup);
  };

  return (
  <div>
    <h3>Support Groups</h3>

    {groups.map(g => (
      <div key={g.group_id} style={{marginBottom:10}}>
        <b>{g.name}</b>
        <button onClick={() => joinGroup(g.group_id)} style={{marginLeft:10}}>Join</button>
      </div>
    ))}

    {selectedGroup && (
      <>
        <h4>Group Posts</h4>
        <div style={{
          background:"#f8fafc",
          padding:10,
          borderRadius:8,
          marginBottom:10
        }}>
          {posts.map((p,i)=>(
            <p key={i}>{p.content}</p>
          ))}
        </div>

        <input value={postText} onChange={e=>setPostText(e.target.value)} />
        <button onClick={createPost}>Post</button>
      </>
    )}
  </div>
);

}
