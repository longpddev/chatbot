import clsx from 'clsx'
import SpaceManager from '../space-manager';
import chatConfig from '../get-config';

interface IMainContentComponentProps {
  open: boolean
  space: SpaceManager
}
const url = new URL(import.meta.env.VITE_CHAT_CONTENT_URL)
url.hash = encodeURIComponent(JSON.stringify(chatConfig))
const MainContentComponent = ({ open, space }: IMainContentComponentProps) => {
  const contentSpace = space.chatContent();

  return (
    <iframe src={url.toString()} className={clsx(
      "shadow-[rgba(0,0,0,0.16)_0px_5px_40px]",
      "rounded-2xl opacity-100 transition-all fixed",
      {
        "scale-0": !open,
        "scale-100": open,
        "origin-bottom-right": contentSpace.position === 'right',
        "origin-bottom-left": contentSpace.position === 'left'
      }
    )}
    style={{
      width: contentSpace.width,
      bottom: contentSpace.bottom,
      left: contentSpace.left,
      right: contentSpace.right,
      minHeight: contentSpace.minHeight,
      maxHeight: contentSpace.maxHeight,
      height: `min(${contentSpace.maxHeight}px, 100% - ${contentSpace.bottom + 20}px)`
    }}
    ></iframe>
  )
}

export default MainContentComponent