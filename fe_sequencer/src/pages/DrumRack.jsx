import React, { useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import * as Tone from 'tone'
import { addPattern, deletePattern, destroyPattern, getAllPatterns, storePattern, updatePattern } from '../slice/patternSlice'

export default function DrumRack() {


    const patterns = useSelector(state => state.pattern.patternList)
    const kits = useSelector(state => state.kit.kitList)
    const error = useSelector(state => state.pattern.error)
    const dispatch = useDispatch()


    let drumrack = new Tone.Players(kits[0].sample).toDestination()
    let [currentKit, setCurrentKit] = useState(drumrack)
    let [currentSample, setCurrentSample] = useState(Array.from(currentKit._buffers._buffers))
    let [currentBPM, setCurrentBPM] = useState(120)
    let [currentVol, setCurrentVol] = useState(0)
    let [grid, setGrid] = useState([])
    let [currentPattern, setCurrentPattern] = useState({ pattern: null, index: null })
    let [play, setPlay] = useState(false)
    let [start, setStart] = useState(false)
    let [beat, setBeat] = useState(0) 
    
    const [pressedKey, setPressedKey] = useState(null);
  const handleKeyDown = (event) => {
    const key = event.key;
    setPressedKey(key);
  }
  const handleKeyUp = () => {
    setPressedKey(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Pulisce i listener quando il componente viene smontato
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [])
    
    /* let play = false;
    let start= false;
 */

    // creo il rack con i sample scelti, devo adattarlo per cambiare kit e per ricevere i dati da una chiamata GET

    /* let kit = Array.from(currentKit._buffers._buffers) */

    const makeGrid = (kit) => {
        const rows = []
        for (let s of kit) {
            const row = []
            for (let i = 0; i < 16; i++) {
                row.push({
                    sample: s[0],
                    /* isActive: false */
                    isActive: 'not-active'
                })
            }
            rows.push(row)
        }
        return rows
    }

    const savePattern = () => {
        // salvo la sequenza per ogni riga come numero binario
        let pattern = ''
        grid.forEach((row) => {
            let bin = ''
            row.forEach((step) => {
                if (step.isActive == 'active') {
                    bin += 1
                } else {
                    bin += 0
                }
            })
            // conversione da binario a decimale per ridurre i caratteri da salvare
            pattern += parseInt(bin, 2)
            pattern += '|'
        })
        console.log('pattern salvato, bin -> dec', pattern)
        dispatch(storePattern(pattern))

    }

    const modifyPattern = () => {
        // salvo la sequenza per ogni riga come numero binario
        let pattern = ''
        grid.forEach((row) => {
            let bin = ''
            row.forEach((step) => {
                if (step.isActive == 'active') {
                    bin += 1
                } else {
                    bin += 0
                }
            })
            // conversione da binario a decimale per ridurre i caratteri da salvare
            pattern += parseInt(bin, 2)
            pattern += '|'
        })
        console.log('pattern salvato, bin -> dec', pattern)
        let id = currentPattern.index

        dispatch(updatePattern({ pattern: pattern, id: id }))

    }

    const loadPattern = (n) => {

        grid.forEach((row, rowInd) => {
            row.forEach((step, stepInd) => {

                step.isActive = 'not-active'


            })
        })

        // conversione pattern da decimale a binario
        let selectedPattern = patterns.find(p => p.id == n)
        console.log(selectedPattern)
        let pattern = selectedPattern.pattern.split('|', 9);
        /* console.log(pattern); */
        pattern = pattern.map((row) => {
            row = parseInt(row).toString(2)

            while (row.length != 16) {
                row = 0 + row
            }
            return row
        })
        /* console.log(pattern); */
        grid.forEach((row, indR) => {

            let sequence = pattern[indR].split('')
            row.forEach((step, ind) => {
                if (sequence[ind] == 1) {
                    /* step.isActive = true */
                    step.isActive = 'active'
                } else {
                    /* step.isActive = false */
                    step.isActive = 'not-active'
                }
            })
        })
        setCurrentPattern({ pattern: pattern, index: selectedPattern.id })
        console.log(currentPattern)
        console.log('loaded pattern n.', n)

    };

    const configLoop = () => {
        let kit = Array.from(currentKit._buffers._buffers)
        /* const repeat = (time) => {
            grid.forEach((row, index) => {
                let sample = kit[index][0]
                let step = row[beat]

                if (step.isActive == 'active') {
                    currentKit.player(sample).start(time)
                }
            });
            beat = (beat + 1) % 16;
            console.log(beat)
            
        }
        Tone.Transport.bpm.value = currentBPM;
        
        Tone.Transport.scheduleRepeat(repeat, "16n"); */
        Tone.Transport.scheduleRepeat(time => {
            grid.forEach((row, index) => {
                let sample = kit[index][0]
                let step = row[beat]

                if (step.isActive == 'active') {
                    currentKit.player(sample).start(time)
                }
            });
            beat = (beat + 1) % 16;
            setBeat(beat)
        }, '16n')
    }

    const stepActivation = (clickedRow, clickedStep, e) => {
        console.log('steptoggle')
        /* grid.forEach((row, rowInd) => {
            row.forEach((step, stepInd) => {
                if (clickedRow === rowInd && clickedStep === stepInd) {
                    step.isActive = !step.isActive;
                    if (step.isActive) {
                        e.target.className = 'note note-is-active'
                    } else {
                        e.target.className = 'note note-not-active'
                    }
                }
            })
        }) */
        grid.forEach((row, rowInd) => {
            row.forEach((step, stepInd) => {
                if (clickedRow === rowInd && clickedStep === stepInd) {

                    if (step.isActive == 'active') {
                        step.isActive = 'not-active'
                        e.target.className = 'note not-active'
                    } else {
                        step.isActive = 'active'
                        e.target.className = 'note active'
                    }
                }
            })
        })
    }

    const togglePlay = (action) => {
        /*  Tone.Transport.stop()
         Tone.Transport.dispose() */

        if (!start) {
            Tone.start()
            Tone.getDestination().volume.rampTo(currentVol, 0.001)
            configLoop()
            setStart(true)
            /* start= true */
        }

        if (action == 'pause') {
            Tone.Transport.stop()
            setPlay(false)
            /* play=false */
        } else {
            Tone.Transport.start()
            setPlay(true)
            /* play=true */
            
        }
    }

    function playKeyBoard(e) { // funzione per suonare live con la tastiera
        let kit = Array.from(currentKit._buffers._buffers)

        switch (e.key) {
            case '1':
            case 'z': currentKit.player(kit[0][0]).start(Tone.context.currentTime)
                    setPressedKey(1) // mi serve per ridurre la latenza

                break;
            case '2':
            case 'x': currentKit.player(kit[1][0]).start(Tone.context.currentTime)

                break;
            case '3':
            case 'c': currentKit.player(kit[2][0]).start(Tone.context.currentTime)

                break;
            case '4':
            case 'a': currentKit.player(kit[3][0]).start(Tone.context.currentTime)

                break;
            case '5':
            case 's': currentKit.player(kit[4][0]).start(Tone.context.currentTime)

                break;
            case '6':
            case 'd': currentKit.player(kit[5][0]).start(Tone.context.currentTime)

                break;
            case '7':
            case 'q': currentKit.player(kit[6][0]).start(Tone.context.currentTime)

                break;
            case '8':
            case 'w': currentKit.player(kit[7][0]).start(Tone.context.currentTime)

                break;
            case '9':
            case 'e': currentKit.player(kit[8][0]).start(Tone.context.currentTime)

                break;

            default:
                console.log('è stato premuto un altro tasto')
                break;
        }
    }

    function loadKit(n) {


        drumrack.dispose()
        /* let newDrumrack = new Tone.Players(kits[n].sample).toDestination() 
        setCurrentKit(newDrumrack)
        setCurrentSample(Array.from(newDrumrack._buffers._buffers)) */
        for (const [nomeCampione, urlCampione] of Object.entries(kits[n].sample)) {
            drumrack.add(nomeCampione, urlCampione);
        }
        drumrack.toDestination()
        console.log(drumrack)
        setCurrentKit(drumrack)
        setCurrentSample(Array.from(drumrack._buffers._buffers))
        console.log(currentSample)
        let patternN = currentPattern.index
        console.log(patternN)
        if (patternN != null) {
            loadPattern(patternN)
        }
        
        setStart(false)



        /* 
                if (play) {
                    
                    setPlay(false)
                    
                    drumrack.dispose() 
        
                let newDrumrack = new Tone.Players(kits[n].sample).toDestination()
        
                setCurrentKit(newDrumrack)
                setCurrentSample(Array.from(newDrumrack._buffers._buffers))
                 } else {
                    Tone.Transport.start()
                    setPlay(true)
                    
                    drumrack.dispose()
        
                let newDrumrack = new Tone.Players(kits[n].sample).toDestination()
        
                setCurrentKit(newDrumrack)
                setCurrentSample(Array.from(newDrumrack._buffers._buffers))
                }  */


    }

    // component did mount
    useEffect(() => {
        dispatch(getAllPatterns())
        console.log(error)
        console.log(patterns)
        setGrid(makeGrid(Array.from(currentKit._buffers._buffers)))
        console.log(currentSample)
        console.log('did mount')

    }, [])

    useEffect(() => {

        console.log('cambio pattern')
    }, [patterns, currentPattern])

    useEffect(() => {
        console.log('cambio kit')
        setGrid(makeGrid(Array.from(currentKit._buffers._buffers)))
    }, [currentKit])

    useEffect(() => {},[beat, grid])


    return (
        <Container className='text-center d-flex  justify-content-center my-5' onKeyDown={e => playKeyBoard(e)} >


            <div className='col'>
                <div className="row  justify-content-center">
                    {/* converto la mappa che contiene i vari sample in un array e lo mappo */}
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'q' || pressedKey === '7') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[6][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>Q</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>7</span>
                        {currentSample[6][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'w' || pressedKey === '8') ? 'active-rack-note ' : ''}`}  onClick={() => currentKit.player(currentSample[7][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>W</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>8</span>
                        {currentSample[7][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'e' || pressedKey === '9') ? 'active-rack-note ' : ''}`}  onClick={() => currentKit.player(currentSample[8][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>E</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>9</span>
                        {currentSample[8][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'a' || pressedKey === '4') ? 'active-rack-note ' : ''}`}  onClick={() => currentKit.player(currentSample[3][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>A</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>4</span>
                        {currentSample[3][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 's' || pressedKey === '5') ? 'active-rack-note ' : ''}`}  onClick={() => currentKit.player(currentSample[4][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>S</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>5</span>
                        {currentSample[4][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'd' || pressedKey === '6') ? 'active-rack-note ' : ''}`}  onClick={() => currentKit.player(currentSample[5][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>D</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>6</span>
                        {currentSample[5][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'z' || pressedKey === '1') ? 'active-rack-note ' : ''}`}  onClick={() => currentKit.player(currentSample[0][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>Z</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>1</span>
                        {currentSample[0][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'x' || pressedKey === '2') ? 'active-rack-note ' : ''}`}  onClick={() => currentKit.player(currentSample[1][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>X</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>2</span>
                        {currentSample[1][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'c' || pressedKey === '3') ? 'active-rack-note ' : ''}`}  onClick={() => currentKit.player(currentSample[2][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>C</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>3</span>
                        {currentSample[2][0]}
                    </button>
                </div>
                <div className='settings d-flex my-4'>
                    <div className='d-flex flex-column justify-content-center'>
                        <div className='d-flex'>
                        <button className='play-button btn btn-dark mx-2' onClick={() => togglePlay('play')} disabled={play ? true : false}>
                            Play
                        </button>
                        <button className='play-button btn btn-dark mx-2' onClick={() => togglePlay('pause')} disabled={!play ? true : false}>
                            Pause
                        </button>
                        </div>
                    
                        <div className='BpmSetting'>

                            <input className='range' type="range" id="bpmRange" name="bpm" min="60" max="240" value={currentBPM} step="1"
                                onChange={(e) => {
                                    setCurrentBPM(e.target.value)
                                    Tone.Transport.bpm.value = currentBPM;
                                }}
                                onClick={(e) => {
                                    setCurrentBPM(e.target.value)
                                    Tone.Transport.bpm.value = currentBPM;
                                }} />
                            <p className='text-white' >BPM: {currentBPM}</p>
                        </div>
                        <div className='VolSetting'>

                            <input className='range' type="range" id="VolRange" name="vol" min="-20" max="10" value={currentVol} step="1"
                                onChange={(e) => {
                                    setCurrentVol(e.target.value)
                                    Tone.getDestination().volume.rampTo(currentVol, 0.001)
                                    /* Tone.volume.rampTo(currentVol, 0.001) */
                                }}
                                onClick={(e) => {
                                    setCurrentVol(e.target.value)
                                    Tone.getDestination().volume.rampTo(currentVol, 0.001)
                                    /* Tone.volume.rampTo(currentVol, 0.001) */
                                }} />

                            <p className='text-white'>Volume: {currentVol}</p>
                        </div>
                    </div>
                    <div className='align-content-between d-flex'>
                        
                        
                        
                        
                        <div className='align-content-between d-flex flex-column '>
                        <Form.Select className='m-2' aria-label="Default select example" onChange={(e) => loadKit(e.target.value)}>
                            <option disabled selected>Load a kit</option>
                            {kits.length > 0 && kits.map((k, i) =>
                                <option key={i} value={i}>{k.kit}</option>)}
                        </Form.Select>
                        
                            <Form.Select  className='m-2' aria-label="Default select example" onChange={(e) => loadPattern(e.target.value)}>
                                <option disabled selected >Load a pattern</option>
                                {patterns.length > 0 && patterns.map((p, i) =>
                                    <option key={i} value={p.id}>{i + 1}</option>)}
                            </Form.Select>
                            <div className="d-flex">
                                <button className='btn btn-dark mx-2' onClick={() => savePattern()}>Save</button>
                                <button className='btn btn-dark mx-2' onClick={() => modifyPattern()}>Update</button>
                                <button className='btn btn-dark mx-2' onClick={() => dispatch(destroyPattern(currentPattern.index))}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            <div className='d-lg-flex flex-column  align-items-center col-10'>

                
                {/* griglia sequencer */}
                
                <div id='sequencer col-3'>
                    
                    {grid && grid.map((row, rowIndex) =>
                    <>
                        
                        <div key={rowIndex} id={rowIndex} className='sequencer-row d-flex justify-content-start align-items-center'>

                            {row.map((note, noteIndex) =>
                                <button  key={noteIndex} id={noteIndex}/* className={note.isActive ? 'note note-is-active' : 'note note-not-active'} */ className={`note ${note.isActive} ${noteIndex == beat ? 'actualStep' : ''}`} onClick={(e) => stepActivation(rowIndex, noteIndex, e)} ></button>

                            )}
                            <span className='ms-3 text-white'>{currentSample[rowIndex][0]}</span>
                        </div>
                    </>

                    )}
                </div>

            </div>


        </Container>
    )
}
