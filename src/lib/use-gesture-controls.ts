"use client"

import { useEffect, useRef } from "react"

type GestureCallback = () => void

export function useGestureControls() {
  const gestureRef = useRef<{
    startX: number
    startY: number
    isTracking: boolean
  }>({
    startX: 0,
    startY: 0,
    isTracking: false,
  })

  const onGesture = (
    element: HTMLElement,
    callbacks: {
      onSwipeLeft?: GestureCallback
      onSwipeRight?: GestureCallback
      onSwipeUp?: GestureCallback
      onSwipeDown?: GestureCallback
    }
  ) => {
    const touchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      gestureRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        isTracking: true,
      }
    }

    const touchMove = (e: TouchEvent) => {
      if (!gestureRef.current.isTracking) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - gestureRef.current.startX
      const deltaY = touch.clientY - gestureRef.current.startY
      const minDistance = 50

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > minDistance && callbacks.onSwipeRight) {
          callbacks.onSwipeRight()
          gestureRef.current.isTracking = false
        } else if (deltaX < -minDistance && callbacks.onSwipeLeft) {
          callbacks.onSwipeLeft()
          gestureRef.current.isTracking = false
        }
      } else {
        if (deltaY > minDistance && callbacks.onSwipeDown) {
          callbacks.onSwipeDown()
          gestureRef.current.isTracking = false
        } else if (deltaY < -minDistance && callbacks.onSwipeUp) {
          callbacks.onSwipeUp()
          gestureRef.current.isTracking = false
        }
      }
    }

    const touchEnd = () => {
      gestureRef.current.isTracking = false
    }

    element.addEventListener("touchstart", touchStart)
    element.addEventListener("touchmove", touchMove)
    element.addEventListener("touchend", touchEnd)

    return () => {
      element.removeEventListener("touchstart", touchStart)
      element.removeEventListener("touchmove", touchMove)
      element.removeEventListener("touchend", touchEnd)
    }
  }

  return { onGesture }
}

