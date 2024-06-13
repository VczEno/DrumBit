import React, { useEffect } from 'react'
import * as Tone from 'tone'
import {Container} from 'react-bootstrap'

/* componente da modificare per realizzare linea di basso
 */

export default function TutorialDrumMachine() {
 const samples=[{url:'/kick.wav', name:'A4'},
                {url:'/snare.wav', name:'A4'},
                {url:'/clap.wav', name: 'A4'},
                {url: '/hihat.wav', name:'A4'}
              ]
    const makeSampler = (samples) => {

        // each synth can only play one note at a time.
        // for simplicity, we'll create one synth for each note available
        // this allows for easy polyphony (multiple notes playing at the same time)
        
        // Documentation for Tone.Synth can be found here:
        // https://tonejs.github.io/docs/r13/Synth
        //
        // Demo different oscillator settings here:
        // https://tonejs.github.io/examples/oscillator
        
        const kit = [];
        
        for (let i = 0; i < samples.length; i++) {  
          // I'm using an oscillator with a square wave and 8 partials
          // because I like how it sounds.
          //
          // You could simply write new Tone.Synth().toDestination() instead.
          // This would work just as well, but sound slightly different.
          //
          // Demo different oscillator settings here:
          // https://tonejs.github.io/examples/oscillator
          
          let sample = new Tone.Sampler({urls: { A4: samples[i].url}  }).toDestination();
          kit.push(sample);
        }
      
        return kit;
      };


      
    // an array of notes is passed in as the argument to allow for flexbility.
    // const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];

    const makeGrid = (samples) => {
        // our "notation" will consist of an array with 6 sub arrays
        // each sub array corresponds to one row of our sequencer
    
        // declare the parent array to hold each row subarray
        const rows = [];
    
        for (const s of samples) {
        // declare the subarray
        const row = [];
        // each subarray contains multiple objects that have an assigned note
        // and a boolean to flag whether they are active.
        // each element in the subarray corresponds to one eighth note.
        for (let i = 0; i < 16; i++) {
            row.push({
            note: s.name,
            isActive: false
            });
        }
        rows.push(row);
        }
    
        // we now have 6 rows each containing 8 eighth notes
        return rows;
    };
    
const kit = makeSampler(samples);

    // In React, I stored beat in the component's state. 
// For the purpose of this demo it exists as a global variable.

// declaring the notes for each row
const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];
let grid = makeGrid(samples);
let beat = 0;
// Similarly, the grid would be stored in the component's state
// Here I am leaving it as a global variable for demonstration purposes.
let playing = false;
let started = false;



const configLoop = () => {

  // This is our callback function. It will execute repeatedly 
  const repeat = (time) => {
    
    grid.forEach((row, index) => {
      // as the index increments we are moving *down* the rows
      // One note per row and one synth per note means that each row corresponds to a synth
      let sample = kit[index];
      // beat is used to keep track of what subdivision we are on
      // there are eight *beats* or subdivisions for this sequencer
      let note = row[beat];
      
      if (note.isActive) {
        // triggerAttackRelease() plays a specific pitch for a specific duration
        // documentation can be found here:
        // https://tonejs.github.io/docs/14.7.77/Synth#triggerAttackRelease
        
        sample.triggerAttackRelease(note.note, "16n", time);
      }
    });
    // increment the counter
    beat = (beat + 1) % 16;
  };
  
  // set the tempo in beats per minute.
  Tone.Transport.bpm.value = 120;
  // telling the transport to execute our callback function every eight note.
  Tone.Transport.scheduleRepeat(repeat, "8n");
};

const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
    // iterating through the grid
    grid.forEach((row, rowIndex) => {
      // iterate through each note in current row
      row.forEach((note, noteIndex) => {
        // toggle the note in the grid that corresponds to the clicked button.
        if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
          note.isActive = !note.isActive;
          if(note.isActive) {
            e.target.className = 'note note-is-active'
          } else {
            e.target.className = 'note note-not-active'
          }
          // I'm using the classNames utility to make changing the button styling easier.
          // https://www.npmjs.com/package/classnames
          /* e.target.className = ' note note-is-active'; */
        }
      });
    });
  };

  const togglePlay = () => {
    if (!started) {
        // Only exectued the first time the button is clicked
        // initializing Tone, setting the volume, and setting up the loop
        
        Tone.start();
        Tone.getDestination().volume.rampTo(-10, 0.001)
        configLoop();
        started = true;
      }
  
      // toggle Tone.Trasport and the flag variable.
      if (playing) {
        
        Tone.Transport.stop();
        playing = false;
      } else {
        
        Tone.Transport.start();
        playing = true;
      }
  }

  useEffect(() => {
    console.log('useeffect')
    const kit = makeSampler(samples);
    let grid = makeGrid(samples);
    console.log(grid)
  },)
  


  return (
    <Container className='text-center'>
      <h1>Drum Machine</h1>
        <div id='sequencer'>
            {grid.map((row, rowIndex) => 
                <div id={rowIndex} className='sequencer-row'>
                    {row.map((note, noteIndex) => 
                        <button className={note.isActive ? 'note note-is-active' : 'note note-not-active' } onClick={(e) => handleNoteClick(rowIndex, noteIndex, e)} ></button>
                        
                    )}
                </div>
            
            )}
        </div>
        <div>
            <button className='play-button' onClick={() => togglePlay()}>
              Play/Pause
            </button>
        </div>
    </Container>
  )
}
