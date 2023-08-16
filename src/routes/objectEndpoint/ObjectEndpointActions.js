import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Alert } from 'antd'
import { DropOption } from '../../components'

const confirm = Modal.confirm

function actions({ selected, deleteObjectEndpoint, editObjectEndpoint }) {
  const handleMenuClick = (event, record) => {
    switch (event.key) {
      case 'delete':
        confirm({
          title: `Are you sure you want to delete Object Endpoint ${record.name} ?`,
          content: <Alert
            description={`Longhorn will delete the volume associated with ${record.name} automatically.`}
            type="warning"
          />,
          width: 760,
          onOk() {
            deleteObjectEndpoint(record)
          },
        })
        break
      case 'edit':
        editObjectEndpoint(record)
        break
      default:
    }
  }

  const availableActions = [
    { key: 'edit', name: 'Edit' },
    { key: 'delete', name: 'Delete' },
  ]

  return (
    <DropOption menuOptions={availableActions}
      onMenuClick={(e) => handleMenuClick(e, selected)}
    />
  )
}

actions.propTypes = {
  selected: PropTypes.object,
  editObjectEndpoint: PropTypes.func,
  deleteObjectEndpoint: PropTypes.func,
}

export default actions
