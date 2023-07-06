import clsx from 'clsx'
import { ChatLogo } from '../../icons/ChatLogo'
import { useState } from 'preact/hooks'
import ChevronDown from '../../icons/ChevronDown'
import SpaceManager from '../space-manager'

interface IChartBtnComponentProps {
  openSet: (s: boolean) => void
  open: boolean
  space: SpaceManager
}

export default function ChartBtnComponent ({ openSet, open, space }: IChartBtnComponentProps) {
  const spaceButton = space.button()
  return <button
    className={clsx(
      "fixed rounded-full",
      "bg-blue-primary hover:scale-110 transition-all",
      "active:scale-[0.85] z-[100]",
      "chat-button"
    )}
    style={{
      width: spaceButton.width,
      height: spaceButton.height,
      left: spaceButton.left,
      right: spaceButton.right,
      bottom: spaceButton.bottom
    }}
    onClick={() => openSet(!open)}
  >
    <ChevronDown className={clsx(
      "transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      {
        "-rotate-[60deg] opacity-0": !open,
        "opacity-100 rotate-0": open
      }
    )} />
    <ChatLogo className={clsx(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      "text-white w-6 h-6",
      "transition-all",
      {
        "rotate-0 scale-100 opacity-100": !open,
        "opacity-0 scale-0 rotate-[30deg]": open
      }
    )} />

  </button>
}