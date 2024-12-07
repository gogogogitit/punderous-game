import dynamic from 'next/dynamic'

// Preload the PunderousGame component
const PunderousGame = dynamic(() => import('./PunderousGame'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#00B4D8] flex items-center justify-center">
      <div className="text-white text-lg opacity-0 animate-fadeIn">
        Loading Punderous™...
      </div>
    </div>
  )
})

// Prefetch the puns data
async function prefetchPuns() {
  try {
    await fetch('/api/puns', { priority: 'high' })
  } catch (error) {
    console.error('Error prefetching puns:', error)
  }
}

export default function Home() {
  // Start prefetching as soon as the page component mounts
  if (typeof window !== 'undefined') {
    prefetchPuns()
  }

  return (
    <div className="min-h-screen bg-[#00B4D8]">
      <PunderousGame />
    </div>
  )
}