import React from "react"
import { useSelector } from "react-redux"

import OnePeerLayout from "./OnePeerLayout"
import TwoPeerLayout from "./TwoPeerLayout"
import FourPeerLayout from "./FourPeerLayout"
import ThreePeerLayout from "./ThreePeerLayout"
import { selectOtherPeers } from "../../../../redux/slices/ConnectionSlice"

const PeerSection = () => {
  const peers = useSelector(selectOtherPeers)

  const SuitableLayout = () => {
    let layout

    switch (peers.length) {
      case 0:
        layout = <OnePeerLayout />
        break
      case 1:
        layout = <TwoPeerLayout />
        break
      case 2:
        layout = <ThreePeerLayout />
        break
      default:
        layout = <FourPeerLayout />
    }

    return (
      layout
    )
  }

  return (
    <SuitableLayout />
  )
}

export default React.memo(PeerSection)