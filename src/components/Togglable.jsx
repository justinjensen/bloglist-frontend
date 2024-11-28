import { useState } from 'react'

const Togglable = ({
  showButtonLabel = 'view',
  hideButtonLabel = 'hide',
  children
}) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{showButtonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>{hideButtonLabel}</button>
      </div>
    </div>
  )
}

export default Togglable
