<template>
  <div id="app">
    <div class="container">
      <div class="main">
        <div class="header">
          <h2>ARTHUR MUSIC</h2>
        </div>

        <div class="song-img"></div>
        
        <div class="song-detail">
          <h2>Mugiwara Crew One Piece</h2>
          <h3>We are !</h3>
        </div>

        <div class="song-control">
          <button class="prev">
            <span>
              <i class="fa fa-backward"></i>
            </span>
          </button>

          <button class="play">
            <span>
              <i class="fa fa-play"></i>
            </span>
          </button>

          <button class="next">
            <span>
              <i class="fa fa-forward"></i>
            </span>
          </button>
        </div>

        <div class="next-up">
          <p>Next up:
            <span>Bring to no sake</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Courier New', Courier, monospace;
    background: #313131;
  }

  .main {
    width: 450px;
    max-width: 100%;
    margin: 30px auto;
    padding: 30px;
    border: 1px solid transparent;
    border-radius: 20px;
    background: linear-gradient(to left bottom, rgba(75, 159, 233, .8), rgba(244, 91, 137, .8));
    box-shadow: 0px 3px 12px rgba(0, 0 ,0 , .7);
  }

  .header {
    text-align: center;
    font-size: 2rem;
    font-family: 'Courier New', Courier, monospace;
    margin-bottom: 30px;
  }

  .header h2 {
    font-size: 40px;
    color: #eee;
  }

  .song-img {
    display: block;
    width: 200px;
    max-width: 100%;
    background: salmon;
    position: relative;
    margin: auto;
    margin-bottom: 30px;
    border-radius: 50%;
    box-shadow: 0px 3px 12px rgba(0, 0 ,0 , .5);
    background-image: url('./assets/one-piece.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    animation: rotation 10s linear infinite;
    cursor: pointer;
  }

  .song-img:hover {
    animation-play-state: paused;
  }

  .song-img::before {
    content: '';
    display: block;
    position: absolute;
    inset: -5px -5px -5px -5px;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0px 3px 15px rgba(255, 255, 255, .8);
  }

  .song-img::after {
    content: '';
    display: block;
    padding-top: 100%;
  }

  .song-detail {
    text-align: center;
    margin-bottom: 30px;
  }

  .song-detail h2 {
    font-weight: 800;
  }

  .song-detail h3 {
    font-style: italic;
    font-weight: 500;
  }

  button {
    appearance: none;
    border: none;
    outline: none;
    background: none;
    color: #fff;
    margin: 0 10px;
    cursor: pointer;
  }

  .song-control {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }

  .play {
    font-size: 50px;
  }

  .prev, .next {
    font-size: 30px;
  }

  .next-up {
    text-align: center;
  }

  .next-up p {
    color: #313131;
  }

  .next-up span {
    font-style: italic;
  }

  @keyframes rotation {
    from {
      transform: rotate(1deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

</style>
