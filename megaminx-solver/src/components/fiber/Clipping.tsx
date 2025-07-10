import { createContext, ReactNode, use } from "react"
import { Plane } from "three"

const ClippingPlaneContext = createContext<Plane | null>(null)

export function useClippingPlane() {
  return use(ClippingPlaneContext)
}

export function Clip({
  plane,
  children,
}: {
  plane: Plane | null
  children: ReactNode
}) {
  return (
    <ClippingPlaneContext.Provider value={plane}>
      {children}
    </ClippingPlaneContext.Provider>
  )
}

export function ClippingStandardMaterial(
  props: React.ComponentProps<"meshStandardMaterial">,
) {
  const plane = use(ClippingPlaneContext)
  return (
    <meshStandardMaterial clippingPlanes={plane ? [plane] : null} {...props} />
  )
}
