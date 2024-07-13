import React, { useEffect } from 'react'

export default function Grid({ beat, grid, setGrid, currentKit, currentSample, currentPattern }) {


    const makeGrid = (kit) => {
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

    const loadPattern = (n) => {

        console.log("load pattern n " + n)
        // inizialmente disattiva ogni step sulla griglia
        grid.forEach((row, rowInd) => {
            row.forEach((step, stepInd) => {
                step.isActive = 'not-active'
            })
        })
        /* console.log(patterns)
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
        }) */
        // nella griglia per ogni riga uso la sequenza binaria per attivare gli step nella giusta posizione
        // ciclo la griglia per ogni riga
        grid.forEach((row, indR) => {
            // creo un array sequence dove splitto di volta in volta il numero binario presente all'indice indR (lo stesso della riga della griglia) nell'array pattern
            let sequence = currentPattern.pattern[indR].split('')
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

        console.log(currentPattern)
        console.log('loaded pattern n.', n)

    };

    useEffect(() => {
        loadPattern(currentPattern.index)
        setGrid(makeGrid(Array.from(currentKit._buffers._buffers)))

    }, [currentPattern])

    useEffect(() => {

        console.dir(currentKit)
        console.log(currentSample)

    }, [currentKit])


    return (
        < div className='d-lg-flex flex-column  align-items-center col-10'>
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

    )
}
