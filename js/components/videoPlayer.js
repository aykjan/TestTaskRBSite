// components/videoPlayer.js

const initVideoPlayer = (videoURL) => {
  const playButton = document.querySelector('.video__button');
  const videoPlayer = document.querySelector('.video__player'); // Изменил на querySelector

  if (playButton && videoPlayer) {
    playButton.addEventListener('click', function() {
      // Вставляем iframe с видео в контейнер
      videoPlayer.innerHTML = `<iframe src="${videoURL}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen></iframe>`;
      
      videoPlayer.style.display = 'block'; // Показываем видео-плеер
      this.style.display = 'none'; // Скрываем кнопку после нажатия
    });
  } else {
    console.error('playButton or videoPlayer not found');
  }
};

export default initVideoPlayer;
