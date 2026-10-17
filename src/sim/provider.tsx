import * as React from 'react'
import { ControlPlane } from './control-plane'
import type { SimState } from './types'

const SimulationContext = React.createContext<ControlPlane | null>(null)

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [store] = React.useState(() => new ControlPlane())

  React.useEffect(() => {
    store.start()
    return () => store.stop()
  }, [store])

  return <SimulationContext.Provider value={store}>{children}</SimulationContext.Provider>
}

export function useControlPlane() {
  const store = React.useContext(SimulationContext)
  if (!store) throw new Error('useControlPlane must be used inside SimulationProvider')
  return store
}

export function useSimulation<T>(selector: (state: SimState) => T): T {
  const store = useControlPlane()
  return React.useSyncExternalStore(
    store.subscribe,
    () => selector(store.getSnapshot()),
    () => selector(store.getSnapshot()),
  )
}

export function useSimulationState() {
  return useSimulation((state) => state)
}
