  import React, { useState,useEffect,useRef } from 'react';
  import { useLocation, useNavigate } from 'react-router-dom';
  import './GamePage.css';
  import { v4 as uuidv4 } from 'uuid';




  let newSocket = null;
  export default function GamePage() {
    
    const [message, setMessage] = useState(''); // State to store the input message
    const [end,setEnd] = useState('');
    const [gameStarted,setGameStarted] = useState(false);
    const gameStartedRef = useRef(gameStarted);
    const [messageToType,setMessageToType] = useState(``)
    const [highlightedMessage, setHighlightedMessage] = useState("");
    const [notHighlightedMessage, setNotHighlightedMessage] = useState(messageToType);
    const [receivedMesg, setReceivedMesg] = useState("");
    const nav = useNavigate();


    const initializeSocket = (code) =>{
      if(newSocket?.readyState ===0)
        return;
      newSocket = new WebSocket(`ws://localhost:8080/websocket?code=${code}`);
      newSocket.onopen = () => {
          console.log("connected!");
      };
    
      newSocket.onmessage = (event) => {
        console.log(event.data);
          if(event.data.startsWith("Game starting with phrase: "))
          {  
            setGameStarted(true);
            const startPhraseLength = "Game starting with phrase: ".length;
            const paragraph = event.data.slice(startPhraseLength);
            setMessageToType(paragraph);
            setNotHighlightedMessage(paragraph);
            return;
          }
          else if(event.data === "Game Won with code "+code)
          {
            setMessage('');
            setReceivedMesg('');
            setEnd("You WON");
            return;
          }
          else if(event.data ==="Game Lost with code "+code)
          {
            setMessage('');
            setReceivedMesg('');
            setEnd("You LOST");
            return;
          }
          if(gameStartedRef.current)
          {
            const typedText = event.data;
            setReceivedMesg(event.data);
            if (messageToType.startsWith(typedText)) {
              const myCarDistance = (typedText.length/messageToType.length) * 42;
              document.getElementById('opponentCar').style.left = myCarDistance+"vw";
            }
          }
      };
    
      newSocket.onerror = (error) => {

        setMessage('');
        setReceivedMesg('');
        console.log('WebSocket error:', error);
      };
    
      newSocket.onclose = () => {
        setMessage('');
        setReceivedMesg('');
        console.log('WebSocket connection closed');
      
      };
    }

    useEffect(()=>{
      gameStartedRef.current = gameStarted;
    },[gameStarted])

    useEffect(()=>{
      const params = new URLSearchParams(window.location.search);
      let code = params.get('code');
      if(code)
        initializeSocket(code);
    },[])


    const handleInputChange = (e) => {
      const typedText = e.target.value;
      setMessage(typedText);
      newSocket.send(typedText);

      if (messageToType.startsWith(typedText)) {
         
          const myCarDistance = (typedText.length/messageToType.length) * 42;
          document.getElementById('myCar').style.left = myCarDistance+"vw";
          setHighlightedMessage(typedText);
          setNotHighlightedMessage(messageToType.slice(typedText.length));
      }
    };

    if(!gameStarted)
    {
      return (
        <div>
          <div className='loadingHeader'><h1>Waiting for a game...</h1></div>
          <div className='loadingbox'>
            <div className='loadingIcon'>
              <img src='loope-removebg.png' className='loopeImage'/>
            </div>
          </div>
        </div>
      )
    }
    else
    {
      return(
      <>
        <div className='body'>
          <div className='carRacingDiv'>
            <div className='carDiv'>
              <div className='carWrapperDiv' id='myCar'>
                <label>you</label>
                <img src='car1.png' className='carImg'></img>
              </div>
            </div>
            <div className='carDiv'>
              <div className='carWrapperDiv' id='opponentCar'>
                <label>opponent</label>
                <img src='car2.png' className='carImg'></img>
              </div>
            </div>
          </div>
          <label className='labelHolder'>
              <span className="highlight">{highlightedMessage}</span>{notHighlightedMessage}
          </label>
          <input
              className='inputHolder'
              value={message}
              onChange={handleInputChange}
          />
          <div className='opponenetDiv'>
            <h1 className='opponentHeader'>The Opponent:</h1>
            <label className='labelHolder'>{receivedMesg}</label>
          </div>
        </div>
        {end === "You WON" && (
          <div className='winDiv'>
            <h1>Congratulations!</h1>
            <p>You have won the race!</p>
            <img src='trophy.png' alt='Trophy' className='trophyImage' />
            <button onClick={() => nav('/')}>Play Again</button>
          </div>
        )}
        {end === "You LOST" && (
          <div className='lostDiv'>
            <h1>Game Over</h1>
            <p>You have lost the race.</p>
            <img src='lost.png' alt='Sad Face' className='danceImage' />
            <button onClick={() => nav('/')}>Try Again</button>
          </div>
        )}
      </>
      )
    }
  }
