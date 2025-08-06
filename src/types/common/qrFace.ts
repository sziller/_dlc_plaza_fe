export interface QRProps {
  svg: string;
  containerClassName?: string;
  contentClassName?: string;
}


export interface QRCodeUser {
  qr_code: string;
  string: string;
}

export interface QRCodeAddress {
  string: string; // The new address in hexstring format
  qr_code: string; // The QR code in SVG format
}

export interface QRCodeUserResponse {
  payload: QRCodeUser;
  message: string;
  timestamp: number;
}

export interface QRCodeAddressResponse {
  payload: QRCodeAddress;
  message: string;
  timestamp: number;
}
