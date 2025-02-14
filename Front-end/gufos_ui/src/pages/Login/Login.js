import React, { Component } from "react";
import { parseJwt } from "../../services/auth";
import { Link, withRouter } from "react-router-dom";

import logo from "../../assets/img/icon-login.png";

import "../../assets/css/login.css";
import api from "../../services/api";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      senha: "",
      erroMensagem: ""
    };
  }

  atualizaEstadoEmail(event) {
    this.setState({ email: event.target.value });
  }

  atualizaEstadoSenha(event) {
    this.setState({ senha: event.target.value });
  }

  efetuaLogin(event) {
    event.preventDefault();

    // alert(this.state.email + " - " + this.state.senha);
    let config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    };

    api.post("/login", {
        email: this.state.email,
        senha: this.state.senha
      })
      .then(data => {
        console.log("status", data.status);
        if (data.status === 200) {
          console.log(data);
          localStorage.setItem("usuario-gufos", data.data.token);

          //Verifica o tipo de usuário e redireciona para a página default
          console.log("parse", parseJwt().permissao);

          if (parseJwt().permissao == "Administrador") {
            this.props.history.push("/eventos/cadastrar");
          } else {
            this.props.history.push("/eventos");
          }
        }
      })
      .catch(erro => {
        this.setState({ erroMensagem: "Email ou senha inválido" });
        alert(this.state.erroMensagem);
      });
  }

  render() {
    return (
      <section className="container flex">
        <div className="img__login">
          <div className="img__overlay" />
        </div>

        <div className="item__login">
          <div className="row">
            <div className="item">
              <Link to="/">
                <img src={logo} className="icone__login" alt="SviGufo" />
              </Link>
            </div>
            <div className="item" id="item__title">
              <p className="text__login" id="item__description">
                Bem-vindo! Faça login para acessar sua conta.
              </p>
            </div>
            <form onSubmit={this.efetuaLogin.bind(this)}>
              <div className="item">
                <input
                  className="input__login"
                  placeholder="username"
                  type="text"
                  value={this.state.email}
                  onChange={this.atualizaEstadoEmail.bind(this)}
                  name="username"
                  id="login__email"
                />
              </div>
              <div className="item">
                <input
                  className="input__login"
                  placeholder="password"
                  value={this.state.senha}
                  onChange={this.atualizaEstadoSenha.bind(this)}
                  type="password"
                  name="password"
                  id="login__password"
                />
              </div>
              <p
                className="text__login"
                style={{ color: "red", textAlign: "center" }}
              >
                {this.state.erroMensagem}
              </p>
              <div className="item">
                <button
                  type="submit"
                  className="btn btn__login"
                  id="btn__login"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(Login);
