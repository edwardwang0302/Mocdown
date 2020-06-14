import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'
import useIpcRenderer from '../hooks/useIpcRenderer'

const FileSearch = ({ title, onFileSearch }) => {
  const [ inputActive, setInputActive ] = useState(false)
  const [ value, setValue ] = useState('')
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  let node = useRef(null)
  const closeSearch = () => {
    setInputActive(false)
    setValue('')
    onFileSearch('')
  }
  useEffect(() => {
    if (enterPressed && inputActive) {
      onFileSearch(value)
    }
    if (escPressed && inputActive) {
      closeSearch()
    }
  })
  useEffect(() => {
    if (inputActive)
      node.current.focus()
  }, [inputActive])
  useIpcRenderer({
    'search-file': () => setInputActive(true)
  })
  return (
    <div
      className="alert alert-primary d-flex justify-content-between align-items-center mb-0 no-border"
      style={{ height: 48 }}
    >
      { !inputActive &&
        <>
          <span>{title}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => { setInputActive(true) }}
          >
            <FontAwesomeIcon
              title="搜索"
              icon={faSearch}
            />
          </button>
        </>
      }
      { inputActive &&
        <>
          <input
            className="form-control"
            value={value}
            ref={node}
            style={{ height: '100%', padding: 0}}
            onChange={(e) => { setValue(e.target.value) }}
          />
          <button
            type="button"
            className="icon-button"
            onClick={closeSearch}
          >
            <FontAwesomeIcon
              title="关闭"
              icon={faTimes}
            />
          </button>
        </>
      }
    </div>
  )
}

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title: 'MocDown'
}

export default FileSearch