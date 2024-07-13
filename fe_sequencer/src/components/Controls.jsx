import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import * as Tone from 'tone'
import { addPattern, deletePattern, destroyPattern, getAllPatterns, storePattern, updatePattern } from '../slice/patternSlice'

export default function Controls({ drumrack, kits, grid, beat, setBeat, currentPattern, setCurrentPattern, patterns, currentKit, setCurrentKit }) {
    // se servono nel sequencer li sposto nella pagina

    const error = useSelector(state => state.pattern.error)


    // variabile di stato che contiene i sample
    let [currentSample, setCurrentSample] = useState(Array.from(currentKit._buffers._buffers))

    let [play, setPlay] = useState(false)
    let [start, setStart] = useState(false)
    // variabile di stato per i BPM e per il Volume
    let [currentBPM, setCurrentBPM] = useState(120)
    let [currentVol, setCurrentVol] = useState(0)
    const dispatch = useDispatch()

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
        if (action === 'pause') {
            Tone.Transport.stop()
            setPlay(false)
            /* play=false */
        } else {
            Tone.Transport.start()
            setPlay(true)
            /* play=true */

        }
    }
    //funzione che salva il pattern in un nuovo slot, legge ogni riga come una sequenza di 1 (stato attivo) e (stato non attivo) in modo da ottenere una serie di numeri
    // binari, che vengono convertiti in decimali per essere salvati nello store e nel DB
    const savePattern = () => {
        // salvo la sequenza per ogni riga come numero binario
        let pattern = ''
        grid.forEach((row) => {
            let bin = ''
            row.forEach((step) => {
                if (step.isActive === 'active') {
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
                if (step.isActive === 'active') {
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

        console.log("load pattern n " + n)
        // inizialmente disattiva ogni step sulla griglia
        grid.forEach((row, rowInd) => {
            row.forEach((step, stepInd) => {
                step.isActive = 'not-active'
            })
        })
        console.log(patterns)
        // cerco il pattern (formato stringa) tramite il parametro n passato alla funzione
        let selectedPattern = patterns.find(p => p.id == n)
        console.log("pattern selezionato" + selectedPattern)
        //splitto il pattern per ottenere un array dove ogni elemento corrisponde al pattern (in formato decimale) della singola riga della grid
        let pattern = selectedPattern.pattern.split('|', 9);
        // modico l'array pattern per trasformare i numeri da decimali a binari
        pattern = pattern.map((row) => {
            row = parseInt(row).toString(2)
            // se il decimale trasformato in binario ha meno di 16 caratteri, aggiungo degli 0 all'inizio
            while (row.length !== 16) {
                row = 0 + row
            }
            return row
        })
        // nella griglia per ogni riga uso la sequenza binaria per attivare gli step nella giusta posizione
        // ciclo la griglia per ogni riga
        /*  grid.forEach((row, indR) => {
             // creo un array sequence dove splitto di volta in volta il numero binario presente all'indice indR (lo stesso della riga della griglia) nell'array pattern
             let sequence = pattern[indR].split('')
             // ciclo per ogni step nella riga
             row.forEach((step, ind) => {
                 // attivo il singolo step se trovo un valore 1 nel numero binario a quell'indice
                 if (sequence[ind] === 1) {
                     
                     step.isActive = 'active'
                 } else {
                    
                     step.isActive = 'not-active'
                 }
             })
         }) */
        // aggiorno la variabile di stato con il pattern appena caricato
        setCurrentPattern({ pattern: pattern, index: selectedPattern.id })
        console.log(currentPattern)
        console.log('loaded pattern n.', n)

    };

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
        console.log("indice del pattern corrente: " + patternN)
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

    // funzione che crea il loop di 4 battute (16 steps)
    const configLoop = () => {
        // creo una array kit che conterrà i sample del kit presente nella variabile di stato
        let kit = Array.from(currentKit._buffers._buffers)
        /* const repeat = (time) => {
            grid.forEach((row, index) => {
                let sample = kit[index][0]
                let step = row[beat]

                if (step.isActive === 'active') {
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
                if (step.isActive === 'active') {
                    currentKit.player(sample).start(time)
                }
            });
            // incremento il beat di uno e faccio il modulo di 16 così da avere sempre un valore compreso tra 0 e 15
            beat = (beat + 1) % 16;
            setBeat(beat)
        }, '16n') // RIVEDERE QUESTO PARAMETRO DI SCHEDULE REPEAT
    }

    // component did mount, eseguito all'avvio
    useEffect(() => {
        dispatch(getAllPatterns()).then(() => console.dir(patterns)) // prendo tutti i pattern
        console.log(error)
        console.log(" tutti i pattern:  " + patterns)
        /* setGrid(makeGrid(Array.from(currentKit._buffers._buffers))) // creo la griglia con il kit di default inizializzato nella variabile di stato */
        console.log("sample correnti: " + currentSample)
        console.log('did mount')

    }, [])

    useEffect(() => {
        console.log('caricati i pattern')

    }, [patterns])



    return (
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
    )
}
