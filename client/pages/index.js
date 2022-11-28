import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Axios from "axios";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  height: 100vh;
`

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export default function SignUp() {

  const r = useRouter();

  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  const addUser = () => {
    Axios.post("http://localhost:3001/add-user", { name: name, password: password, email: email }).then(
      () => {
        console.log(name, password, email);
      }
    );
  };

  return (
    <Layout>
      <div>
        <h1>Welcome to our app!</h1>
        <p>Please sign up to begin.</p>
      </div>
      <LoginForm action="/home" method="post">
        <input
          type="text"
          placeholder='Enter your first name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={
            () => {
              addUser();
            }}
          >Sign Up</button>
      </LoginForm>
    </Layout>
  )
}
