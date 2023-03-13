import { useEffect, useState } from "react"

const Loader = () => {
  const [dots, setDots] = useState(0)

  useEffect(() => {
    let timerId = null

    const run = () => {
      setDots((dots) => (dots + 1) % 4)

      setTimeout(run, 250)
    }

    run()

    return () => clearTimeout(timerId)
  }, [])

  return (
    <span className="text-4xl font-bold">
      Loading
      <span className={dots >= 1 ? "" : "invisible"}>.</span>
      <span className={dots >= 2 ? "" : "invisible"}>.</span>
      <span className={dots >= 3 ? "" : "invisible"}>.</span>
    </span>
  )
}

export default Loader
