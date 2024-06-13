import React, { useState, useEffect }  from 'react'
import { Container } from 'react-bootstrap'


export default function Test() {
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


  return (
    <Container>
      <button className='note-rack'>TEST BUTTON</button>
      <button className={` note ${(pressedKey === 'z' || pressedKey === '1') ? 'actualStep' : ''}`}>Elemento Z-1</button>
      <button className={pressedKey === 'x' || pressedKey === '2' ? 'activeStep' : ''}>Elemento X-2</button>
      <button className={pressedKey === 'c' || pressedKey === '3' ? 'activeStep' : ''}>Elemento C-3</button>
    </Container>
  )
}