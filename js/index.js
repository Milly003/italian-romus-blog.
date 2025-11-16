function marcarMenuAtivo(pagina) {
  const links = document.querySelectorAll("nav a");
  links.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("onclick")?.includes(pagina)) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  let carouselInterval = null;

  function ativarBotaoInscrever() {
    const botaoInscrever = document.getElementById("btnInscrever");
    if (!botaoInscrever) return;

    botaoInscrever.addEventListener("click", () => {
      botaoInscrever.classList.toggle("inscrito");

      botaoInscrever.textContent = botaoInscrever.classList.contains("inscrito")
        ? "Inscrito"
        : "Inscreva-se";
    });
  }

  const carregarComponente = (caminho, seletor, inserirComoHTML = false) => {
    fetch(caminho)
      .then(res => {
        if (!res.ok) throw new Error(`Erro ao carregar ${caminho} (status ${res.status})`);
        return res.text();
      })
      .then(data => {
        const el = document.querySelector(seletor);
        if (el) {
          if (inserirComoHTML) el.insertAdjacentHTML("beforeend", data);
          else el.innerHTML = data;

          if (caminho.includes("header.html")) {
            ativarBotaoInscrever();
          }
        }
      })
      .catch(err => console.error(err));
  };

  function mostrarReceita(id) {
    const receita = document.getElementById(id);

    if (receita.style.display === "none" || receita.style.display === "") {
      receita.style.display = "block";
    } else {
      receita.style.display = "none";
    }
  }

  document.addEventListener("click", (e) => {
    const bot = e.target.closest(".botao-prato");
    if (!bot) return;        

    e.preventDefault();       

    const card = bot.closest(".pratos_massa, .pratos_peixe, .pratos_pizza, .pratos_carne, .pratos_risoto, .sobremesa_panna, .sobremesa_tiramisu");

    const container = card || bot.parentElement;

    const receita = container.querySelector(".receita-oculta");
    if (!receita) {
      console.warn("Receita não encontrada neste card:", container);
      return;
    }

    const isHidden = getComputedStyle(receita).display === "none";
    receita.style.display = isHidden ? "block" : "none";

    bot.textContent = isHidden ? "Esconder receita" : "Receita completa";
  });
  document.addEventListener("submit", (event) => {
    const form = event.target;

    if (form.querySelector("#msgEnviado")) {
      event.preventDefault();

      const msg = form.querySelector("#msgEnviado");
      msg.style.display = "block";
      form.reset();
      setTimeout(() => msg.style.display = "none", 4000);
    }
  });

  carregarComponente("./components/header.html", "#header", false);
  fetch("./components/header.html")
    .then(res => res.text())
    .then(html => {
      document.querySelector("#header").innerHTML = html;
      ativarBotaoInscrever();
    });
  carregarComponente("./components/footer.html", "#footer");

  fetch("./components/imagens.html")
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar imagens.html");
      return res.text();
    })
    .then(data => {
      const imagensContainer = document.getElementById("imagens-container");
      if (imagensContainer) imagensContainer.innerHTML = data;
      else document.body.insertAdjacentHTML("beforeend", data);

      initCarousel();
    })
    .catch(err => console.error(err));
  function carregarPagina(pagina) {
    fetch(`./pages/${pagina}`)
      .then(res => {
        if (!res.ok) throw new Error(`Erro ao carregar ${pagina} (status ${res.status})`);
        return res.text();
      })
      .then(data => {
        const conteudo = document.getElementById("conteudo");
        if (conteudo) {
          conteudo.innerHTML = data;

          initCarousel();
          marcarMenuAtivo(pagina);
        }
      })
      .catch(err => console.error(err));
  }
  carregarPagina("home.html");
  window.carregarPagina = carregarPagina;

  function initCarousel() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
    const imgs = Array.from(document.querySelectorAll(".carousel img"));
    if (!imgs || imgs.length === 0) {
      return;
    }
    imgs.forEach(img => img.classList.remove("active"));
    let idx = 0;
    imgs[idx].classList.add("active");
    carouselInterval = setInterval(() => {
      imgs[idx].classList.remove("active");
      idx = (idx + 1) % imgs.length;
      imgs[idx].classList.add("active");
    }, 3000);
  }
});

