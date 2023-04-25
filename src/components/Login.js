import Sha256 from "crypto-js/sha256";

async function Login(init) {
  const p = "359a45b4cca364544a144a97334cbe864d886a4a5225385cef98eb871411079e";

  document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    body.innerHTML = `
          <div id="login">
                <div id="meta">
		            Ricardo Cabret <br>
		            <i>Guión Criptografico 3.0.0</i> (2022)<br><br>
		            <p>A web application written in Javascript that encrypts text and renders abstract compositions based on ciphertexts.</p>
                </div>
                <form id="form">
                    <input id="login-input" placeholder="password" type="password" />
                    <input type="submit" value="enter"  />
                </form>	        
		  </div>`;

    const form = document.querySelector("#form");

    const openApp = () => {
      form.removeEventListener("submit", onEnter);
      body.innerHTML = "";
      if (typeof init === "function") {
        init();
      }
    };
    const onEnter = (e) => {
      e.preventDefault();
      const input = document.querySelector("#login-input");
      const encryptedAttempt = Sha256(input.value.trim()).toString();
      if (encryptedAttempt === p) {
        openApp();
      } else {
        alert("Wrong credentials");
      }
    };
    form.addEventListener("submit", onEnter);
  });
}

export default Login;
