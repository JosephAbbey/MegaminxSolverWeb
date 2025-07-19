"use client"

import { useEffect } from "react"

export function useKeyPress<T extends HTMLElement>(
  key: KeyboardEvent["key"],
  cb: (event: KeyboardEvent) => void,
  options: {
    event?: "keydown" | "keyup"
    target?: T
    eventOptions?: AddEventListenerOptions | boolean
  } = {},
) {
  const { event = "keydown", target, eventOptions } = options

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === key) {
        cb(event)
      }
    }

    ;(target ?? window).addEventListener(
      event,
      handler as EventListener,
      eventOptions,
    )

    return () => {
      ;(target ?? window).removeEventListener(
        event,
        handler as EventListener,
        eventOptions,
      )
    }
  }, [key, target, event, eventOptions, cb])
}
