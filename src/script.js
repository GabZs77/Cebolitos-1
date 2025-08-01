* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

html, body {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: #fff;
  overflow: hidden;
}
.barra-tempo {
  height: 6px;
  margin-top: 8px;
  border-radius: 20px;
  background: linear-gradient(to right, #006400, #00a86b);
  animation: reduzir-barra 2.5s linear forwards;
}

@keyframes reduzir-barra {
  from { width: 100%; }
  to   { width: 0%; }
}
#centralizar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

#form {
  max-width: 500px;
  width: 100%;
  max-height: 460px;
  height: auto;
  padding: 40px 30px;
  background: rgba(15, 20, 20, 0.95); /* Mais escuro */
  border-radius: 20px;
  box-shadow: 0 0 25px rgba(0, 255, 128, 0.5), inset 0 0 5px rgba(0, 255, 128, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: aparecer 1s ease-out;
}

#form::before {
  content: "";
  position: absolute;
  width: 600px;
  height: 600px;
  top: -135px;
  left: -50px;
  right: 0px;
  bottom: 0px;
  border: 1px solid rgba(0, 255, 128, 0.5);
  border-radius: 30%;
  animation: spin 2s linear infinite;
  pointer-events: none;
}

#form::after {
  content: "";
  position: absolute;
  width: 600px;
  height: 600px;
  top: -135px;
  left: -50px;
  right: 0px;
  bottom: 0px;
  border: 2px solid rgba(0, 255, 128, 0.5);
  border-radius: 20%;
  animation: spinContrario 2s linear infinite;
  pointer-events: none;
}

#form h1 {
  font-size: 30px;
  margin-bottom: 30px;
  color: #00e676;
  text-shadow: 0 0 3px rgba(0, 255, 128, 0.4);
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

#Enviar input {
  width: 90%;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.07);
  color: white;
  font-size: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

#Enviar input:focus {
  background-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 5px #00e676;
}

#Enviar input::placeholder {
  color: #ccc;
}

.Mostrar {
  position: relative;
  width: 90%;
  height: 40px;
}

#Enviar .Mostrar input{
  position: absolute;
  width: 100%;
}

.Mostrar button {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-33%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.Mostrar button img{
  width: 25px;
  height: 25px;
  margin-right: 5px;
}

#Logar {
  width: 90%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #00c853, #00e676);
  background-size: 200%;
  background-position: left;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 255, 128, 0.3);
}

#Logar:hover {
  background-position: right;
  transform: translateY(-2px);
  box-shadow: 0 0 15px #00e676;
}

#Corrigir {
  width: 90%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #00c853, #00e676);
  background-size: 200%;
  background-position: left;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 255, 128, 0.3);
}

#Corrigir:hover {
  background-position: right;
  transform: translateY(-2px);
  box-shadow: 0 0 15px #00e676;
}

#prova {
  width: 90%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #00c853, #00e676);
  background-size: 200%;
  background-position: left;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 255, 128, 0.3);
}

#prova:hover {
  background-position: right;
  transform: translateY(-2px);
  box-shadow: 0 0 15px #00e676;
}

#TamanhoN {
  position: absolute;
  bottom: 6%;
  left: 1%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 80%;
  overflow-y: auto;
  max-width: 80%;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.Notificacao {
  background: linear-gradient(135deg, rgba(0, 50, 25, 0.6), rgba(0, 100, 50, 0.6));
  padding: 10px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  max-width: 100%;
}

#ajuste {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  width: auto;
}

#ajuste p {
  font-weight: bolder;
  font-size: 16px;
  font-family: cursive;
  font-style: oblique;
  color: #ccc;
  margin: auto;
}

#git {
  width: 30px;
  height: 30px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

@keyframes sumir {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100vw);
  }
}

@keyframes AparecerBonito {
  from{
    transform: translateX(-100vw);
  }
  to{
    transform: translateX(0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinContrario {
  0%{
    transform: rotate(-0deg);
  }
  100%{
    transform: rotate(-360deg);
  }
}
