"use client"

import { ComponentProps, useEffect, useRef } from "react"

const constraints: MediaStreamConstraints = {
  audio: false,
  video: true,
}

export default function Camera(props: ComponentProps<"video">) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let cameraStream: MediaStream | undefined
    let videoTracks: MediaStreamTrack[]
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(async (stream) => {
        cameraStream = stream
        videoTracks = stream.getVideoTracks()
        console.log("Got stream with constraints:", constraints)
        console.log(`Using video device: ${videoTracks[0].label}`)
        stream.onremovetrack = () => {
          console.log("Stream ended")
        }
        console.log("Video Tracks:", videoTracks)
        console.log("Stream:", stream)
        console.log("Video:", videoRef.current)
        if (!videoRef.current) return
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      })
      .catch((error: Error) => {
        if (error.name === "OverconstrainedError") {
          console.error(`The resolution is not supported by your device.`)
        } else if (error.name === "NotAllowedError") {
          console.error(
            "You need to grant this page permission to access your camera and microphone.",
          )
        } else {
          console.error(`getUserMedia error: ${error.name}`, error)
        }
      })
    return () => cameraStream && cameraStream.removeTrack(videoTracks[0])
  }, [videoRef])

  return <video {...props} ref={videoRef}></video>
}
