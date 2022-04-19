import React, { useState } from "react";
import "./style.css";
import firebase from "./firebaseConnection";

function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [nome, setNome] = useState("");

  const [user, setUser] = useState({});

  //Cadastrar Usuário
  const cadastrarUser = async () => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {
        await firebase
          .firestore()
          .collection("users")
          .doc(value.user.uid)
          .set({
            nome: nome,
            cargo: cargo,
            status: true,
          })
          .then(() => {
            alert("Usuário cadastrado com sucesso!");
            setNome("");
            setCargo("");
            setEmail("");
            setSenha("");
          });
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca!");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Esse email já existe!");
        }
      });
  };

  const logout = async () => {
    await firebase.auth().signOut();
    setUser({});
  };

  const onLogin = async () => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then(async (value) => {
        await firebase
          .firestore()
          .collection("users")
          .doc(value.user.uid)
          .get()
          .then((snapshot) => {
            setUser({
              nome: snapshot.data().nome,
              cargo: snapshot.data().cargo,
              status: snapshot.data().status,
              email: value.user.email,
            });
          });
      })
      .catch((error) => {
        console.log("Erro ao logar" + error);
      });
  };

  return (
    <div>
      <h1>React Js + Firebase</h1> <br />
      <div className="container">
        <label>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />{" "}
        <br />
        <label>Cargo</label>
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />{" "}
        <br />
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <br />
        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />{" "}
        <br />
        <button onClick={onLogin}>Login</button>
        <button onClick={cadastrarUser}>Cadastrar</button>
        <button onClick={logout}>Sair</button>
      </div>

      <hr/> <br/>
      
      {Object.keys(user).length > 0 && (  //Object.keys verifica se existe algo dentro de um objeto
        <div>
          <strong>Olá: </strong> {user.nome} <br/>
          <strong>Cargo: </strong> {user.cargo} <br/>
          <strong>Email: </strong> {user.email} <br/>
          <strong>Status: </strong> {user.status ? 'ATIVO' : 'INATIVO'} <br/>
        </div>
      )}
    </div>
  );
}

export default App;
