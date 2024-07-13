import React, { useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import * as Tone from 'tone'
import { addPattern, deletePattern, destroyPattern, getAllPatterns, storePattern, updatePattern } from '../slice/patternSlice'

export default function DrumRack() {

    // dallo store recupero la lista di patterne e kit
    const patterns = useSelector(state => state.pattern.patternList)
    const kits = useSelector(state => state.kit.kitList)
    const error = useSelector(state => state.pattern.error)
    const dispatch = useDispatch()

    // creo il drumrack e lo collego all'output
    let drumrack = new Tone.Players(kits[0].sample).toDestination()

    // setto una variabile di stato per il kit corrente e la inizializzo con il drumrack appena dichiarato
    let [currentKit, setCurrentKit] = useState(drumrack)
    // variabile di stato che contiene i sample
    let [currentSample, setCurrentSample] = useState(Array.from(currentKit._buffers._buffers))
    // variabile di stato per i BPM e per il Volume
    let [currentBPM, setCurrentBPM] = useState(120)
    let [currentVol, setCurrentVol] = useState(0)
    //variabile di stato per la griglia, inizializzata ad array vuoto, verrà generata dalla funzione makeGrid
    let [grid, setGrid] = useState([])
    // variabile di stato che conterrà il pattern e l'indice attuale, inizializzato a null
    let [currentPattern, setCurrentPattern] = useState({ pattern: null, index: null })
    // variabili di stato per lo stato di play, start (primo avvio), e della beat corrente
    let [play, setPlay] = useState(false)
    let [start, setStart] = useState(false)
    let [beat, setBeat] = useState(0)

    // costante di stato per salvare il tasto che viene premuto
    const [pressedKey, setPressedKey] = useState(null);
    // quando premo un tasto viene salvato in pressedKey
    const handleKeyDown = (event) => {
        const key = event.key;
        setPressedKey(key);
    }
    // quando il tasto non è più premuto pressedKey torna null
    const handleKeyUp = () => {
        setPressedKey(null);
    };

    // useEffect lanciato all'avvio, si mette in ascolto degli eventi da tastiera  
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

    const  makeGrid = (kit) => {
        const rows = []
        for (let s of kit) {
            const row = []
            for (let i = 0; i < 16; i++) {
                row.push({
                    sample: s[0], // perchè sample[0] ??
                    /* isActive: false */
                    isActive: 'not-active'
                })
            }
            rows.push(row)
        }

        return rows
    }

    //funzione che salva il pattern in un nuovo slot, legge ogni riga come una sequenza di 1 (stato attivo) e (stato non attivo) in modo da ottenere una serie di numeri
    // binari, che vengono convertiti in decimali per essere salvati nello store e nel DB
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

    // come per savePattern converte prima in binario e poi in decimale il pattern, ma lo sovrascrive al pattern corrente
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
        /* console.log('pattern salvato, bin -> dec', pattern) */
        let id = currentPattern.index

        dispatch(updatePattern({ pattern: pattern, id: id }))

    }

    // funzione che carica il pattern dallo store o dal DB, da decimale lo converte a binario e leggendo il binario verranno attivati gli step giusti
    const loadPattern = (n) => {
        // inizialmente disattiva ogni step sulla griglia
        grid.forEach((row, rowInd) => {
            row.forEach((step, stepInd) => {
                step.isActive = 'not-active'
            })
        })
        // cerco il pattern (formato stringa) tramite il parametro n passato alla funzione
        let selectedPattern = patterns.find(p => p.id == n)
        console.log("RIGA 146 " + selectedPattern)
        //splitto il pattern per ottenere un array dove ogni elemento corrisponde al pattern (in formato decimale) della singola riga della grid
        let pattern = selectedPattern.pattern.split('|', 9);
        // modico l'array pattern per trasformare i numeri da decimali a binari
        pattern = pattern.map((row) => {
            row = parseInt(row).toString(2)
            // se il decimale trasformato in binario ha meno di 16 caratteri, aggiungo degli 0 all'inizio
            while (row.length != 16) {
                row = 0 + row
            }
            return row
        })
        // nella griglia per ogni riga uso la sequenza binaria per attivare gli step nella giusta posizione
        // ciclo la griglia per ogni riga
        grid.forEach((row, indR) => {
            // creo un array sequence dove splitto di volta in volta il numero binario presente all'indice indR (lo stesso della riga della griglia) nell'array pattern
            let sequence = pattern[indR].split('')
            // ciclo per ogni step nella riga
            row.forEach((step, ind) => {
                // attivo il singolo step se trovo un valore 1 nel numero binario a quell'indice
                if (sequence[ind] == 1) {
                    /* step.isActive = true */
                    step.isActive = 'active'
                } else {
                    /* step.isActive = false */
                    step.isActive = 'not-active'
                }
            })
        })
        // aggiorno la variabile di stato con il pattern appena caricato
        setCurrentPattern({ pattern: pattern, index: selectedPattern.id })
        console.log(currentPattern)
        console.log('loaded pattern n.', n)

    };

    // funzione che crea il loop di 4 battute (16 steps)
    const configLoop = () => {
        // creo una array kit che conterrà i sample del kit presente nella variabile di stato
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

        // imposto il loop
        Tone.Transport.scheduleRepeat(time => {
            //per ogni riga presente nella griglia
            grid.forEach((row, index) => {
                // dichiamo sample come il sample presente nel kit all'indice index
                let sample = kit[index][0]
                // dichiaro step la posizione della riga all'indice pari alla variable di stato beat (quarto che sta suonando in quel momento)
                let step = row[beat]
                // se lo stato dello step è attivo, viene emesso il suono 
                if (step.isActive == 'active') {
                    currentKit.player(sample).start(time)
                }
            });
            // incremento il beat di uno e faccio il modulo di 16 così da avere sempre un valore compreso tra 0 e 15
            beat = (beat + 1) % 16;
            setBeat(beat)
        }, '16n') // RIVEDERE QUESTO PARAMETRO DI SCHEDULE REPEAT
    }

    // funzione che cambia lo stato di uno step al click
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

        // scorre ogni riga della griglia e ogni step della riga
        grid.forEach((row, rowInd) => {
            row.forEach((step, stepInd) => {
                //quando trova il tasto che è stao premuto (sulla base dell'indice della riga e dello step), ne cambia la proprietà isActive e modifica la classe del target
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

    // funzione per il funzionamento del tasto play/pause
    const togglePlay = (action) => {
        /*  Tone.Transport.stop()
         Tone.Transport.dispose() */

        // entra nell'if se viene avviato per la prima volta
        if (!start) {
            //avvia e collega lo strumento all'output
            Tone.start()
            Tone.getDestination().volume.rampTo(currentVol, 0.001)
            // richiama la funzione che configura il loop
            configLoop()
            // cambia la variabile di stato start
            setStart(true)
            /* start= true */
        }
        // se viene premuto il tasto pause viene stoppato lo strumento e cambiata la variabile di stato play
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
    // funzione per suonare live con la tastiera
    function playKeyBoard(e) {
        // creo l'array kit a partire dal currentKit salvato nella variabile di stato 
        let kit = Array.from(currentKit._buffers._buffers)
        // switch case che suona il sample giusto in base al tasto premuto
        switch (e.key) {
            case '1':
            case 'z': currentKit.player(kit[0][0]).start(Tone.context.currentTime)
                setPressedKey(1) // mi serve per ridurre la latenza 
                //                                                  ???? IN CHE SENSO ???

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

    // funzione per caricare un nuovo kit in base all'indice n
    function loadKit(n) {

        //smantello il drumrack
        drumrack.dispose()
        /* let newDrumrack = new Tone.Players(kits[n].sample).toDestination() 
        setCurrentKit(newDrumrack)
        setCurrentSample(Array.from(newDrumrack._buffers._buffers)) */

        // carico nel drumrack i nuovi sample
        for (const [nomeCampione, urlCampione] of Object.entries(kits[n].sample)) { // COSA CAZZO E'?
            console.log(nomeCampione + " - " + urlCampione)
            drumrack.add(nomeCampione, urlCampione);
        }
        // lo collego all'output
        drumrack.toDestination()
        console.log(drumrack)
        // lo setto come kit corrente
        setCurrentKit(drumrack)
        //setto i sample correnti nell'array variabile di stato
        setCurrentSample(Array.from(drumrack._buffers._buffers))
        console.log(currentSample)
        //ricarico il pattern corrente con il nuovo kit
        let patternN = currentPattern.index
        console.log(patternN)
        if (patternN != null) {
            loadPattern(patternN)
        }

        // stoppo il player
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

    // component did mount, eseguito all'avvio
    useEffect(() => {
        dispatch(getAllPatterns()) // prendo tutti i pattern
        console.log(error)
        console.log(patterns)
        setGrid(makeGrid(Array.from(currentKit._buffers._buffers))) // creo la griglia con il kit di default inizializzato nella variabile di stato
        console.log(currentSample)
        console.log('did mount')

    }, [])

    // component did update, quando cambio pattern mi stampa un messaggio
    useEffect(() => {

        console.log('cambio pattern')
    }, [patterns, currentPattern])

    // component did update, quando cambio kit mi rigenera la griglia

    useEffect(() => {
        console.log('cambio kit')
        setGrid(makeGrid(Array.from(currentKit._buffers._buffers)))
    }, [currentKit])


    useEffect(() => { }, [beat, grid])


    return (
        <Container className='text-center d-flex  justify-content-center my-5' onKeyDown={e => playKeyBoard(e)} >

            {/* colonna sinistra con rack e settings */}
            <div className='col'>
                {/* Rack dei sample 3x3 */}
                <div className="row  justify-content-center">
                    {/* converto la mappa che contiene i vari sample in un array e lo mappo */}
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'q' || pressedKey === '7') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[6][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>Q</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>7</span>
                        {currentSample[6][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'w' || pressedKey === '8') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[7][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>W</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>8</span>
                        {currentSample[7][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'e' || pressedKey === '9') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[8][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>E</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>9</span>
                        {currentSample[8][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'a' || pressedKey === '4') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[3][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>A</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>4</span>
                        {currentSample[3][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 's' || pressedKey === '5') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[4][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>S</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>5</span>
                        {currentSample[4][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'd' || pressedKey === '6') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[5][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>D</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>6</span>
                        {currentSample[5][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'z' || pressedKey === '1') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[0][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>Z</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>1</span>
                        {currentSample[0][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'x' || pressedKey === '2') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[1][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>X</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>2</span>
                        {currentSample[1][0]}
                    </button>
                    <button className={` note-rack col-3 position-relative ${(pressedKey === 'c' || pressedKey === '3') ? 'active-rack-note ' : ''}`} onClick={() => currentKit.player(currentSample[2][0]).start()}>
                        <span className='position-absolute top-0 start-0 mx-1'>C</span>
                        <span className='position-absolute top-0 end-0 mx-1 '>3</span>
                        {currentSample[2][0]}
                    </button>
                </div>
                {/* Settings */}
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

                            <Form.Select className='m-2' aria-label="Default select example" onChange={(e) => loadPattern(e.target.value)}>
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
                                    <button key={noteIndex} id={noteIndex}/* className={note.isActive ? 'note note-is-active' : 'note note-not-active'} */ className={`note ${note.isActive} ${noteIndex == beat ? 'actualStep' : ''}`} onClick={(e) => stepActivation(rowIndex, noteIndex, e)} ></button>

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
