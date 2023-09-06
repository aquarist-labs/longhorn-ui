import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Collapse, Select, Spin } from 'antd'
import { ModalBlur, SizeInput } from '../../components'

const FormItem = Form.Item
const Panel = Collapse.Panel
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 17,
  },
}

const formItemLayoutForAdvanced = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  },
  item,
  visible,
  diskTags,
  nodeTags,
  tagsLoading,
  onCancel,
  onOk,
}) => {
  function handleOk() {
    validateFields((errors) => {
      if (errors) { return }

      const data = {
        ...getFieldsValue(),
        size: `${getFieldsValue().size}${getFieldsValue().unit}`,
        staleReplicaTimeout: 2880,
      }

      if (data.unit) { delete data.unit }

      onOk(data)
    })
  }

  const modalOpts = {
    title: 'Create Object Store',
    visible,
    onCancel,
    width: 800,
    onOk: handleOk,
    style: { top: 0 },
  }

  const sizeInputProps = {
    state: item,
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  }

  return (
    <ModalBlur {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: 'Please input Object Store name',
              },
            ],
          })(<Input style={{ width: '80%' }} />)}
        </FormItem>
        <SizeInput {...sizeInputProps}>
        </SizeInput>
        <FormItem label="Access Key" hasFeedback {...formItemLayout}>
          {getFieldDecorator('accesskey', {
            initialValue: item.accesskey,
            rules: [
              {
                required: true,
                message: 'Please input an access key',
              },
            ],
          })(<Input style={{ width: '80%' }} />)}
        </FormItem>
        <FormItem label="Secret Key" hasFeedback {...formItemLayout}>
          {getFieldDecorator('secretkey', {
            initialValue: item.secretkey,
            rules: [
              {
                required: true,
                message: 'Please input a secret key',
              },
            ],
          })(<Input style={{ width: '80%' }} />)}
        </FormItem>
        <Collapse>
          <Panel header="Advanced Configurations" key="1">
            <FormItem label="Number of Replicas" hasFeedback {...formItemLayoutForAdvanced}>
              {getFieldDecorator('numberOfReplicas', {
                initialValue: item.numberOfReplicas,
                rules: [
                  {
                    required: true,
                    message: 'Please input the number of replicas',
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (value === '' || typeof value !== 'number') {
                        callback()
                        return
                      }
                      if (value < 1 || value > 10) {
                        callback('The value should be between 1 and 10')
                      } else if (!/^\d+$/.test(value)) {
                        callback('The value must be a positive integer')
                      } else {
                        callback()
                      }
                    },
                  },
                ],
              })(<InputNumber />)}
            </FormItem>

            <Spin spinning={tagsLoading}>
              <FormItem label="Node Tag" hasFeedback {...formItemLayout}>
                {getFieldDecorator('nodeSelector', {
                  initialValue: [],
                })(<Select mode="tags">
                { nodeTags.map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>) }
                </Select>)}
              </FormItem>
            </Spin>
            <Spin spinning={tagsLoading}>
              <FormItem label="Disk Tag" hasFeedback {...formItemLayout}>
                {getFieldDecorator('diskSelector', {
                  initialValue: [],
                })(<Select mode="tags">
                { diskTags.map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>) }
                </Select>)}
              </FormItem>
            </Spin>

            <FormItem label="Replica Soft Anti Affinity" hasFeedback {...formItemLayoutForAdvanced}>
              {getFieldDecorator('replicaSoftAntiAffinity', {
                initialValue: 'ignored',
              })(<Select>
                <Option key={'enabled'} value={'enabled'}>Enabled</Option>
                <Option key={'disabled'} value={'disabled'}>Disabled</Option>
                <Option key={'ignored'} value={'ignored'}>Ignored (Follow the global setting)</Option>
              </Select>)}
            </FormItem>
            <FormItem label="Replica Zone Soft Anti Affinity" hasFeedback {...formItemLayoutForAdvanced}>
              {getFieldDecorator('replicaZoneSoftAntiAffinity', {
                initialValue: 'ignored',
              })(<Select>
                <Option key={'enabled'} value={'enabled'}>Enabled</Option>
                <Option key={'disabled'} value={'disabled'}>Disabled</Option>
                <Option key={'ignored'} value={'ignored'}>Ignored (Follow the global setting)</Option>
              </Select>)}
            </FormItem>
          </Panel>
        </Collapse>
      </Form>
    </ModalBlur>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  diskTags: PropTypes.array,
  nodeTags: PropTypes.array,
  visible: PropTypes.bool,
  tagsLoading: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)