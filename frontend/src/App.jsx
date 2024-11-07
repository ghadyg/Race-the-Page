import React, { useState,useEffect,useRef } from 'react';
import './App.css'
import { useNavigate } from 'react-router-dom';

function App() {
  
  const nav = useNavigate();
  const [isPrivateGame,setIsPrivateGame] = useState(false);
  const [isJoinPrivateGame,setIsJoinPrivateGame] = useState(false);
  const [error,setError] = useState(false);

  const [prvtRoomCode,setPrvtRoomCode] = useState('');
  const [joinPrvtRoomCode,setJoinPrvtRoomCode] = useState('');

  const joinPublicGame = async() => {
    const request = await fetch("http://localhost:8080/game");
    if(request.ok)
    {
      const body = await request.text();
      nav(`/game?code=${body}`);
    }
    //nav("/game"); 
  };

  const createPrivateGame = async()=>{
    const request = await fetch(`http://localhost:8080/game/${prvtRoomCode}`,{
      method: "POST"
    });
    if(request.ok)
    {
        setError(false);
        nav(`game?code=${prvtRoomCode}`);
    }
    else
      setError(true);
  }

  const joinPrivateGame = async()=>{
      const request = await fetch(`http://localhost:8080/game/${joinPrvtRoomCode}`)
      if(request.ok)
      {
        const body = await request.text()
        if(body === "true")
        {
          setError(false);
          nav(`game?code=${joinPrvtRoomCode}`);
        }
        else
          setError(true);
      }
      else
        setError(false)
  }

  const checkInputCharacters = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');
  };
  return (
    <div className='mainBody'>
        <div className='header'>
          <h1>Race The Page</h1>
        </div>
        <div className='gameBody' onClick={()=>{setIsPrivateGame(false);setIsJoinPrivateGame(false);}}>
          <button className='gameBtn' onClick={(e) => {
            e.stopPropagation(); // Prevents click event from reaching the div
            joinPublicGame();
          }}>Find a Game</button>
          
          {
            !isPrivateGame &&
          <button className='gameBtn' onClick={(e)=>{
            e.stopPropagation();
            setIsPrivateGame((prev)=>prev = !prev)
            setIsJoinPrivateGame(false)
          }}>Create a Private Game</button>}
          {
            isPrivateGame &&
            <div className='popupDiv' onClick={(e)=>e.stopPropagation()}>
              <input className='codeInput' placeholder='Create a Code' onInput={checkInputCharacters} onChange={(e)=>setPrvtRoomCode(e.target.value)}></input>
              {error && <label className='errorlbl'>Code already in use. Please choose another one.</label>}
              <button className='submitCodeBtn' onClick={createPrivateGame} >Enter the Race</button>
            </div>
          }

          {
            !isJoinPrivateGame &&
          <button className='gameBtn' onClick={(e)=>{
            e.stopPropagation();
            setIsPrivateGame(false)
            setIsJoinPrivateGame((prev)=>prev = !prev)
          }}>Join a private Game</button>}
          {
            isJoinPrivateGame &&
            <div className='popupDiv' onClick={(e)=>e.stopPropagation()}>
              <input className='codeInput' placeholder='Enter a Code' onInput={checkInputCharacters} onChange={(e)=>setJoinPrvtRoomCode(e.target.value)}></input>
              {error && <label className='errorlbl'>Game does not exist. Please enter a valied Code.</label>}
              <button className='submitCodeBtn' onClick={joinPrivateGame}>Enter the Race</button>
            </div>
          }
        </div>
    </div>
  );
}

export default App;
