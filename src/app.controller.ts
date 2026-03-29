import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from './auth/decorators/public.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('')
export class AppController {
  @Get()
  @Public()
  @ApiExcludeEndpoint()

  //

  //
  public async hello(@Res() res: Response) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to My API</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Orbitron', sans-serif;
    background: radial-gradient(circle at center, #0a0a0a, #1a1a1a);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    color: #FFD700;
    animation: bgPulse 10s linear infinite;
  }

  @keyframes bgPulse {
    0% { background-position:0% 50%; }
    50% { background-position:100% 50%; }
    100% { background-position:0% 50%; }
  }

  .card {
    position: relative;
    background: rgba(20,20,20,0.9);
    padding: 60px 50px;
    border-radius: 30px;
    text-align: center;
    max-width: 500px;
    width: 100%;
    border: 3px solid transparent;
    background-clip: padding-box;
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), inset 0 0 30px #FFD700;
    animation: borderGlow 3s ease-in-out infinite alternate;
  }

  @keyframes borderGlow {
    0% { box-shadow: 0 0 20px #FFD700, inset 0 0 10px #FFD700; }
    50% { box-shadow: 0 0 40px #FFD700, inset 0 0 20px #FFA500; }
    100% { box-shadow: 0 0 60px #FFD700, inset 0 0 30px #FFD700; }
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    color: #FFD700;
    text-shadow: 0 0 10px #FFD700, 0 0 20px #FFA500;
    transition: text-shadow 0.3s ease;
  }

  h1:hover {
    text-shadow: 0 0 25px #FFD700, 0 0 50px #FFA500, 0 0 75px #FFD700;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 35px;
    color: #f0e68c;
    text-shadow: 0 0 5px #FFD700;
  }

  .button {
    display: inline-block;
    padding: 18px 45px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 60px;
    color: #121212;
    text-decoration: none;
    background: linear-gradient(145deg, #FFD700, #FFA500);
    box-shadow: 0 0 20px #FFD700, 0 5px 20px rgba(255,215,0,0.4);
    animation: buttonPulse 2s infinite alternate;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .button:hover {
    transform: scale(1.15) rotate(-3deg);
    box-shadow: 0 0 40px #FFD700, 0 10px 40px #FFA500;
  }

  @keyframes buttonPulse {
    0% { box-shadow: 0 0 20px #FFD700, 0 5px 20px rgba(255,215,0,0.4); }
    50% { box-shadow: 0 0 35px #FFD700, 0 10px 35px #FFA500; }
    100% { box-shadow: 0 0 50px #FFD700, 0 15px 50px #FFA500; }
  }

  .robot {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, #FFD700 0%, #FFA500 80%);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: #121212;
    box-shadow: 0 0 30px #FFD700, 0 0 60px #FFA500 inset;
    animation: floatRotate 4s ease-in-out infinite alternate;
  }

  @keyframes floatRotate {
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-25px) rotate(15deg); }
    100% { transform: translateY(0) rotate(0deg); }
  }

  /* particles */
  .particle {
    position: absolute;
    background: gold;
    border-radius: 50%;
    opacity: 0.8;
    animation: floatParticle linear infinite;
  }

  @keyframes floatParticle {
    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
    50% { transform: translateY(-200px) translateX(50px) scale(1.5); opacity: 0.4; }
    100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
  }

</style>
</head>
<body>
  <div class="card">
    <div class="robot">🤖</div>
    <h1>Welcome to My API!</h1>
    <p>Explore all endpoints and unleash the full power of your API in style.</p>
    <a class="button" href="/api-docs#/">
      🚀 Go to API Docs
    </a>
  </div>

  <script>
    // create 70 random particles
    for(let i=0;i<70;i++){
      const p=document.createElement('div');
      p.className='particle';
      p.style.left=Math.random()*100+'vw';
      p.style.top=Math.random()*100+'vh';
      p.style.width=p.style.height=(Math.random()*5+2)+'px';
      p.style.animationDuration=(2+Math.random()*3)+'s';
      document.body.appendChild(p);
    }
  </script>
</body>
</html>
`;
    res.send(html);
  }
}
