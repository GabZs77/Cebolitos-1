
let MostrarSenha = document.getElementById("VerSenha");
let Senha = document.getElementById("senha");
let imagem = document.getElementById("OlhoVer");

MostrarSenha.addEventListener("click", () => {
    if (Senha.type === "password") {
        Senha.type = "text";
        imagem.src = "visivel.png";
    } else {
        Senha.type = "password";
        imagem.src = "olho.png";
    }
});

function Atividade(Titulo, Atividade, tempo = 2500) {
    const div = document.createElement("div");
    div.className = "Notificacao";

    const h1 = document.createElement("h1");
    h1.textContent = Titulo;

    const p = document.createElement("p");
    p.textContent = Atividade;

    const barraTempo = document.createElement("div");
    barraTempo.className = "barra-tempo";
  
    div.appendChild(h1);
    div.appendChild(p);
    div.appendChild(barraTempo);

    const article = document.getElementById("TamanhoN");
    article.appendChild(div);

    div.style.animation = "AparecerBonito 1s ease";

    setTimeout(() => {
        div.style.animation = "sumir 1s ease";
        div.addEventListener("animationstart", () => {
          setTimeout(() => {
              const interval = setInterval(() => {
                  const currentScroll = article.scrollTop;
                  const targetScroll = article.scrollHeight;
                  const distance = targetScroll - currentScroll;
                  
                  article.scrollTop += distance * 0.4;
      
                  if (distance < 1) {
                      clearInterval(interval);
                  }
              }, 16);
          }, 200);
      });

        div.addEventListener("animationend", () => {
          div.remove();
        })
    }, tempo);
}
document.getElementById('Enviar').addEventListener('submit', (e) => {
  e.preventDefault();
  
function sendRequest() {
  Atividade('SISTEMA','Cebolitos desligado!');
}

sendRequest();
});
