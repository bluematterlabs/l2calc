import { Popover } from '@headlessui/react'
import { useState } from 'react'

type Props = {
  message: string | React.ReactNode
  children: React.ReactNode
}
const TooltipContainer: React.FC<Props> = ({ message, children }) => {
  const [isShow, setIsShow] = useState(false)

  return (
    <Popover className="relative inline-block">
      <div
        onMouseEnter={() => setIsShow(true)}
        onMouseLeave={() => setIsShow(false)}
      >
        {children}
      </div>

      {isShow && (
        <Popover.Panel static className="absolute z-100 left-80 top-0 px-4">
          <div className="overflow-hidden rounded shadow-lg">
            <div className="relative font-normal bg-white/90 p-4 text-slate-600 text-xs w-60">
              {message}
            </div>
          </div>
        </Popover.Panel>
      )}
    </Popover>
  )
}

export default TooltipContainer
