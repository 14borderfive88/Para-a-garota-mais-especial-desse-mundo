const audio = document.getElementById('siteAudio');
const startButton = document.getElementById('startButton');
const miniPlay = document.getElementById('miniPlay');
const playerPlay = document.getElementById('playerPlay');
const musicMini = document.getElementById('musicMini');

const progress = document.getElementById('progress');
const volume = document.getElementById('volume');

const currentTimeLabel = document.getElementById('currentTime');
const durationLabel = document.getElementById('duration');

const toast = document.getElementById('toast');


// AVISOS NA TELA

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}


// ATUALIZAR PLAYER

function updateMusicUI() {
  const playing = !audio.paused && !audio.ended;

  musicMini.classList.toggle('playing', playing);

  miniPlay.textContent = playing ? 'Ⅱ' : '▶';
  playerPlay.textContent = playing ? 'Ⅱ' : '▶';

  miniPlay.setAttribute(
    'aria-label',
    playing ? 'Pausar música' : 'Reproduzir música'
  );

  playerPlay.setAttribute(
    'aria-label',
    playing ? 'Pausar música' : 'Reproduzir música'
  );
}


// REPRODUZIR MÚSICA

async function playMusic() {
  try {
    await audio.play();
    updateMusicUI();

  } catch (error) {
    showToast(
      'Não consegui iniciar o áudio. Confira se “I Will.mp3” está na pasta do site.'
    );

    updateMusicUI();
  }
}


// BOTÃO INICIAL

startButton.addEventListener('click', async () => {

  document.getElementById('recado').scrollIntoView({
    behavior: 'smooth'
  });

  await playMusic();

  startButton.textContent = 'Surpresa iniciada ♡';
  startButton.disabled = true;
  startButton.style.opacity = '.75';

  createHearts(12);

});


// PLAY E PAUSE

async function toggleMusic() {

  if (audio.paused) {
    await playMusic();
  } else {
    audio.pause();
  }

  updateMusicUI();

}

miniPlay.addEventListener('click', toggleMusic);
playerPlay.addEventListener('click', toggleMusic);


// CONTROLE DE VOLUME

volume.addEventListener('input', () => {
  audio.volume = Number(volume.value);
});

audio.volume = Number(volume.value);


// TEMPO DA MÚSICA

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return '0:00';
  }

  const mins = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${mins}:${secs}`;

}


// DURAÇÃO TOTAL

audio.addEventListener('loadedmetadata', () => {

  durationLabel.textContent = formatTime(audio.duration);

});


// BARRA DE PROGRESSO

audio.addEventListener('timeupdate', () => {

  currentTimeLabel.textContent = formatTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {

    progress.value =
      (audio.currentTime / audio.duration) * 100;

  }

});


// AVANÇAR OU VOLTAR NA MÚSICA

progress.addEventListener('input', () => {

  if (Number.isFinite(audio.duration) && audio.duration > 0) {

    audio.currentTime =
      (Number(progress.value) / 100) * audio.duration;

  }

});


// EVENTOS DO PLAYER

audio.addEventListener('play', updateMusicUI);
audio.addEventListener('pause', updateMusicUI);
audio.addEventListener('ended', updateMusicUI);


// PRESENTES INTERATIVOS

const giftCards = document.querySelectorAll('.gift-card');

const stages = {

  flowers: document.getElementById('flowersStage'),

  chocolate: document.getElementById('chocolateStage'),

  plush: document.getElementById('plushStage'),

  hug: document.getElementById('hugStage')

};


// ABRIR OS PRESENTES

giftCards.forEach(card => {

  card.addEventListener('click', () => {

    const gift = card.dataset.gift;

    const wasOpen = card.classList.contains('open');


    // FECHAR OS OUTROS PRESENTES

    giftCards.forEach(item => {

      item.classList.remove('open');

      item.setAttribute('aria-expanded', 'false');

    });


    Object.values(stages).forEach(stage => {

      stage.classList.remove('show');

      stage.setAttribute('aria-hidden', 'true');

    });


    // ABRIR O PRESENTE SELECIONADO

    if (!wasOpen) {

      card.classList.add('open');

      card.setAttribute('aria-expanded', 'true');

      stages[gift].classList.add('show');

      stages[gift].setAttribute('aria-hidden', 'false');


      // CORAÇÕES ESPECIAIS

      if (gift === 'hug' || gift === 'flowers') {

        createHearts(gift === 'hug' ? 14 : 7);

      }


      // REINICIAR CAIXA DE CHOCOLATES

      if (gift === 'chocolate') {

        document.getElementById('chocoBox')
          .classList.remove('open');

      }


      stages[gift].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });

    }

  });

});


// ABRIR CAIXA DE CHOCOLATES

document.getElementById('chocoBox')
  .addEventListener('click', event => {

    event.currentTarget.classList.toggle('open');

    if (event.currentTarget.classList.contains('open')) {

      createHearts(5);

    }

  });


// CORAÇÕES FLUTUANTES

function createHearts(amount = 6) {

  const layer = document.querySelector('.floating-hearts');

  const symbols = ['♡', '♥', '✧'];

  for (let i = 0; i < amount; i++) {

    const heart = document.createElement('span');

    heart.className = 'floating-heart';

    heart.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    heart.style.left = `${Math.random() * 100}%`;

    heart.style.fontSize =
      `${12 + Math.random() * 18}px`;

    heart.style.animationDuration =
      `${4 + Math.random() * 3}s`;

    heart.style.animationDelay =
      `${Math.random() * .8}s`;

    layer.appendChild(heart);


    heart.addEventListener('animationend', () => {

      heart.remove();

    }, { once: true });

  }

}


// ANIMAÇÃO DE APARIÇÃO DAS SEÇÕES

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add('visible');

      observer.unobserve(entry.target);

    }

  });

}, {
  threshold: 0.12
});


document.querySelectorAll('.reveal').forEach(section => {

  observer.observe(section);

});


// VOLTAR AO INÍCIO

document.getElementById('backToTop')
  .addEventListener('click', () => {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });


// PEQUENA ANIMAÇÃO INICIAL

window.setTimeout(() => {

  createHearts(5);

}, 1200);