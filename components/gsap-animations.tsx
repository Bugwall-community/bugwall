"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGSAPAnimations() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
          },
        )
      }

      // Stats cards animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.querySelectorAll(".stats-card"),
          {
            opacity: 0,
            y: 30,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }

      // Vulnerability cards animation
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.querySelectorAll(".vulnerability-card"),
          {
            opacity: 0,
            y: 40,
            rotationX: 15,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return { heroRef, statsRef, cardsRef }
}

export function AnimatedCounter({
  value,
  duration = 2,
}: {
  value: number
  duration?: number
}) {
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!countRef.current) return

    const counter = { value: 0 }

    gsap.to(counter, {
      value: value,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = Math.round(counter.value).toString()
        }
      },
      scrollTrigger: {
        trigger: countRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    })
  }, [value, duration])

  return <span ref={countRef}>0</span>
}
