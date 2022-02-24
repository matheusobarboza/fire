import React, { useState, useEffect } from "react";
import "./style.css";
import firebase from "./firebaseConnection";

function App() {
  const [idPost, setIdPost] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [posts, setPosts] = useState([]);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  //Fica monitorando para executar ações
  useEffect(() => {
    const loadPosts = async () => {
      await firebase
        .firestore()
        .collection("posts")
        .onSnapshot((doc) => {
          let meusPosts = [];

          doc.forEach((item) => {
            meusPosts.push({
              id: item.id,
              titulo: item.data().titulo,
              autor: item.data().autor
            });
          });

          setPosts(meusPosts);
        });
    };

    loadPosts();
  }, []);

  //Adiciona um post
  const handleAdd = async () => {
    await firebase
      .firestore()
      .collection("posts")
      .add({
        titulo: title,
        autor: author
      })
      .then(() => {
        console.log("Dados cadastrados com sucesso!");
        setTitle("");
        setAuthor("");
      })
      .catch((err) => {
        console.log("Gerou agum erro:" + err);
      });
  };

  //Busca um post específico
  const buscaPost = async () => {
    // await firebase.firestore().collection('posts')
    // .doc('123')
    // .get()
    // .then((snapshot) => {
    //   setTitle(snapshot.data().titulo)
    //   setAuthor(snapshot.data().autor)
    // })

    // .catch(() => {
    //   console.log('Deu algum erro');
    // })

    await firebase
      .firestore()
      .collection("posts")
      .get()
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          });
        });

        setPosts(lista);
      })
      .catch(() => {
        console.log("Deu algum erro!");
      });
  };

  //Editar Post
  const editPost = async () => {
    await firebase
      .firestore()
      .collection("posts")
      .doc(idPost)
      .update({
        titulo: title,
        autor: author
      })
      .then(() => {
        console.log("Dados atualizados com sucesso!");
        setIdPost("");
        setTitle("");
        setAuthor("");
      })
      .catch(() => {
        console.log("Erro!");
      });
  };

  //Excluir Post
  const excluirPost = async (id) => {
    await firebase
      .firestore()
      .collection("posts")
      .doc(id)
      .delete()
      .then(() => {
        alert("Este Post foi excluído com sucesso!");
      });
  };

  //Cadastrar Usuário
  const cadastrarUser = async () => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then((value) => {
        console.log(value);
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca!");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Esse email já existe!");
        }
      });
  };

  return (
    <div>
      <h1>React Js + Firebase</h1> <br />
      <div className="container">
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button onClick={cadastrarUser}>Cadastrar</button>
      </div>
      <hr /> <br />
      <div className="container">
        <h2>Banco de Dados</h2>
        <label>ID:</label>
        <textarea
          type="text"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <label>Título: </label>
        <textarea
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Autor: </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />{" "}
        <br />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscaPost}>Buscar Post</button>
        <button onClick={editPost}>Editar</button> <br />
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <span>ID - {post.id}</span> <br />
                <span>Título: {post.titulo}</span> <br />
                <span>Autor: {post.autor}</span> <br />
                <button onClick={() => excluirPost(post.id)}>
                  Excluir Post
                </button>{" "}
                <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
