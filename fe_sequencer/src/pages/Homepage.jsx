import React from 'react'
import {Container} from 'react-bootstrap'
import Sequencer from '../components/Sequencer'



export default function Nav() {
    return (
      <Container>
        <div className='text-center'>
            <h1>Beat.it</h1>
            <h2>Prova a fare le tue robette</h2>
        </div>
        
        <Sequencer/>

      </Container>
    )
  }

