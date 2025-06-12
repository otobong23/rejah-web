'use client';
import { QRCodeCanvas } from 'qrcode.react';
import { FC } from 'react';

type QRCodeGeneratorProps = {
    address: string,
}

const QRCodeGenerator:FC<QRCodeGeneratorProps> = ({ address }) => {
  // Create a URI for different wallet types

  return (
    <div>
      <QRCodeCanvas value={address} size={256} />
    </div>
  );
};

export default QRCodeGenerator;