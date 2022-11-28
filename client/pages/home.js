import styled from "styled-components";
import { useEffect, useState } from "react";

const Input = styled.input`
border-radius: 1rem;
min-width: 500px;
height: 200px;
background-color: white;
border: 1px solid black;
color: black;
padding: 0.5rem;
width: 100%;
`

const Layout = styled.div`
width: 60vw;
display: flex;
flex-direction: column;
`

const Header = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
height: 100%;
align-items: center;
`

const EditingCont = styled.div`
padding-bottom: 4rem;
`

const PostCont = styled.div`
min-height: 200px;
border-radius: 1rem;
width: 100%;
height: 100%;
background-color: lightgrey;
border: 1px solid black;
color: black;
padding: 0.5rem;
min-width: 500px;
display: flex;
flex-direction: column;
justify-content: space-between;

`

const Posts = styled.div`
display: flex;
flex-direction: column;
gap: 2rem;
`

const BtnCont = styled.div`
width: 100%;
`

const Button = styled.button`
height: 100%;
`

export default function Home() {

  const [isAddingPost, setIsAddingPost] = useState(false);

  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/get-posts`).then(async (res) => {
      const data = await res.json()
      setPosts(data.posts);
    });
  })

  const updatePost = (e) => {
    setPost(e.target.value);
  }

  const addToPosts = () => {
    setPosts([...posts, post]);

    fetch(`http://localhost:3001/new-post?post=${post}`).then(async (res) => console.log(await res.json()));

    setPost('');
    setIsAddingPost(false);
  };

  return <Layout>
    <Header>
      <h1>Posts</h1>
      <Button
        onClick={setIsAddingPost}
      >Add a post</Button>
    </Header>
    <div>
      {
        isAddingPost && <EditingCont>
          <Input
            placeholder="Add a new post here.."
            type="text" value={post} onChange={updatePost}></Input>
          <BtnCont>
            <button
              onClick={() => setIsAddingPost(false)}
            >Cancel</button>
            <button onClick={addToPosts}>Post</button>
          </BtnCont>
        </EditingCont>
      }
      <Posts>
        {posts.map(n => <PostCont key={n}>{n}
          <div>
            <button>Edit</button>
            <button>Report</button>
            <button>Follow</button>
          </div>

        </PostCont>)}
      </Posts>
    </div>
  </Layout>
};
