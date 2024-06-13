import React, { useEffect, useState } from 'react'
import axios from '../api/axios';
import * as Tone from 'tone';
import { Buffer } from 'tone'
/* import axios from 'axios' */

export default function NotFoundPage() {
  const [url, setUrl] = useState(null)
  
  // funzione per chiamata GET
  async function getSample () {
    let sample = await axios.get('/api/pattern').then(res => /* 'http://localhost:8000'+ */ res.data)
    /* let url=kits[0].samples[6].url
    let sample= new Tone.Player({s: url}).toDestination() */
    
    setUrl('http://localhost:8000'+ sample)
    console.log(sample)

    
    //chiamata ok, vedere perchè non suona
  }
  //funzione per Login
  async function handleSubmit(e) {
    e.preventDefault();
  
    await axios.get("/sanctum/csrf-cookie").then(res => console.log(res));
    await axios.post("/login", {
      email: email,
      password: password,
    }).then(res => console.log(res));
    /* await axios.get("http://localhost:8000/user"); */
  }
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [sample, setSample] = useState();
  const [img, setImg] = useState('/old.jpg')

  function loadSample(s) {
    let formData = new FormData()
    formData.append('sample', s)
    console.log(formData.get('sample')) // stampo il value associato al nome del sample, usato come key
    setSample(formData)
    
  }

  function play() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://tonejs.github.io/audio/casio/A1.mp3", true);
    xhr.responseType = 'blob';
    xhr.onload = function(){
      var blob = URL.createObjectURL(this.response);
      console.log('pressed');
      var player = new Tone.Player();
      var pitchShift = new Tone.PitchShift({pitch: 2});
      
      player.load(blob);
      console.log(player)
      player.connect(pitchShift);
      player.autostart = true;
    };
    xhr.send();
    /*  let audio = axios.get('http://localhost:8000/storage/example.mp3', {
      responseType: 'arraybuffer' // Specifica il tipo di risposta come arraybuffer
  }).then(res => console.log(res)) */
  /* let audio = AudioContext.decodeAudiodata('http://localhost:8000/storage/example.mp3') */
    
  }

  function sendSample() {
    axios.post('api/sample', sample, {
        headers: {'Content-Type' : 'multipart/form-data'}
    }).then(response =>console.log(response))
  }

  useEffect(()=>{
    if(url) {
  

     
      /*let audio = axios.get(url, {mode:'no-cors'}).then(res => console.log(res))*/
    /* let player= new Tone.Player(url).toDestination() */
/*  let player2= new Tone.Player(axios.get('/api/sample/40').then(res => 'http://localhost:8000'+ res.data)).toDestination() */
let kick2 = new Tone.ToneAudioBuffer('http://127.0.0.1:8000/storage/example.mp3',  () => {
        console.log("loaded")})
      let kick = new Tone.Player('http://127.0.0.1:8000/storage/example.mp3',  () => {
        console.log("loaded")})/* .toDestination() */
     /*  player.autostart=true  */
      /* console.log(player)  */
      /* console.log(player2) */
      console.log(kick2) 
      kick.autostart=true
    }
  }, [url])
  
  

  return (
    <>
    <div className='container text-center my-5 p-3 border'>
      <h2>prova per login</h2>
    <form onSubmit={(e) => handleSubmit(e)}>
      email
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      password
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">invia</button>
    </form>
    </div>
    <div className='container text-center my-5 p-3 border'>
    <h2>prova per chiamata GET sample</h2>
    <button onClick={() => play()}>get Sample (XML)</button>
    <button onClick={() => getSample()}>get Sample</button>

    <button>PlaySample</button>
    </div>
    <div className='container text-center my-5 p-3 border'>
    <h2>prova per chiamata POST sample</h2>
    <input type="file" name='sample'onChange={(e)=>loadSample(e.target.files[0])}/>
    <button onClick={sendSample}>load Sample</button>
    <button >PlaySample</button>
    </div>
    <audio controls src={url}>Clip</audio> 
    <img src={img} alt="" />
    </>
  );
  

 
}

