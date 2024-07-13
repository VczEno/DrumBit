import React, { useEffect, useState } from 'react'
import * as Tone from 'tone'


export default function RackPads({ drumrack, currentKit }) {


    // variabile di stato che contiene i sample
    let [currentSample, setCurrentSample] = useState(Array.from(currentKit._buffers._buffers))

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

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Pulisce i listener quando il componente viene smontato
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [])

    useEffect(() => console.log("UE rackpads"), [currentKit])

    return (
        <div className="row  justify-content-center" onKeyDown={e => playKeyBoard(e)} >

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
    )
}