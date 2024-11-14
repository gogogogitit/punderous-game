import { Suspense } from 'react'
import PunderousGame from './PunderousGame'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PunderousGame />
    </Suspense>
  )
}