import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import React from 'react';
import MainLayout from "../../components/MainLayoout/PageLayout"
import Const from '../../lib/constant';
const { Dragger } = Upload;

export default function UploadFile() {
    const props: UploadProps = {
        name: 'file',
        multiple: false,
        accept: ".zip",
        action: `${Const.testserver}/upload_files`,
        onChange(info) {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`)
            console.log(info.file.originFileObj);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
        onDrop(e) {
          console.log('Dropped files', e.dataTransfer.files);
        },
      };
    return (
        <MainLayout>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此处以上传</p>
                <p className="ant-upload-hint">
                仅支持zip格式压缩包上传
                </p>
            </Dragger>
        </MainLayout>
    )
}
