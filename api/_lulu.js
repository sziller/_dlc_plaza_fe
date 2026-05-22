import axios from 'axios'

export async function getLuluToken() {
  const credentials = Buffer.from(
    `${process.env.LULU_CLIENT_KEY}:${process.env.LULU_CLIENT_SECRET}`
  ).toString('base64')

  const res = await axios.post(
    'https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
  return res.data.access_token
}

export async function createLuluPrintJob(invoiceId, { quantity, shipping }) {
  const token = await getLuluToken()

  const shippingAddress = {
    name: `${shipping.firstName} ${shipping.lastName}`.trim(),
    street1: shipping.street1,
    city: shipping.city,
    country_code: shipping.country,
    postcode: shipping.postcode,
    phone_number: shipping.phone,
  }
  if (shipping.street2) shippingAddress.street2 = shipping.street2
  if (shipping.state) shippingAddress.state_code = shipping.state

  const res = await axios.post(
    'https://api.lulu.com/print-jobs/',
    {
      external_id: `sbp-${invoiceId}`,
      contact_email: process.env.LULU_CONTACT_EMAIL || 'noah@cadenabitcoin.com',
      shipping_level: 'MAIL',
      line_items: [
        {
          external_id: `item-${invoiceId}`,
          pod_package_id: '0600X0900.BW.STD.PB.060UW444.MXX',
          quantity,
          interior: { source_url: process.env.BOOK_INTERIOR_URL },
          cover: { source_url: process.env.BOOK_COVER_URL },
        },
      ],
      shipping_address: shippingAddress,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return res.data
}
