import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import RackPads from '../components/RackPads'
import Controls from '../components/Controls'
import { useDispatch, useSelector } from 'react-redux'
import * as Tone from 'tone'
import Grid from '../components/Grid'
import { getAllPatterns } from '../slice/patternSlice'




export default function Homepage() {
  // qui posso definire tutte le variabili di stato e gli store necessari, da passare ai componenti
  const kits = useSelector(state => state.kit.kitList)
  let drumrack = new Tone.Players(kits[0].sample).toDestination()
  const patterns = useSelector(state => state.pattern.patternList)

  let [grid, setGrid] = useState([])
  let [beat, setBeat] = useState(0)
  let [currentPattern, setCurrentPattern] = useState({ pattern: null, index: null })
  let [currentKit, setCurrentKit] = useState(drumrack)
  let [currentSample, setCurrentSample] = useState(Array.from(currentKit._buffers._buffers))
  let dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllPatterns()) // prendo tutti i pattern
    console.dir(patterns)
  }, [])

  return (
    <Container>

      <div className='text-center'>
        <h1>Beat.it</h1>
        <h2>Prova a fare le tue robette</h2>
      </div>
      <div className='text-center d-flex  justify-content-center my-5'>
        <div className='col'>
          <RackPads drumrack={drumrack} currentKit={currentKit} />


          <Controls drumrack={drumrack} kits={kits} grid={grid} beat={beat} setBeat={setBeat} currentPattern={currentPattern} setCurrentPattern={setCurrentPattern} patterns={patterns} currentKit={currentKit} setCurrentKit={setCurrentKit} />
        </div>
        <Grid beat={beat} grid={grid} setGrid={setGrid} currentKit={currentKit} currentSample={currentSample} currentPattern={currentPattern} />
      </div>
    </Container>
  )
}

