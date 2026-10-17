import { afterEach, describe, expect, it, vi } from 'vitest'
import { ControlPlane } from './control-plane'

describe('ControlPlane', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('advances telemetry and incident state deterministically', () => {
    const plane = new ControlPlane()
    const initial = plane.getSnapshot()
    expect(initial.devices).toHaveLength(8)
    expect(initial.traffic['1h']).toHaveLength(60)
    const firstTime = initial.traffic['1h'][59].t

    plane.tick()
    const next = plane.getSnapshot()
    expect(next.tick).toBe(1)
    expect(next.traffic['1h'][59].t).toBeGreaterThan(firstTime)
    expect(next.lastUpdated).toBeGreaterThan(0)
  })

  it('pauses sampling and resumes without losing the incident state', () => {
    const plane = new ControlPlane()
    plane.setPaused(true)
    const pausedTick = plane.getSnapshot().tick
    plane.tick()
    expect(plane.getSnapshot().tick).toBe(pausedTick)
    expect(plane.getSnapshot().connection).toBe('paused')

    plane.setPaused(false)
    plane.injectApFailure('hall-ap')
    const incident = plane.getSnapshot()
    expect(incident.scenario).toBe('ap-offline')
    expect(incident.devices.find((device) => device.id === 'hall-ap')?.status).toBe('offline')
    expect(incident.alerts.some((alert) => alert.status === 'open')).toBe(true)
    expect(incident.ports['hall-ap'].every((port) => port.status === 'down')).toBe(true)
  })

  it('recovers an incident after a command round-trip', async () => {
    vi.useFakeTimers()
    const plane = new ControlPlane()
    plane.injectApFailure('hall-ap')
    const recovery = plane.recoverIncident()
    vi.advanceTimersByTime(1500)
    await recovery
    const recovered = plane.getSnapshot()
    expect(recovered.scenario).toBe('normal')
    expect(recovered.devices.find((device) => device.id === 'hall-ap')?.status).toBe('online')
    expect(recovered.alerts.every((alert) => alert.status === 'resolved')).toBe(true)
    expect(recovered.commands[0]?.status).toBe('success')
  })

  it('resets to a clean baseline', () => {
    const plane = new ControlPlane()
    plane.injectApFailure('hall-ap')
    plane.reset()
    const state = plane.getSnapshot()
    expect(state.scenario).toBe('normal')
    expect(state.alerts).toHaveLength(0)
    expect(state.devices.every((device) => device.status !== 'offline')).toBe(true)
  })
})
