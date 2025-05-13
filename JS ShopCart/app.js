let cajaVerde = document.querySelectorAll(".dragtarget");
let cajaAzul = document.querySelector("#droptarget");
let carro = document.querySelector("#carro");
let text = "";
let itemArrastrado = null;

// cajaVerde.addEventListener("click", () => {
//   console.log("divVerde");
// });
cajaAzul.addEventListener("click", () => {
  //carro.classList.add("visible");
  carro.classList.toggle("visible");
  //setTimeout(() => {
    //carro.classList.remove("visible");
  //}, 2000);
});

cajaVerde.forEach((caja) => {
  caja.addEventListener("dragstart", (e) => {
    itemArrastrado = e.target;
    text = e.target.textContent;
    // console.log(itemArrastrado);
  });
});
//Eventos drag para el elemento arrastable
// cajaVerde.addEventListener("dragstart", (e) => {
//   console.log("eventoDragStart");
// });
// cajaVerde.addEventListener("drag", (e) => {
// itemArrastrado = e.target

// });
// cajaVerde.addEventListener("dragend", (e) => {
//   console.log("dragEnd");
// });
//Eventos para el elemento que puede recibir a otro que sea arrastrado

cajaAzul.addEventListener("dragenter", (e) => {
  e.preventDefault();
  console.log("dragEnter");
});
cajaAzul.addEventListener("dragover", (e) => {
  e.preventDefault();
  console.log("dragOver");
});
cajaAzul.addEventListener("drop", (e) => {
  //   console.log(e.target);

  //   console.log("drop");
  console.log(itemArrastrado);
  let span = document.createElement("span");
  span.innerHTML = itemArrastrado.textContent;
  carro.appendChild(span);
  // carro.classList.add("visible");
  // setTimeout(()=>{
  //   carro.classList.remove("visible");

  // },2000)
  itemArrastrado.innerHTML = "";
  e.target.textContent = text;
});
cajaAzul.addEventListener("dragleave", (e) => {
  console.log("dragLeave");
});
